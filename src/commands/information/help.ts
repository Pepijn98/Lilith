import { SlashCommand, SlashCreator, CommandContext } from "slash-create";

export default class HelpCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "help",
            description: "Something about this command"
        });
    }

    async run(ctx: CommandContext): Promise<string> {
        await ctx.defer();
        return "Not implemented yet";
    }
}
