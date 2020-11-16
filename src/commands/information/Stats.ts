import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Lilith from "~/utils/Client";
import { version } from "@/package.json";
import { formatSeconds } from "~/utils/Utils";
import { Message, GuildChannel } from "eris";

export default class extends Command {
    client: Lilith;

    constructor(ctx: CommandContext) {
        super({
            name: "stats",
            description: "Show bot statistics",
            usage: "stats",
            example: "stats",
            guildOnly: true,
            category: ctx.category
        });

        this.client = ctx.client;
    }

    async run(msg: Message): Promise<Message | undefined> {
        return msg.channel.createMessage({
            embed: {
                color: 0,
                author: {
                    name: "Lilith",
                    url: "https://github.com/Pepijn98/Lilith",
                    icon_url: this.client.user.avatarURL
                },
                thumbnail: {
                    url: this.client.user.avatarURL
                },
                fields: [
                    { name: "Memory", value: `${Math.round(process.memoryUsage().rss / 1024 / 1000)}MB`, inline: true },
                    { name: "Shards", value: `Current: ${(msg.channel as GuildChannel).guild.shard.id}\nTotal: ${this.client.shards.size}`, inline: true },
                    { name: "Version", value: version, inline: true },
                    { name: "Node Version", value: process.version, inline: true },
                    { name: "Guilds", value: String(this.client.guilds.size), inline: true },
                    { name: "Channels", value: String(Object.keys(this.client.channelGuildMap).length), inline: true },
                    { name: "Users", value: String(this.client.users.size), inline: true },
                    { name: "Average Users/Guild", value: String((this.client.users.size / this.client.guilds.size).toFixed(2)), inline: true },
                    { name: "Commands Used", value: String(this.client.stats.commandsExecuted), inline: true },
                    { name: "Average Cmd/Min", value: `${(this.client.stats.commandsExecuted / (this.client.uptime / (1000 * 60))).toFixed(2)}/min`, inline: true }
                ],
                footer: {
                    text: `Uptime: ${formatSeconds(process.uptime())}`
                }
            }
        });
    }
}
