import { SlashCommand, SlashCreator, CommandContext } from "slash-create";

export default class HeroesCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "heroes",
            description: "Something about this command"
        });
    }

    async run(ctx: CommandContext): Promise<string> {
        await ctx.defer();
        return "Not implemented yet";
    }
}
