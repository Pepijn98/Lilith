import { SlashCommand, SlashCreator, CommandContext, CommandOptionType } from "slash-create";
import { getDBUser, rbattleTag } from "../../utils/Helpers";

export default class TagCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "tag",
            description: "Update your BattleTag (example: abcxyz#12345)",
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: "battletag",
                    description: "Your BattleTag (abcxyz#12345)"
                }
            ]
        });
    }

    async run(ctx: CommandContext): Promise<string> {
        await ctx.defer();

        const user = await getDBUser(ctx.user.id);
        if (!user) {
            return "⚠️ Please use the `/setup` command before using any of the other Diablo related commands.";
        }

        if (ctx.options.battletag) {
            if (!rbattleTag.test(ctx.options.battletag)) {
                return "❌ Invalid BattleTag (example: abcxyz#12345).";
            }

            try {
                await user.updateOne({ battleTag: ctx.options.battletag }).exec();
                return "✅ Success updating your BattleTag.";
            } catch (e) {
                return "❌ Failed updating your BattleTag.";
            }
        } else {
            return `ℹ️ Your current BattleTag is: \`${user.battleTag}\`.`;
        }
    }
}
