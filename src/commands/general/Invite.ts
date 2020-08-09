import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Lilith from "~/utils/Client";
import { Message } from "eris";

export default class extends Command {
    client: Lilith;

    constructor(ctx: CommandContext) {
        super({
            name: "invite",
            description: "YEP",
            usage: "invite [permissions]",
            example: "invite 388160",
            category: ctx.category
        });

        this.client = ctx.client;
    }

    async run(msg: Message, args: string[]): Promise<void> {
        await msg.channel.createMessage(`<https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=${args.length > 0 ? args[0] : 388160}>`);
    }
}
