import Event from "~/types/Event";
import Lilith from "~/utils/Lilith";
import Guilds from "~/models/Guild";
import { Guild } from "eris";

export default class implements Event {
    name = "guildDelete";
    async run(client: Lilith, guild: Guild): Promise<void> {
        client.logger.info("GUILD_LEAVE", `Left guild ${guild.name} (${guild.id})`);
        await Guilds.findOneAndDelete({ uid: guild.id }).exec();
    }
}
