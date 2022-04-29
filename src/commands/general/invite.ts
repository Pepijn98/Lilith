import Lilith from "../../utils/Lilith";

import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from "slash-create";

export default class InviteCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "invite",
            description: "Create an invite url",
            options: [
                {
                    type: CommandOptionType.NUMBER,
                    name: "permissions",
                    description: "Permissions number (example: 412384349248)"
                }
            ]
        });
    }

    async run(ctx: CommandContext): Promise<void> {
        await ctx.defer(true);
        ctx.send({
            // https://discord.com/api/oauth2/authorize?client_id=740897738983604284&permissions=412384349248&scope=applications.commands%20bot
            content: `<https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=${ctx.options.permissions ? ctx.options.permissions : 412384349248}&scope=applications.commands%20bot>`,
            ephemeral: true
        });
    }
}
