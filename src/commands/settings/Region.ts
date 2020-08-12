import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Users from "~/models/User";
import settings from "~/settings";
import { Message } from "eris";
import { regions, isGuildChannel } from "~/utils/Utils";

export default class extends Command {
    constructor(ctx: CommandContext) {
        super({
            name: "region",
            description: "Update the region you set",
            usage: "region <region>",
            example: "locale eu",
            category: ctx.category
        });
    }

    async run(msg: Message, args: string[]): Promise<void> {
        let prefix = settings.prefix;
        if (isGuildChannel(msg.channel)) {
            prefix = msg.channel.guild.prefix;
        }

        const user = await Users.findOne({ uid: msg.author.id }).exec();
        if (!user) {
            await msg.channel.createMessage(`Please use \`${prefix}setup\` before using this command`);
            return;
        }

        if (args.length >= 1) {
            const region = args[0].trim();
            if (!regions.includes(region)) {
                await msg.channel.createMessage("Invalid region");
                return;
            }

            await user.updateOne({ region }).exec();
            await msg.channel.createMessage("Updated region");
        } else {
            await msg.channel.createMessage(`Your current region is \`${user.region}\``);
        }
    }
}
