import Embed from "../../utils/Embed";
import Lilith from "../../utils/Lilith";

import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from "slash-create";
import { getDBUser, rbattleTag } from "../../utils/Helpers";

export default class TagCommand extends SlashCommand<Lilith> {
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

    async run(ctx: CommandContext): Promise<void> {
        await ctx.defer();

        const user = await getDBUser(ctx.user.id);
        if (!user) {
            await Embed.Warning(ctx, "⚠️ Please use the `/setup` command before using any of the other Diablo related commands.");
            return;
        }

        if (ctx.options.battletag) {
            if (!rbattleTag.test(ctx.options.battletag)) {
                await Embed.Danger(ctx, "❌ Invalid BattleTag (example: AbcXyz#12345).");
                return;
            }

            try {
                await user.updateOne({ battleTag: ctx.options.battletag }).exec();
                await Embed.Success(ctx, "✅ Success updating your BattleTag.");
            } catch (e) {
                await Embed.Danger(ctx, "❌ Failed updating your BattleTag.");
                return;
            }
        } else {
            await Embed.Info(ctx, `ℹ️ Your current BattleTag is: \`${user.battleTag}\`.`);
        }
    }
}
