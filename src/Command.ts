import Lilith from "./utils/Client";
import { CommandOptions } from "./types/Options";
import { isGuildChannel } from "./utils/Utils";
import { CommandContext } from "./types/CommandContext";
import { Message, Guild, AnyGuildChannel, Member } from "eris";

export default abstract class Command {
    _key: string; // Collection id

    name: string;
    description: string;
    usage: string;
    example: string;
    subCommands: string[];
    category: string;
    aliases: string[];
    hidden: boolean;
    guildOnly: boolean;
    ownerOnly: boolean;
    requiredArgs: number;
    userPermissions: string[];
    botPermissions: string[];

    constructor(options: CommandOptions) {
        this._key = options.name;

        this.name = options.name;
        this.description = options.description;
        this.usage = options.usage;
        this.example = options.example;
        this.subCommands = options.subCommands || [];
        this.category = options.category || "general";
        this.aliases = options.aliases || [];
        this.hidden = options.hidden || false;
        this.guildOnly = options.guildOnly || false;
        this.ownerOnly = options.ownerOnly || false;
        this.requiredArgs = options.requiredArgs || 0;
        this.userPermissions = options.userPermissions || ["sendMessages"];
        this.botPermissions = options.botPermissions || ["readMessages", "sendMessages"];
    }

    /** Function with all the stuff the command needs to do */
    abstract async run(msg: Message, args: string[], client: Lilith, context: CommandContext): Promise<unknown>;

    /** Tries to find the user in the currently guild */
    findMember(msg: Message, str: string): false | Member {
        if (!str || str === "") return false;

        let guild: Guild | null = null;
        if (isGuildChannel(msg.channel)) guild = (msg.channel as AnyGuildChannel).guild;

        if (!guild) return false;

        if (/^\d{17,18}/u.test(str) || /^<@!?\d{17,18}>/u.test(str)) {
            const member = guild.members.get(/^<@!?\d{17,18}>/u.test(str) ? str.replace(/<@!?/u, "").replace(">", "") : str);
            return member ? member : false;
        } else if (str.length <= 33) {
            const isMemberName = (name: string, something: string): boolean => name === something || name.startsWith(something) || name.includes(something);
            const member = guild.members.find((m) =>
                m.nick && isMemberName(m.nick.toLowerCase(), str.toLowerCase()) ? true : isMemberName(m.user.username.toLowerCase(), str.toLowerCase())
            );
            return member ? member : false;
        }

        return false;
    }

    /** Generate violation ID, [ban, kick, warn, note] */
    generateId(): string {
        return `_${Math.random().toString(36).substr(2, 9)}`;
    }
}
