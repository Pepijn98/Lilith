// eslint-disable-next-line @typescript-eslint/no-var-requires
require("eris-additions")(require("eris"));

import "./utils/Extensions";
import path from "path";
import settings from "./settings";
import Lilith from "./utils/Client";
import CommandHandler from "./utils/CommandHandler";
import CommandLoader from "./utils/CommandLoader";
import EventLoader from "./utils/EventLoader";
import Logger from "./utils/Logger";
import { isGuildChannel, loadPrefixes, isDMChannel, postGuildCount, clientIntents } from "./utils/Utils";

let ready = false;

const logger = new Logger();

const client = new Lilith(logger, settings.token, {
    autoreconnect: true,
    compress: true,
    restMode: true,
    getAllUsers: true,
    defaultImageFormat: "webp",
    defaultImageSize: 2048,
    intents: clientIntents
});

const eventLoader = new EventLoader(client);
const commandLoader = new CommandLoader(client);
const commandHandler = new CommandHandler(client);

client.on("ready", async () => {
    if (!ready) {
        // Load commands
        client.guildPrefixMap = await loadPrefixes();
        client.commands = await commandLoader.load(path.join(__dirname, "commands"));

        // Log some info
        logger.ready(`Logged in as ${client.user.tag}`);
        logger.ready(`Loaded [${client.commands.size}] commands`);

        client.editStatus("online", { name: "Diablo III", type: 0 });

        await postGuildCount(client);

        // We're ready \o/
        ready = true;
    }
});

// Handle commands
client.on("messageCreate", async (msg) => {
    if (!ready) return; // Bot not ready yet
    if (!msg.author) return; // Probably system message
    if (msg.author.discriminator === "0000") return; // Probably a webhook
    if (msg.author.id === client.user.id) return; // Ignore our own messages

    client.stats.messagesSeen++;

    // Check if message was send in a guild channel
    let prefix = settings.prefix;
    if (isGuildChannel(msg.channel)) {
        prefix = msg.channel.guild.prefix;
        // If message starts with configured prefix handleCommand
        if (msg.content.startsWith(prefix)) {
            await commandHandler.handleCommand(msg, prefix, false);
        }
    } else if (isDMChannel(msg.channel) && msg.content.startsWith(settings.prefix)) {
        await commandHandler.handleCommand(msg, prefix, true);
    }
});

client.on("error", (e: any) => {
    if (e.code === 1001) {
        client.disconnect({ reconnect: true });
        // client.disconnect({ reconnect: false });
        // client.connect().catch((e) => logger.error("CONNECT", e));
    } else {
        logger.error("ERROR", e);
    }
});

// Handle disconnects
client.on("disconnect", () => {
    logger.warn("DISCONNECT", "Client disconnected");
});

/**
 * Sometimes when a shard goes down for a moment and comes back up is loses it's status
 * so we re-add it here
 */
client.on("shardResume", (id: number) => {
    const shard = client.shards.get(id);
    if (shard) {
        shard.editStatus("online", { name: "Diablo III", type: 0 });
    }
});

process.on("unhandledRejection", (reason) => {
    logger.error("UNHANDLED_REJECTION", reason as any);
});

process.on("uncaughtException", (e) => {
    logger.error("UNCAUGHT_EXCEPTION", e);
});

process.on("SIGINT", () => {
    client.disconnect({ reconnect: false });
    process.exit(0);
});

async function main(): Promise<void> {
    await client.setup();

    // Load all events besides ready and messageCreate
    await eventLoader.load(path.join(__dirname, "events"));

    // Connect to discord OwO
    client.connect().catch((e) => logger.error("CONNECT", e));
}

main().catch((e) => logger.error("MAIN", e));
