import { SlashCommand, SlashCreator, CommandContext, CommandOptionType, AutocompleteContext } from "slash-create";
import { getDBUser, localeMap } from "~/utils/Helpers";

export default class LocaleCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "locale",
            description: "Set locale for api response data from blizzard (does NOT change locale for the bot)",
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: "locale",
                    description: "Allowed locale(s) for your region",
                    required: true,
                    autocomplete: true
                }
            ]
        });
    }

    async autocomplete(ctx: AutocompleteContext): Promise<void> {
        const user = await getDBUser(ctx.user.id);
        ctx.sendResults(localeMap[user.region]);
    }

    async run(ctx: CommandContext): Promise<string> {
        await ctx.defer();
        return `You chose: ${ctx.options.locale}`;
    }
}
