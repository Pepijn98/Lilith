import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Users from "~/models/User";
import settings from "~/settings";
import Lilith from "~/utils/Client";
import { Message } from "eris";
import { rbattleTag, isGuildChannel } from "~/utils/Utils";

export default class extends Command {
    client: Lilith;

    constructor(ctx: CommandContext) {
        super({
            name: "tag",
            description: "Update the battle tag you set",
            usage: "tag [tag]",
            example: "tag Kurozero#21247",
            category: ctx.category
        });

        this.client = ctx.client;
    }

    async run(msg: Message, args: string[]): Promise<void> {
        let prefix = settings.prefix;
        if (isGuildChannel(msg.channel)) {
            prefix = this.client.guildPrefixMap.get(msg.channel.guild.id) || settings.prefix;
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
