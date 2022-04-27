import Event from "../types/Event";
import Lilith from "../utils/Lilith";
import Config from "../models/Config";
import Guilds from "../models/Guild";
import { checkPopulation } from "../utils/Helpers";
import { Guild } from "eris";

export default class implements Event {
    name = "guildCreate";
    async run(client: Lilith, guild: Guild): Promise<void> {
        // Leave guilds that have more than 10 members, 60% bots and aren't on the whitelist
        const whitelist = await Config.findOne({ name: "whitelist" }).exec();
        const population = checkPopulation(guild);
        if (guild.memberCount > 10 && population.bots > 60 && !whitelist.guilds.includes(guild.id)) {
            await guild.leave();
            return;
        }

        client.logger.info("GUILD_JOIN", `Joined guild ${guild.name} (${guild.id})`);
        await Guilds.create({ uid: guild.id });
    }
}
