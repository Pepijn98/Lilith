import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Users from "~/models/User";
import settings from "~/settings";
import { Message } from "eris";
import { rbattleTag, isGuildChannel } from "~/utils/Utils";

export default class extends Command {
    constructor(ctx: CommandContext) {
        super({
            name: "tag",
            description: "Update the battle tag you set",
            usage: "tag [tag]",
            example: "tag Kurozero#21247",
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
            const tag = args[0].trim();
            if (!rbattleTag.test(tag)) {
                await msg.channel.createMessage("Invalid battle tag");
                return;
            }

            await user.updateOne({ battleTag: tag }).exec();
            await msg.channel.createMessage("Updated battle tag");
        } else {
            await msg.channel.createMessage(`Your current battle tag is \`${user.battleTag}\``);
        }
    }
}
