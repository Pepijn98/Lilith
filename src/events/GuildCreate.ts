import Event from "~/types/Event";
import Lilith from "~/structures/Client";
import Guilds from "~/models/Guild";
import settings from "~/settings";
import { Guild } from "eris";

export default class implements Event {
    name = "guildCreate";
    async run(client: Lilith, guild: Guild): Promise<void> {
        client.logger.info("GUILD_JOIN", `Joined guild ${guild.name} (${guild.id})`);
        await Guilds.create({ uid: guild.id, prefix: settings.prefix });
    }
}
