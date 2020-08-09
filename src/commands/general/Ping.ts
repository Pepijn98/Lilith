import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import { Message } from "eris";

export default class extends Command {
    constructor(ctx: CommandContext) {
        super({
            name: "ping",
            description: "Testing the bot",
            usage: "ping",
            example: "ping",
            category: ctx.category
        });
    }

    async run(msg: Message): Promise<void> {
        await msg.channel.createMessage("Pong!");
    }
}
