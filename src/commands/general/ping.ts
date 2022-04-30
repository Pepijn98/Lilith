import Embed from "../../utils/Embed";
import Lilith from "../../utils/Lilith";

import { CommandContext, Message, SlashCommand, SlashCreator } from "slash-create";

export default class PingCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "ping",
            description: "Pong",
            requiredPermissions: [
                "SEND_MESSAGES"
            ]
        });
    }

    async run(ctx: CommandContext): Promise<void> {
        await ctx.defer();

        const msg = await ctx.send({
            embeds: [
                {
                    color: Embed.Colors.default,
                    description: "🧮 Calculating..."
                }
            ]
        });

        if (msg instanceof Message) {
            let message = `🏓 Latency is ${Date.now() - msg.timestamp}ms`;
            if (ctx.guildID) {
                const shardID = this.client.guildShardMap[ctx.guildID];
                const shard = this.client.shards.get(shardID) || this.client.shards.get(0);
                if (shard) {
                    message += `\n📶 API Latency is ${Math.round(shard.latency)}ms`;
                }
            }

            msg.edit({
                embeds: [
                    {
                        color: Embed.Colors.default,
                        description: message
                    }
                ]
            });
        }
    }
}
