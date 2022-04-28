import Lilith from "../../utils/Lilith";

import { CommandContext, SlashCommand, SlashCreator } from "slash-create";

export default class HeroCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "hero",
            description: "Something about this command"
        });
    }

    async run(ctx: CommandContext): Promise<string> {
        await ctx.defer();
        return "Not implemented yet";
    }
}
