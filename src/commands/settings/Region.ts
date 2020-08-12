import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import { Message } from "eris";
import { regions } from "~/utils/Utils";
import Users from "~/models/User";

export default class extends Command {
    constructor(ctx: CommandContext) {
        super({
            name: "region",
            description: "Update the region you set",
            usage: "region <region>",
            example: "locale eu",
            requiredArgs: 1,
            category: ctx.category
        });
    }

    async run(msg: Message, args: string[]): Promise<void> {
        const region = args[0].trim();
        if (!regions.includes(region)) {
            await msg.channel.createMessage("Invalid region");
            return;
        }

        await Users.findOneAndUpdate({ uid: msg.author.id }, { region }).exec();
        await msg.channel.createMessage("Updated region");
    }
}
