import "./utils/Extensions";

import EventLoader from "./utils/EventLoader";
import Lilith from "./utils/Lilith";
import axios from "axios";
import path from "path";
import settings from "./settings";

import { Constants, TextableChannel } from "eris";
import { GatewayServer, SlashCreator } from "slash-create";
import { isDiscordError, postGuildCount } from "./utils/Helpers";

axios.interceptors.request.use((x) => {
    // to avoid overwriting if another interceptor
    // already defined the same object (meta)
    x.meta = x.meta || {};
    x.meta.requestStartedAt = Date.now();
    return x;
});

axios.interceptors.response.use((x) => {
    x.responseTime = Date.now() - x.config.meta.requestStartedAt;
    return x;
});

let botReady = false;

const client = new Lilith(settings.token, {
    autoreconnect: true,
    compress: true,
    restMode: true,
    defaultImageFormat: "webp",
    defaultImageSize: 2048,
    intents: Constants.Intents.guilds | Constants.Intents.guildMessages | Constants.Intents.directMessages | Constants.Intents.guildEmojisAndStickers
    // intents: Constants.Intents.guilds | Constants.Intents.guildEmojisAndStickers
});

const creator = new SlashCreator({
    applicationID: settings.appID,
    publicKey: settings.publicKey,
    token: settings.token,
    client
});

const eventLoader = new EventLoader(client);

creator.on("debug", (message) => client.logger.debug("SLASH:DEBUG", message));
creator.on("warn", (message) => client.logger.warn("SLASH:WARN", message));
creator.on("error", (error) => client.logger.error("SLASH:ERROR", error));
creator.on("synced", () => client.logger.info("SLASH:SYNC", "Commands synced!"));
creator.on("commandRun", (command, _, ctx) => client.logger.info("SLASH:CMD", `${ctx.user.tag} (${ctx.user.id}) ran command ${command.commandName}`));
creator.on("commandRegister", (command) => client.logger.info("SLASH:CMD", `Command (${command.commandName.toUpperCase()}) registered!`));
creator.on("commandError", (_, error) => client.logger.error("SLASH:CMD", error));

creator
    .withServer(
        new GatewayServer((handler) =>
            client.on("rawWS", (event) => {
                if (event.t === "INTERACTION_CREATE") {
                    handler(event.d as any);
                }
            })
        )
    )
    .registerCommandsIn(path.join(__dirname, "commands"), [".ts"])
    .syncCommands();

client.on("ready", async () => {
    if (!botReady) {
        client.logger.ready(`Logged in as ${client.user.username}#${client.user.discriminator}`);
        client.editStatus("online", { name: "Diablo III | ;help", type: 0 });

        await postGuildCount(client);

        botReady = true;
    } else {
        client.logger.info("LILITH", "Client resumed");
    }
});

// Let people know what to do when slash commands aren't being created with a traditional command
client.on("messageCreate", async (msg) => {
    if (!botReady) return;
    if (!msg.author) return;
    if (msg.author.discriminator === "0000") return;
    if (msg.author.id === client.user.id) return;

    if (msg.content.trim() === ";help") {
        const channel = msg.channel as TextableChannel;
        client.logger.info("LILITH:CMD", `${msg.author.username}${msg.author.discriminator} (${msg.author.id}) ran command help`);
        await channel.createMessage?.({
            embed: {
                title: "Lilith v2 is here!",
                color: 0x413448,
                thumbnail: {
                    url: client.user.dynamicAvatarURL()
                },
                description:
                    "The most significant change is the migration to slash commands.\n" +
                    "Type `/` to see all available commands.\n" +
                    "If slash commands are not showing up, re-invite the bot.\n" +
                    "https://apps.vdbroek.dev/lilith/invite",
                footer: {
                    text: "This command will stop working around the end of 2022"
                }
            }
        });
    }
});

client.on("error", (e) => {
    // Not a relevant error
    // prettier-ignore
    if (
        e.message.includes("(reading 'emit')") ||
        e.message.includes("Connection reset by peer") ||
        (isDiscordError(e) && e.code === 1006)
    ) return;

    // NGL I completely forgot why I'm doing this but whatever
    if (isDiscordError(e) && e.code === 1001) client.disconnect({ reconnect: true });

    client.logger.error("LILITH", e);
});

client.on("disconnect", () => {
    client.logger.warn("LILITH", "Client disconnected");
});

// client.on("shardDisconnect", (id) => {
//     client.logger.warn("SHARD:DISCONNECT", `Shard [${id}] disconnected`);
// });

client.on("shardResume", (id) => {
    const shard = client.shards.get(id);
    if (shard) {
        shard.editStatus("online", { name: "Diablo III | ;help", type: 0 });
        // client.logger.info("SHARD:RESUME", `Shard [${id}] resumed`);
    }
});

process.on("unhandledRejection", (reason: string | Error) => {
    client.logger.error("UNHANDLED_REJECTION", reason);
});

process.on("uncaughtException", (error) => {
    client.logger.error("UNCAUGHT_EXCEPTION", error);
});

process.on("SIGINT", () => {
    client.disconnect({ reconnect: false });
    process.exit(0);
});

async function main(): Promise<void> {
    await client.setup();

    // Load all events besides ready
    await eventLoader.load(path.join(__dirname, "events"));

    client.connect().catch((e) => client.logger.error("CONNECT", e));
}

main().catch((e) => client.logger.error("MAIN", e));
