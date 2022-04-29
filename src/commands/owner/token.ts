import Embed from "../../utils/Embed";
import Lilith from "../../utils/Lilith";
import settings from "../../settings";

import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from "slash-create";

export default class TokenCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "token",
            description: "Something about this command",
            guildIDs: settings.devGuildID,
            defaultPermission: false,
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: "update",
                    description: "Update current blizzard token"
                }
            ]
        });
    }

    hasPermission(ctx: CommandContext): string | boolean {
        return ctx.user.id === settings.owner;
    }

    async run(ctx: CommandContext): Promise<void> {
        switch (ctx.subcommands[0]) {
            case "update":
                try {
                    await this.client.diablo.updateToken();
                    await Embed.Success(ctx, "✅ Successfully updated token!");
                } catch (e) {
                    this.client.logger.error("TOKEN", e);
                    await Embed.Danger(ctx, "❌ Failed to update token");
                }
                break;
            default:
                await Embed.Danger(ctx, "❌ Invalid subcommand");
                break;
        }
    }
}
