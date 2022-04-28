import Configs from "../../models/Config";
import Lilith from "../../utils/Lilith";
import settings from "../../settings";

import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from "slash-create";

export default class WhitelistCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "whitelist",
            description: "Whitelist guild from the user/bot ratio",
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
        await Configs.findOneAndUpdate({ name: "whitelist" }, { $push: { guilds: ctx.options.id } }, { new: true }).exec();
    }
}
