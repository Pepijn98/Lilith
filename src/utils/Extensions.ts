import settings from "~/settings";
import { Guild } from "eris";
import Guilds from "~/models/Guild";

/** Capitalize the first letter of a string */
String.prototype.capitalize = function (): string {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/** Paginate over an array */
Array.prototype.paginate = function <T>(pageSize: number, pageNumber: number): T[] {
    --pageNumber;
    return this.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
};

Array.prototype.remove = function <T>(item: T): T[] {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === item) this.splice(i, 1);
    }
    return this;
};

Guild.prototype.getPrefix = async function (): Promise<string> {
    const guild = await Guilds.findOne({ uid: this.id }).exec();
    if (!guild) {
        return settings.prefix;
    }
    return guild.prefix;
};

Guilds.prototype.setPrefix = async function (prefix: string): Promise<void> {
    const guild = await Guilds.findOne({ uid: this.id }).exec();
    if (!guild) {
        await Guilds.create({ uid: this.id, prefix });
        return;
    }
    guild.updateOne({ prefix });
};

// TODO : Remove this and move to getPrefix/setPrefix
Object.defineProperty(Guild.prototype, "prefix", {
    get: function () {
        return this._client.guildPrefixMap.get(this.id) || settings.prefix;
    },
    set: function (prefix: string) {
        if (!prefix) {
            this._client.guildPrefixMap.delete(this.id);
            return;
        }
        this._client.guildPrefixMap.set(this.id, prefix);
    }
});
