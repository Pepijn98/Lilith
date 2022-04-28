import { SlashCommand, SlashCreator, CommandContext, CommandOptionType } from "slash-create";
import Lilith from "../../utils/Lilith";
import settings from "../../settings";
import Guilds from "../../models/Guild";
import Configs from "../../models/Config";

export default class LeaveCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "leave",
            description: "Make the bot leave a guild",
            guildIDs: settings.devGuildID,
            defaultPermission: false,
            options: [
                {
                    type: CommandOptionType.NUMBER,
                    name: "id",
                    description: "Guild ID",
                    required: true
                },
                {
                    type: CommandOptionType.BOOLEAN,
                    name: "blacklist",
                    description: "Add guild id to blacklist",
                    required: true
                }
            ]
        });
    }

    hasPermission(ctx: CommandContext): string | boolean {
        return ctx.user.id === settings.owner;
    }

    async run(ctx: CommandContext): Promise<void> {
        const client = this.creator.client as Lilith;
        const guild = client.guilds.get(ctx.options.id);
        if (guild) {
            if (ctx.options.blacklist) {
                await Configs.findOneAndUpdate({ name: "blacklist" }, { $push: { guilds: ctx.options.id } }, { new: true }).exec();
            }
            await guild.leave();
            await Guilds.findOneAndDelete({ uid: ctx.options.id }).exec();
            await ctx.send(`Left guild **${guild.name}**`, { ephemeral: true });
        } else {
            await ctx.send(`Could not find guild with id **${ctx.options.id}**`, { ephemeral: true });
        }
    }
}
