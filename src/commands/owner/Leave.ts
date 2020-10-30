import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Lilith from "~/utils/Client";
import Guilds from "~/models/Guild";
import { Message } from "eris";

export default class extends Command {
    client: Lilith;

    constructor(ctx: CommandContext) {
        super({
            name: "leave",
            description: "Make the bot leave a guild",
            usage: "leave <id: number> [blacklist: boolean]",
            example: "leave 12345678901234 true",
            category: ctx.category,
            ownerOnly: true,
            requiredArgs: 1
        });

        this.client = ctx.client;
    }

    async run(msg: Message, args: string[]): Promise<void> {
        const guildId = args[0];
        const guild = this.client.guilds.get(guildId);
        if (guild) {
            await guild.leave();
            await Guilds.findOneAndDelete({ uid: guildId }).exec();
            await msg.channel.createMessage(`Left guild **${guild.name}**`);

            const blacklist = args[1];
            if (blacklist) {
                // TODO : Add guild to blacklist
            }
        } else {
            await msg.channel.createMessage(`Could not find guild with id **${guildId}**`);
        }
    }
}
