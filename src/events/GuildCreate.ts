import Event from "~/types/Event";
import Lilith from "~/utils/Client";
import Guilds from "~/models/Guild";
import settings from "~/settings";
import { checkPopulation } from "~/utils/Utils";
import { Guild } from "eris";

// TODO : Add whitelist to database
const whitelist = [
    "446425626988249089", // bots.ondiscord.xyz
    "264445053596991498" // top.gg
];

export default class implements Event {
    name = "guildCreate";
    async run(client: Lilith, guild: Guild): Promise<void> {
        // Check guild population and leave guilds with more than 10 members, 60% bots and the guild is not on the whitelist
        const population = checkPopulation(guild);
        if (guild.memberCount > 10 && population.bots > 60 && !whitelist.includes(guild.id)) {
            await guild.leave();
            return;
        }

        client.logger.info("GUILD_JOIN", `Joined guild ${guild.name} (${guild.id})`);
        guild.prefix = settings.prefix;
        await Guilds.create({ uid: guild.id, prefix: settings.prefix });
    }
}
