import User from "~/types/User";
import Users from "~/models/User";
import { GuildChannel, Channel, PrivateChannel } from "eris";

export const baseUrl = "https://{REGION}.api.blizzard.com";

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
};

/** Check whether channel is DM channel */
export function isDMChannel(channel: Channel): channel is PrivateChannel {
    if (channel instanceof PrivateChannel) return true;
    return false;
};

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
