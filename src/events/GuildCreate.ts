import Configs from "../models/Config";
import Event from "../types/Event";
import { Guild } from "eris";
import Guilds from "../models/Guild";
import Lilith from "../utils/Lilith";
import { checkPopulation } from "../utils/Helpers";

export default class implements Event {
    name = "guildCreate";
    async run(client: Lilith, guild: Guild): Promise<void> {
        // Leave guilds that have more than 10 members, 60% bots and aren't on the whitelist
        // or guilds that are blacklisted
        const blacklist = await Configs.findOne({ name: "blacklist" }).exec();
        const whitelist = await Configs.findOne({ name: "whitelist" }).exec();
        const population = checkPopulation(guild);
        if ((guild.memberCount > 10 && population.bots > 60 && !whitelist.guilds.includes(guild.id)) || blacklist.guilds.includes(guild.id)) {
            await guild.leave();
            return;
        }

        client.logger.info("GUILD_JOIN", `Joined guild ${guild.name} (${guild.id})`);
        await Guilds.create({ uid: guild.id });
    }
}
