import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Lilith from "~/utils/Client";
import settings from "~/settings";
import { Message } from "eris";
import { isGuildChannel } from "~/utils/Utils";

export default class extends Command {
    client: Lilith;

    constructor(ctx: CommandContext) {
        super({
            name: "help",
            description: "send info about the commands",
            usage: "help [command: string]",
            example: "help ping",
            category: ctx.category
        });

        this.client = ctx.client;
    }

    async run(msg: Message, args: string[]): Promise<Message | undefined> {
        let prefix = settings.prefix;
        if (isGuildChannel(msg.channel)) {
            prefix = msg.channel.guild.prefix;
        }

        if (args.length === 0) {
            const messageQueue: string[] = [];
            let currentMessage =
                `\n// Here's a list of my commands. For more info do: ${prefix}help <command>\n` +
                `// ${isGuildChannel(msg.channel) ? `Prefix for ${msg.channel.guild.name}` : "Prefix"}: ${prefix}\n`;

            this.client.commands.forEach((command) => {
                if (command.hidden === true) return; // Command is hidden
                if (command.ownerOnly && msg.author.id !== settings.owner) return; // Command can only be viewed by the owner

                const toAdd = `[${prefix}${command.name}]\n   "${command.description}"\n`;
                if (currentMessage.length + toAdd.length >= 1900) {
                    // If too long push to queue and reset it.
                    messageQueue.push(currentMessage);
                    currentMessage = "";
                }
                currentMessage += `\n${toAdd}`;
            });
            messageQueue.push(currentMessage);
            const dm = await this.client.getDMChannel(msg.author.id);
            const sendInOrder = setInterval(async () => {
                if (messageQueue.length > 0) {
                    dm.createMessage(`\`\`\`cs${messageQueue.shift()}\`\`\``)
                        .then(() => {
                            msg.channel.addMessageReaction(msg.id, "✅");
                        })
                        .catch(() => {
                            msg.channel.addMessageReaction(msg.id, "❌");
                            msg.channel.createMessage("I can't DM you the list of commands, please enable DMs so I can send you the list of commands.");
                            clearInterval(sendInOrder);
                        });
                } else {
                    clearInterval(sendInOrder);
                }
            }, 300);
        } else {
            const command = this.checkForMatch(args[0], prefix);
            if (!command) return await msg.channel.createMessage(`Command \`${prefix}${args[0]}\` not found`);

            if (command.hidden === true) return; // Command is hidden
            if (command.ownerOnly && msg.author.id !== settings.owner) {
                return await msg.channel.createMessage("This command can only be viewed and used by the owner.");
            }

            const helpMessage =
                "```asciidoc\n" +
                `[${command.name.capitalize()}]\n\n` +
                `= ${command.description} =\n\n` +
                `Category           ::  ${command.category}\n` +
                `Aliases            ::  ${command.aliases.join(", ")}\n` +
                `Usage              ::  ${prefix}${command.usage}\n` +
                `Example            ::  ${prefix}${command.example}\n` +
                `Sub Commands       ::  ${command.subCommands.join(", ")}\n` +
                `Hidden             ::  ${command.hidden ? "yes" : "no"}\n` +
                `Guild Only         ::  ${command.guildOnly ? "yes" : "no"}\n` +
                `Owner Only         ::  ${command.ownerOnly ? "yes" : "no"}\n` +
                `Required Args      ::  ${command.requiredArgs}\n` +
                `User Permissions   ::  ${command.userPermissions.join(", ")}\n` +
                `Bot Permissions    ::  ${command.botPermissions.join(", ")}\n\n` +
                "<> = required\n" +
                "[] = optional\n" +
                "```";
            await msg.channel.createMessage(helpMessage);
        }
    }

    checkForMatch(name: string, prefix: string): Command | undefined {
        if (name.startsWith(prefix)) {
            name = name.substr(prefix.length);
        }

        return this.client.commands.find((cmd) => cmd.name === name || cmd.aliases.indexOf(name) !== -1)?.value;
    }
}
