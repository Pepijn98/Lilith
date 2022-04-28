import Lilith from "../../utils/Lilith";
import settings from "../../settings";
import { Embed } from "../../utils/Embed";
import { SlashCommand, SlashCreator, CommandContext, CommandOptionType } from "slash-create";

export default class TokenCommand extends SlashCommand {
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
                const client = this.creator.client as Lilith;
                try {
                    await client.diablo.updateToken();
                    await Embed.Success(ctx, "✅ Successfully updated token!");
                } catch (e) {
                    client.logger.error("TOKEN", e);
                    await Embed.Danger(ctx, "❌ Failed to update token");
                }
                break;
            default:
                await Embed.Danger(ctx, "❌ Invalid subcommand");
                break;
        }
    }
}
