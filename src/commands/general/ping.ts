import Embed from "../../utils/Embed";
import Lilith from "../../utils/Lilith";

import { CommandContext, Message, SlashCommand, SlashCreator } from "slash-create";

export default class PingCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "ping",
            description: "Pong",
            requiredPermissions: ["SEND_MESSAGES"]
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
            msg.edit({
                embeds: [
                    {
                        color: Embed.Colors.default,
                        // prettier-ignore
                        description: `🏓 Latency is ${Date.now() - msg.timestamp}ms\n` +
                            `📶 API Latency is ${this.creator.requestHandler.latencyRef.latency}ms`
                    }
                ]
            });
        }
    }
}
