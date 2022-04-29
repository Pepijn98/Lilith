import Embed from "../../utils/Embed";
import Lilith from "../../utils/Lilith";
import settings from "../../settings";

import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from "slash-create";
import { checkPopulation, round } from "../../utils/Helpers";

export default class PopulationCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "population",
            description: "[Bot Owner Only] Check a guilds population, bot:user ratio",
            guildIDs: settings.devGuildID,
            defaultPermission: false,
            requiredPermissions: [
                "SEND_MESSAGES"
            ],
            options: [
                {
                    type: CommandOptionType.NUMBER,
                    name: "id",
                    description: "The guild id to check the population of",
                    min_value: 18,
                    required: true
                }
            ]
        });
    }

    hasPermission(ctx: CommandContext): string | boolean {
        return ctx.user.id === settings.owner;
    }

    async run(ctx: CommandContext): Promise<unknown> {
        await ctx.defer();

        const guild = this.client.guilds.get(ctx.options.id);
        if (!guild) {
            return Embed.Danger(ctx, "❌ Failed to fetch guild.");
        }

        const population = checkPopulation(guild);
        await ctx.send({
            embeds: [
                {
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
            ]
        });
    }
}
