import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import { exec } from "child_process";
import { Message } from "eris";

export default class extends Command {
    constructor(ctx: CommandContext) {
        super({
            name: "exec",
            description: "Execute shell shit",
            usage: "exec <command: string>",
            example: "exec pm2 list",
            category: ctx.category,
            ownerOnly: true,
            requiredArgs: 1
        });
    }

    async run(msg: Message, args: string[]): Promise<void> {
        exec(args.join(" "), { maxBuffer: Infinity }, async (err, stdout, stderr) => {
            try {
                if (err) return msg.channel.createMessage(`\`\`\`fix\n${err}\n\`\`\``);
                if (stderr) return msg.channel.createMessage(`\n\`\`\`fix\n${stderr}\n\`\`\``);
                await msg.channel.createMessage(`\`\`\`fix\n${stdout}\n\`\`\``);
            } catch (e) {
                msg.channel.createMessage(`\`\`\`${e.toString()}\`\`\``).catch(() => {});
            }
        });
    }
}
