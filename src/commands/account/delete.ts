import { SlashCommand, SlashCreator, CommandContext } from "slash-create";
import { getDBUser } from "../../utils/Helpers";

export default class DeleteCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "delete",
            description: "Remove your account info"
        });
    }

    async run(ctx: CommandContext): Promise<string> {
        await ctx.defer();

        const user = await getDBUser(ctx.user.id);
        if (!user) {
            return "⚠️ You do not have an account set up.";
        }

        await user.delete();
        return "✅ Account info has been removed.";
    }
}
