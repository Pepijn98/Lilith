import Embed from "../../utils/Embed";
import Lilith from "../../utils/Lilith";
import { getDBUser } from "../../utils/Helpers";

import { CommandContext, SlashCommand, SlashCreator } from "slash-create";

export default class DeleteCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "delete",
            description: "Remove your account info"
        });
    }

    async run(ctx: CommandContext): Promise<void> {
        await ctx.defer();

        const user = await getDBUser(ctx.user.id);
        if (!user) {
            Embed.Warning(ctx, "⚠️ You do not have an account set up.");
            return;
        }

        await user.delete();
        Embed.Success(ctx, "✅ Account info has been removed.");
    }
}
