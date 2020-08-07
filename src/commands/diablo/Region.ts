import Command from "~/Command";
import { Message } from "eris";

export default class extends Command {
    constructor(category: string) {
        super({
            name: "region",
            description: "",
            usage: "",
            example: "",
            category: category
        });
    }

    async run(msg: Message): Promise<void> {
        await msg.channel.createMessage("Not yet implemented, check back later");
    }
}
