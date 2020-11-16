import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Lilith from "~/utils/Client";
import { Message } from "eris";
import { Embed } from "~/utils/Embed";

export default class extends Command {
    client: Lilith;

    constructor(ctx: CommandContext) {
        super({
            name: "token",
            description: "Fetch new access token for blizzard api",
            usage: "token <subcommand: string>",
            example: "token update",
            subCommands: ["update"],
            category: ctx.category,
            ownerOnly: true,
            requiredArgs: 1
        });

        this.client = ctx.client;
    }

    async run(msg: Message, args: string[]): Promise<void> {
        const subcommand = args.shift();
        switch (subcommand) {
            case "update":
                try {
                    await this.client.diablo.updateToken();
                    await Embed.Success(msg, "Successfully updated token!");
                } catch (e) {
                    await Embed.Danger(msg, "Failed to update token");
                }
                break;
            default:
                await Embed.Danger(msg, "Invalid subcommand");
                break;
        }
    }
}
