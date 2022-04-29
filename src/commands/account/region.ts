import Embed from "../../utils/Embed";
import Lilith from "../../utils/Lilith";

import { AutocompleteChoice, AutocompleteContext, CommandContext, CommandOptionType, SlashCommand, SlashCreator } from "slash-create";
import { defaultLocales, getDBUser } from "../../utils/Helpers";

const regions: AutocompleteChoice[] = [
    {
        name: "United States",
        value: "us"
    },
    {
        name: "Europe",
        value: "eu"
    },
    {
        name: "Korea",
        value: "kr"
    },
    {
        name: "Taiwan",
        value: "tw"
    },
    {
        name: "China",
        value: "cn"
    }
];

export default class RegionCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "region",
            description: "Update your region",
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: "region",
                    description: "The region your characters are on",
                    autocomplete: true
                }
            ]
        });
    }

    async autocomplete(ctx: AutocompleteContext): Promise<void> {
        ctx.sendResults(regions);
    }

    async run(ctx: CommandContext): Promise<string> {
        await ctx.defer();

        const user = await getDBUser(ctx.user.id);
        if (!user) {
            Embed.Warning(ctx, "⚠️ Please use the `/setup` command before using any of the other Diablo related commands.");
            return;
        }

        if (ctx.options.region) {
            try {
                const defaultLocale = defaultLocales[ctx.options.region];
                await user.updateOne({ region: ctx.options.region, locale: defaultLocale }).exec();
                await Embed.Success(ctx, `✅ Success updating region.\nℹ️ Because you changed region, the locale changed to the default \`${defaultLocale}\`.`);
            } catch (e) {
                await Embed.Danger(ctx, "❌ Failed updating region.");
                return;
            }
        } else {
            await Embed.Info(ctx, `ℹ️ Your current region is: \`${user.region}\`.`);
        }
    }
}
