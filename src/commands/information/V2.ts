import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Lilith from "~/utils/Client";
import { Message } from "eris";

export default class extends Command {
    client: Lilith;

    constructor(ctx: CommandContext) {
        super({
            name: "v2",
            description: "Info about version 2",
            usage: "v2",
            example: "v2",
            category: ctx.category
        });

        this.client = ctx.client;
    }

    async run(msg: Message): Promise<Message | undefined> {
        return msg.channel.createMessage("V2 is almost here!\nMore info: https://github.com/Pepijn98/Lilith/wiki/v2.0");
    }
}
