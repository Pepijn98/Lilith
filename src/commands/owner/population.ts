import { SlashCommand, SlashCreator, CommandContext } from "slash-create";
import settings from "../../settings";

export default class PopulationCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "population",
            description: "Something about this command",
            guildIDs: settings.devGuildID,
            defaultPermission: false
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
