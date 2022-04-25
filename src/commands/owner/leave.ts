import { SlashCommand, SlashCreator, CommandContext } from "slash-create";
import settings from "~/settings";

export default class LeaveCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "leave",
            description: "Something about this command",
            guildIDs: settings.devGuildID
        });
    }

    hasPermission(ctx: CommandContext): string | boolean {
        return ctx.user.id === settings.owner;
    }

    async run(ctx: CommandContext): Promise<string> {
        await ctx.defer();
        return "Not implemented yet";
    }
}