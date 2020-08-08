import User from "~/types/mongo/User";
import Users from "~/models/User";
import { GuildChannel, Channel, PrivateChannel } from "eris";
import Guilds from "~/models/Guild";

export const baseUrl = "https://{REGION}.api.blizzard.com";

export const classes = ["dh", "demon-hunter", "necro", "necromancer", "monk", "barb", "barbarian", "wd", "witch-doctor", "wiz", "wizard", "cru", "crusader"];

export const filter: Record<string, string> = {
    "dh": "demon-hunter",
    "demon-hunter": "demon-hunter",
    "necro": "necromancer",
    "necromancer": "necromancer",
    "monk": "monk",
    "barb": "barbarian",
    "barbarian": "barbarian",
    "wd": "witch-doctor",
    "witch-doctor": "witch-doctor",
    "wiz": "wizard",
    "wizard": "wizard",
    "cru": "crusader",
    "crusader": "crusader"
};

export const classImageMap: Record<string, string> = {
    "barbarian-male": "https://files.catbox.moe/b2fa2v.png",
    "barbarian-female": "https://files.catbox.moe/7yjkuj.png",
    "demon-hunter-male": "https://files.catbox.moe/0jex4j.png",
    "demon-hunter-female": "https://files.catbox.moe/1hitu1.png",
    "monk-male": "https://files.catbox.moe/8sivc4.png",
    "monk-female": "https://files.catbox.moe/o6n6go.png",
    "witch-doctor-male": "https://files.catbox.moe/1co1e3.png",
    "witch-doctor-female": "https://files.catbox.moe/rkeauk.png",
    "wizard-male": "https://files.catbox.moe/nf5r1s.png",
    "wizard-female": "https://files.catbox.moe/q9l89i.png",
    "crusader-male": "https://files.catbox.moe/zxvn8y.png",
    "crusader-female": "https://files.catbox.moe/aqbp9z.png",
    "necromancer-male": "https://files.catbox.moe/5w4tvc.png",
    "necromancer-female": "https://files.catbox.moe/hkftps.png"
};

export const classColorMap: Record<string, number> = {
    "demon-hunter": 0xa30090,
    "necromancer": 0x00d286,
    "monk": 0xf3e474,
    "barbarian": 0x8d2a17,
    "witch-doctor": 0x07a630,
    "wizard": 0x0b3097,
    "crusader": 0xe0e0a6
};

/** Wait x amount of milliseconds */
export const sleep = (ms: number): Promise<unknown> => new Promise((r) => setTimeout(r, ms));

/** Check whether channel is guild channel */
// export const isGuildChannel = (channel: Channel): channel is GuildChannel => {
//     switch (channel.type) {
//         case 0:
//             return true; // TextChannel
//         case 2:
//             return true; // VoiceChannel
//         case 4:
//             return true; // CategoryChannel
//         case 5:
//             return true; // NewsChannel
//         case 6:
//             return true; // StoreChannel
//         default:
//             return false;
//     }
// };

/** Check whether channel is guild channel */
export function isGuildChannel(channel: Channel): channel is GuildChannel {
    if (channel instanceof GuildChannel) return true;
    return false;
}

/** Check whether channel is DM channel */
export function isDMChannel(channel: Channel): channel is PrivateChannel {
    if (channel instanceof PrivateChannel) return true;
    return false;
}

/** Convert seconds to human readable form */
export const formatSeconds = (time: number): string => {
    let days = Math.floor((time % 31536000) / 86400);
    let hours = Math.floor(((time % 31536000) % 86400) / 3600);
    let minutes = Math.floor((((time % 31536000) % 86400) % 3600) / 60);
    let seconds = Math.round((((time % 31536000) % 86400) % 3600) % 60);
    days = days > 9 ? days : days;
    hours = hours > 9 ? hours : hours;
    minutes = minutes > 9 ? minutes : minutes;
    seconds = seconds > 9 ? seconds : seconds;
    return `${days} Days, ${hours} Hours, ${minutes} Minutes and ${seconds} Seconds`;
};

export const round = (value: number, precision: number): number => {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};

export const getDBUser = async (id: string): Promise<User | null> => {
    return await Users.findOne({ uid: id }).exec();
};

export const loadPrefixes = async (): Promise<Map<string, string>> => {
    const guilds = await Guilds.find({}).exec();
    const prefixes = new Map<string, string>();
    for (const guild of guilds) {
        prefixes.set(guild.uid, guild.prefix);
    }
    return prefixes;
};
