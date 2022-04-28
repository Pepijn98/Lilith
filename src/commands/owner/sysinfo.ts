import os from "os-utils";
import settings from "../../settings";
import { round, formatSeconds } from "../../utils/Helpers";
import { SlashCommand, SlashCreator, CommandContext } from "slash-create";

export default class SysinfoCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "sysinfo",
            description: "Info about the system the bot runs on",
            guildIDs: settings.devGuildID,
            defaultPermission: false
        });
    }

    hasPermission(ctx: CommandContext): string | boolean {
        return ctx.user.id === settings.owner;
    }

    async run(ctx: CommandContext): Promise<void> {
        let cpuUsage = 0;
        os.cpuUsage((value: number) => (cpuUsage = value));

        let cpuFree = 0;
        os.cpuFree((value: number) => (cpuFree = value));

        const platform = os.platform();
        const cpuCount = os.cpuCount();
        const freemem = os.freemem();
        const totalmem = os.totalmem();
        const freememPercentage = os.freememPercentage();
        const sysUptime = os.sysUptime();
        const processUptime = os.processUptime();
        const loadavg = os.loadavg(1);

        setTimeout(() => {
            ctx.send(
                "```prolog\n" +
                    `CPU Usage              -> ${round(cpuUsage * 100, 2)} %\n` +
                    `CPU Free               -> ${round(cpuFree * 100, 2)} %\n` +
                    `Platform               -> ${platform}\n` +
                    `CPU Count              -> ${cpuCount}\n` +
                    `Free Memory            -> ${round(freemem / 1000, 2)} GB\n` +
                    `Total Memory           -> ${round(totalmem / 1000, 2)} GB\n` +
                    `Free Memory Percentage -> ${round(freememPercentage * 100, 2)} %\n` +
                    `System Uptime          -> ${formatSeconds(sysUptime)}\n` +
                    `Process Uptime         -> ${formatSeconds(processUptime)}\n` +
                    `Avg Load               -> ${loadavg}\n` +
                    "```"
            );
        }, 2000);
    }
}
