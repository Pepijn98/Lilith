import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Guilds from "~/models/Guild";
import Lilith from "~/utils/Client";
import settings from "~/settings";
import { Message } from "eris";
import { isGuildChannel } from "~/utils/Utils";

export default class extends Command {
    client: Lilith;

    constructor(ctx: CommandContext) {
        super({
            name: "prefix",
            description: "Set custom prefix",
            usage: "prefix [new_prefix|reset]",
            example: "prefix .",
            userPermissions: ["manageGuild"],
            guildOnly: true,
            category: ctx.category
        });

        this.client = ctx.client;
    }

    async run(msg: Message, args: string[]): Promise<void> {
        if (isGuildChannel(msg.channel)) {
            // If no args show current prefix
            if (!args.length) {
                await msg.channel.createMessage(`Current prefix is \`${msg.channel.guild.prefix}\``);
                return;
            }

            // If reset, reset the prefix to the default one
            if (args[0] === "reset") {
                await Guilds.findOneAndUpdate({ uid: msg.channel.guild.id }, { prefix: settings.prefix }).exec();
                msg.channel.guild.prefix = settings.prefix;
                await msg.channel.createMessage(`Resetted prefix to the default \`${settings.prefix}\``);
                return;
            }

            // Set new prefix
            await Guilds.findOneAndUpdate({ uid: msg.channel.guild.id }, { prefix: args.join(" ") }).exec();
            msg.channel.guild.prefix = args.join(" ");
            await msg.channel.createMessage(`Prefix has been set to \`${args.join(" ")}\``);
        }
    }
}
