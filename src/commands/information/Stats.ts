import Command from "~/Command";
import Lilith from "~/structures/Client";
import { version } from "@/package.json";
import { formatSeconds } from "~/utils/Helpers";
import { Message, GuildChannel } from "eris";

export default class Stats extends Command {
    constructor(category: string) {
        super({
            name: "stats",
            description: "",
            usage: "stats",
            example: "stats",
            category: category,
            guildOnly: true
        });
    }

    async run(msg: Message, _args: string[], client: Lilith): Promise<Message | undefined> {
        return msg.channel.createMessage({
            embed: {
                color: 0,
                author: {
                    name: "Lilith",
                    url: "https://github.com/Pepijn98/Lilith",
                    icon_url: client.user.avatarURL
                },
                thumbnail: {
                    url: client.user.avatarURL
                },
                fields: [
                    { name: "Memory", value: `${Math.round(process.memoryUsage().rss / 1024 / 1000)}MB`, inline: true },
                    { name: "Shards", value: `Current: ${(msg.channel as GuildChannel).guild.shard.id}\nTotal: ${client.shards.size}`, inline: true },
                    { name: "Version", value: version, inline: true },
                    { name: "Node Version", value: process.version, inline: true },
                    { name: "Guilds", value: String(client.guilds.size), inline: true },
                    { name: "Channels", value: String(Object.keys(client.channelGuildMap).length), inline: true },
                    { name: "Users", value: String(client.users.size), inline: true },
                    { name: "Average Users/Guild", value: String((client.users.size / client.guilds.size).toFixed(2)), inline: true },
                    { name: "Commands Used", value: String(client.stats.commandsExecuted), inline: true },
                    { name: "Average Cmd/Min", value: `${(client.stats.commandsExecuted / (client.uptime / (1000 * 60))).toFixed(2)}/min`, inline: true }
                ],
                footer: {
                    text: `Uptime: ${formatSeconds(process.uptime())}`
                }
            }
        });
    }
}
