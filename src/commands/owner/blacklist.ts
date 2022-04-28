import Configs from "../../models/Config";
import { Embed } from "../../utils/Embed";
import Guilds from "../../models/Guild";
import Lilith from "../../utils/Lilith";
import settings from "../../settings";

import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from "slash-create";

export default class BlacklistCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "blacklist",
            description: "Backlist guild from inviting the bot",
            guildIDs: settings.devGuildID,
            defaultPermission: false,
            options: [
                {
                    type: CommandOptionType.NUMBER,
                    name: "id",
                    description: "Guild ID",
                    required: true
                }
            ]
        });
    }

    hasPermission(ctx: CommandContext): string | boolean {
        return ctx.user.id === settings.owner;
    }

    async run(ctx: CommandContext): Promise<void> {
        // Unlike leave, here we blacklist regardless of finding the guild
        try {
            await Configs.findOneAndUpdate({ name: "blacklist" }, { $push: { guilds: ctx.options.id } }, { new: true }).exec();
            await Embed.Success(ctx, "✅ Added guild to the blacklist.");
        } catch (e) {
            await Embed.Success(ctx, "❌ Failed adding guild to the blacklist.");
            return;
        }

        const guild = this.client.guilds.get(ctx.options.id);
        if (guild) {
            await guild.leave();
            await Guilds.findOneAndDelete({ uid: ctx.options.id }).exec();
        }
    }
}
