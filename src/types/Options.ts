import Lilith from "../structures/Client";
import Logger from "../utils/Logger";
import { ISettings } from "./ISettings";
import { User } from "eris";
import Collection from "@kurozero/collection";

export interface ICommandHandlerOptions {
    settings: ISettings;
    client: Lilith;
    logger: Logger;
}

export interface ICommandOptions {
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

export interface ICommandStats {
    commandsExecuted: number;
    messagesSeen: number;
    commandUsage: {
        [x: string]: {
            size: number;
            users: Collection<User>;
        };
    };
}
