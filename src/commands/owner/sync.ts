import { Embed } from "../../utils/Embed";
import Lilith from "../../utils/Lilith";
import settings from "../../settings";

import { CommandContext, SlashCommand, SlashCreator } from "slash-create";

export default class SyncCommand extends SlashCommand<Lilith> {
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

    async run(ctx: CommandContext): Promise<void> {
        await ctx.defer();

        try {
            await ctx.creator.syncCommandsAsync({
                deleteCommands: true,
                syncGuilds: true,
                syncPermissions: true
            });
            await Embed.Success(ctx, "✅ Success syncing commands.");
        } catch (e) {
            await Embed.Danger(ctx, "❌ Failed syncing commands.");
        }
    }
}
