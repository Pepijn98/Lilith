import chalk from "chalk";
import moment from "moment";
import settings from "~/settings";
import Lilith from "./Client";
import { Logger as WinstonLogger, createLogger, format, transports } from "winston";

/** Custom logger, you know, this logs stuff to the terminal with pretty colors and timestamps :O */
export default class Logger {
    #client: Lilith;
    #log: WinstonLogger;

    constructor(client: Lilith) {
        this.#client = client;
        this.#log = createLogger({
            level: "info",
            format: format.combine(
                format.timestamp(),
                format.printf(
                    (log) => `${moment(log.timestamp).format("DD/MM/YYYY, hh:mm:ss")} ${chalk.black.bgGreen(`[${log.label}]`)} ${this._getColored(log.level)}: ${log.message}`
                )
            ),
            transports: [
                new transports.Console({
                    level: "info" //,
                    // handleExceptions: true
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

    warn(label: string, message: string): void {
        this.#log.warn(message, { label });
    }

    error(label: string, error: Error | string, webhook = false): void {
        let message = typeof error === "string" ? error : error.stack ? error.stack : error.toString();
        this.#log.error(message, { label });

        if (message.length > 1980) {
            message = message.substring(0, 1980) + "...";
        }

        if (webhook) {
            this.#client.executeWebhook(settings.webhook.id, settings.webhook.token, {
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
