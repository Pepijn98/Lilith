import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Lilith from "~/utils/Client";
import { Message } from "eris";
import { checkPopulation, round } from "~/utils/Utils";

export default class extends Command {
    client: Lilith;

    constructor(ctx: CommandContext) {
        super({
            name: "population",
            description: "Check a guilds population",
            usage: "population <id: number>",
            example: "population 12345678901234",
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
            const population = checkPopulation(guild);
            await msg.channel.createMessage({
                embed: {
                    title: `Population for **${guild.name}**`,
                    fields: [
                        {
                            name: "Total",
                            value: `Percentage: 100%\nCount: ${population.totalCount}`
                        },
                        {
                            name: "Bots",
                            value: `Percentage: ${round(population.bots)}%\nCount: ${population.botCount}`
                        },
                        {
                            name: "Humans",
                            value: `Percentage: ${round(population.humans)}%\nCount: ${population.humanCount}`
                        }
                    ]
                }
            });
        } else {
            await msg.channel.createMessage(`Could not find guild with id **${guildId}**`);
        }
    }
}
