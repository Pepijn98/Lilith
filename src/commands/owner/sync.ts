import { SlashCommand, SlashCreator, CommandContext } from "slash-create";
import settings from "../../settings";

export default class SyncCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "sync",
            description: "Sync commands to discord",
            guildIDs: settings.devGuildID,
            defaultPermission: false
        });
    }

    hasPermission(ctx: CommandContext): string | boolean {
        return ctx.user.id === settings.owner;
    }

    async run(ctx: CommandContext): Promise<string> {
        await ctx.defer();

        try {
            await ctx.creator.syncCommandsAsync({
                deleteCommands: true,
                syncGuilds: true,
                syncPermissions: true
            });
            return "✅ Success syncing commands.";
        } catch (e) {
            return "❌ Failed syncing commands.";
        }
    }
}
