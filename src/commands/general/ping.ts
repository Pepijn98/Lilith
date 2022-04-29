import Lilith from "../../utils/Lilith";

import { CommandContext, SlashCommand, SlashCreator } from "slash-create";

export default class PingCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "ping",
            description: "Pong"
        });
    }

    async run(ctx: CommandContext): Promise<string> {
        await ctx.defer();
        return "No.";
    }
}
