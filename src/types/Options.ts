import Collection from "@kurozero/collection";
import Lilith from "~/utils/Client";
import Logger from "~/utils/Logger";
import { Settings } from "./Settings";
import { User } from "eris";

export interface CommandHandlerOptions {
    settings: Settings;
    client: Lilith;
    logger: Logger;
}

export interface CommandOptions {
    name: string;
    description: string;
    usage: string;
    example: string;
    subCommands?: string[] | null;
    category?: string | null;
    aliases?: string[] | null;
    hidden?: boolean | null;
    guildOnly?: boolean | null;
    ownerOnly?: boolean | null;
    requiredArgs?: number | null;
    userPermissions?: string[] | null;
    botPermissions?: string[] | null;
}

export interface CommandStats {
    commandsExecuted: number;
    messagesSeen: number;
    commandUsage: {
        [x: string]: {
            size: number;
            users: Collection<User>;
        };
    };
}
