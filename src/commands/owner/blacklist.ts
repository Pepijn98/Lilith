import { SlashCommand, SlashCreator, CommandContext, CommandOptionType } from "slash-create";
import Lilith from "../../utils/Lilith";
import settings from "../../settings";
import Guilds from "../../models/Guild";
import Configs from "../../models/Config";

export default class BlacklistCommand extends SlashCommand {
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
        await Configs.findOneAndUpdate({ name: "blacklist" }, { $push: { guilds: ctx.options.id } }, { new: true }).exec();

        const client = this.creator.client as Lilith;
        const guild = client.guilds.get(ctx.options.id);
        if (guild) {
            await guild.leave();
            await Guilds.findOneAndDelete({ uid: ctx.options.id }).exec();
            await ctx.send(`Left guild **${guild.name}**`, { ephemeral: true });
        }
    }
}
