import axios from "axios";
import settings from "~/settings";
import Yukikaze from "yukikaze";
import Lilith from "./Lilith";
import User from "~/types/db/User";
import Users from "~/models/User";
import { GuildChannel, Channel, PrivateChannel, Guild } from "eris";
import { Population } from "~/types/General";
import { AutocompleteChoice } from "slash-create";

export const baseUrl = "https://{REGION}.api.blizzard.com";

export const classes = ["dh", "demon-hunter", "necro", "necromancer", "monk", "barb", "barbarian", "wd", "witch-doctor", "wiz", "wizard", "cru", "sader", "crusader"];

// export const regions = ["us", "eu", "kr", "tw", "cn"];

export const rbattleTag = /^\w+#\d+$/iu;

export const acronymClassMap: Record<string, string> = {
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
    "sader": "crusader",
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

export const regions: AutocompleteChoice[] = [
    {
        name: "United States",
        value: "us"
    },
    {
        name: "Europe",
        value: "eu"
    },
    {
        name: "Korea",
        value: "kr"
    },
    {
        name: "Taiwan",
        value: "tw"
    },
    {
        name: "China",
        value: "cn"
    }
];

export const localeMap: Record<string, AutocompleteChoice[]> = {
    us: [
        {
            name: "	English (United States)",
            value: "en_US"
        },
        {
            name: "Spanish (Mexico)",
            value: "es_MX"
        },
        {
            name: "Portuguese (Brazil)",
            value: "pt_BR"
        }
    ],
    eu: [
        {
            name: "English (United Kingdom)",
            value: "en_GB"
        },
        {
            name: "Spanish",
            value: "es_ES"
        },
        {
            name: "French",
            value: "fr_FR"
        },
        {
            name: "Russian",
            value: "ru_RU"
        },
        {
            name: "German",
            value: "de_DE"
        },
        {
            name: "Portuguese",
            value: "pt_PT"
        },
        {
            name: "Italian",
            value: "it_IT"
        }
    ],
    kr: [
        {
            name: "Korean (South Korea)",
            value: "ko_KR"
        }
    ],
    tw: [
        {
            name: "Chinese (Taiwan)",
            value: "zh_TW"
        }
    ],
    cn: [
        {
            name: "Chinese",
            value: "zh_CN"
        }
    ]
};

export const defaultLocaleMap: Record<string, string> = {
    us: "en_US",
    eu: "en_GB",
    kr: "ko_KR",
    tw: "zh_TW",
    cn: "zh_CN"
};

/** Wait x amount of milliseconds */
export function sleep(ms: number): Promise<unknown> {
    return new Promise((r) => setTimeout(r, ms, null));
}

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
export function formatSeconds(time: number): string {
    const days = Math.floor((time % 31536000) / 86400);
    const hours = Math.floor(((time % 31536000) % 86400) / 3600);
    const minutes = Math.floor((((time % 31536000) % 86400) % 3600) / 60);
    const seconds = Math.round((((time % 31536000) % 86400) % 3600) % 60);
    // days = days > 9 ? days : days;
    // hours = hours > 9 ? hours : hours;
    // minutes = minutes > 9 ? minutes : minutes;
    // seconds = seconds > 9 ? seconds : seconds;
    return `${days} Days, ${hours} Hours, ${minutes} Minutes and ${seconds} Seconds`;
}

export function round(value: number, precision = 0): number {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
}

export async function getDBUser(id: string): Promise<User | null> {
    return await Users.findOne({ uid: id }).exec();
}

async function topgg(client: Lilith): Promise<void> {
    try {
        await axios.post(
            `https://top.gg/api/bots/${client.user.id}/stats`,
            {
                server_count: client.guilds.size
            },
            {
                headers: {
                    "Authorization": settings.botLists.topgg,
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (e) {
        client.logger.error("TOPGG", "Failed sending guild count to top.gg");
    }
}

// Not yet approved
// async function botsondiscord(client: Lilith): Promise<void> {
//     try {
//         await axios.post(`https://bots.ondiscord.xyz/bot-api/bots/${client.user.id}/guilds`, {
//             guildCount: client.guilds.size
//         }, {
//             headers: {
//                 Authorization: settings.botLists.bod,
//                 "Content-Type": "application/json"
//             }
//         });
//     } catch (e) {
//         client.logger.error("BOD", "Failed sending guild count to bots.ondiscord.xyz");
//     }
// }

export async function postGuildCount(client: Lilith): Promise<void> {
    const interval = new Yukikaze();
    interval.run(
        async () => {
            await topgg(client);
            // await botsondiscord(client);
        },
        30 * 60 * 1000,
        false
    );
}

export function checkPopulation(guild: Guild): Population {
    const total = guild.memberCount;
    const bots = guild.members.filter((member) => member.user.bot).length - 1; // Lets be fair and not count this bot
    const humans = total - bots;

    return {
        humans: (humans / total) * 100,
        bots: (bots / total) * 100,
        totalCount: total,
        humanCount: humans,
        botCount: bots
    };
}
