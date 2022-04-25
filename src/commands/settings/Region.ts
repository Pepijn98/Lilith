import { SlashCommand, SlashCreator, CommandContext, CommandOptionType, AutocompleteContext } from "slash-create";
import { regions } from "~/utils/Helpers";

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
                    required: true,
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
        return `You chose: ${ctx.options.region}`;
    }
}
