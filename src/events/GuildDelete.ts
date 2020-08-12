import Event from "~/types/Event";
import Lilith from "~/utils/Client";
import Guilds from "~/models/Guild";
import { Guild } from "eris";

export default class implements Event {
    name = "guildDelete";
    async run(client: Lilith, guild: Guild): Promise<void> {
        client.logger.info("GUILD_LEAVE", `Left guild ${guild.name} (${guild.id})`);
        guild.prefix = "";
        await Guilds.findOneAndDelete({ uid: guild.id }).exec();
    }
}
