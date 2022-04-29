import Event from "../types/Event";
import { Guild } from "eris";
import Guilds from "../models/Guild";
import Lilith from "../utils/Lilith";

export default class implements Event {
    name = "guildDelete";
    async run(client: Lilith, guild: Guild): Promise<void> {
        client.logger.info("GUILD_LEAVE", `Left guild ${guild.name} (${guild.id})`);
        await Guilds.findOneAndDelete({ uid: guild.id }).exec();
    }
}
