import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Users from "~/models/User";
import { Message } from "eris";
import { rbattleTag } from "~/utils/Utils";

export default class extends Command {
    constructor(ctx: CommandContext) {
        super({
            name: "tag",
            description: "Update the battle tag you set",
            usage: "tag <tag>",
            example: "tag Kurozero#21247",
            requiredArgs: 1,
            category: ctx.category
        });
    }

    async run(msg: Message, args: string[]): Promise<void> {
        const tag = args[0].trim();
        if (!rbattleTag.test(tag)) {
            await msg.channel.createMessage("Invalid battle tag");
            return;
        }

        await Users.findOneAndUpdate({ uid: msg.author.id }, { battleTag: tag }).exec();
        await msg.channel.createMessage("Updated battle tag");
    }
}
