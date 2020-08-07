import Command from "~/Command";
import { Message } from "eris";

export default class Ping extends Command {
    constructor(category: string) {
        super({
            name: "heroes",
            description: "Get a list of your heroes",
            usage: "heroes [class]",
            example: "heroes dh",
            category
        });
    }

    async run(msg: Message): Promise<void> {
        await msg.channel.createMessage("Not implemented yet!");
    }
}
