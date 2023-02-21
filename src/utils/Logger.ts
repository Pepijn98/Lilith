import Lilith from "./Lilith";
import axios from "axios";
import chalk from "chalk";
import moment from "moment";
import settings from "../settings";

import { Logger as WinstonLogger, createLogger, format, transports } from "winston";

/** Custom logger, you know, this logs stuff to the terminal with pretty colors and timestamps :O */
export default class Logger {
    #client: Lilith;
    #log: WinstonLogger;

    logLevel: string = settings.debug ? "debug" : "info";

    constructor(client: Lilith) {
        this.#client = client;
        this.#log = createLogger({
            level: this.logLevel,
            format: format.combine(
                format.timestamp(),
                format.printf(
                    (log) => `${moment(log.timestamp).format("DD/MM/YYYY, hh:mm:ss")} ${chalk.black.bgGreen(`[${log.label}]`)} ${this._getColored(log.level)}: ${log.message}`
                )
            ),
            transports: [
                new transports.Console({
                    level: this.logLevel
                })
            ]
        });
    }

    ready(message: string): void {
        this.#log.info(message, { label: "READY" });
    }

    info(label: string, message: string): void {
        this.#log.info(message, { label });
    }

    debug(label: string, message: string): void {
        this.#log.debug(message, { label });
    }

    warn(label: string, error: Error | string): void {
        const message = typeof error === "string" ? error : error.stack ? error.stack : error.toString();
        this.#log.warn(message, { label });
    }

    async error(label: string, error: Error | string, webhook = false): Promise<void> {
        let message = typeof error === "string" ? error : error.stack ? error.stack : error.toString();
        this.#log.error(message, { label });

        if (webhook) {
            // If message is too long for discord try to post it to pastebin instead.
            // If the post request fails to pastebin, just cut the message and continue as planned.
            if (message.length > 1980) {
                const params = new URLSearchParams({
                    api_dev_key: settings.webhook.pastebinKey,
                    api_option: "paste",
                    api_paste_name: label,
                    api_paste_code: message,
                    api_paste_private: "1"
                });

                try {
                    const resp = await axios.post("https://pastebin.com/api/api_post.php", params, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    });

                    message = resp.data;
                } catch (_) {
                    message = message.substring(0, 1980) + "...";
                }
            }

            await this.#client.executeWebhook(settings.webhook.id, settings.webhook.token, {
                username: this.#client.ready ? this.#client.user.username : "Lilith",
                avatarURL: this.#client.ready ? this.#client.user.dynamicAvatarURL() : "https://discord.com/assets/0e291f67c9274a1abdddeb3fd919cbaa.png",
                content: `\`\`\`diff\n- ${message}\n\`\`\``
            });
        }
    }

    private _getColored(logLevel: string): string {
        switch (logLevel) {
            case "error":
                return chalk.red.bold(logLevel);
            case "warn":
                return chalk.yellow.bold(logLevel);
            case "info":
                return chalk.blue.bold(logLevel);
            default:
                return chalk.white(logLevel);
        }
    }
}
