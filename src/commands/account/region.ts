import { SlashCommand, SlashCreator, CommandContext, CommandOptionType, AutocompleteContext, AutocompleteChoice } from "slash-create";
import { getDBUser } from "../../utils/Helpers";

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

const defaultLocales: Record<string, string> = {
    us: "en_US",
    eu: "en_GB",
    kr: "ko_KR",
    tw: "zh_TW",
    cn: "zh_CN"
};

export default class RegionCommand extends SlashCommand {
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
            return "⚠️ Please use the `/setup` command before using any of the other Diablo related commands.";
        }

        if (ctx.options.region) {
            try {
                const defaultLocale = defaultLocales[ctx.options.region];
                await user.updateOne({ region: ctx.options.region, locale: defaultLocale }).exec();
                return `✅ Success updating region.\nℹ️ Because you changed region, the locale changed to the default \`${defaultLocale}\`.`;
            } catch (e) {
                return "❌ Failed updating region.";
            }
        } else {
            return `ℹ️ Your current region is: \`${user.region}\`.`;
        }
    }
}
