import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import { Message } from "eris";

export default class extends Command {
    constructor(ctx: CommandContext) {
        super({
            name: "tag",
            description: "",
            usage: "",
            example: "",
            category: ctx.category
        });
    }

    async run(msg: Message): Promise<void> {
        await msg.channel.createMessage("Not yet implemented, check back later");
    }
}
