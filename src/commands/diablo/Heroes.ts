import EmbedPaginator from "eris-pagination";
import settings from "~/settings";
import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Lilith from "~/utils/Client";
import { Message, EmbedOptions } from "eris";
import { classes, classImageMap, classColorMap, filter } from "~/utils/Utils";

export default class extends Command {
    client: Lilith;

    constructor(ctx: CommandContext) {
        super({
            name: "heroes",
            description: "Get a list of your heroes",
            usage: "heroes [class]",
            example: "heroes dh",
            botPermissions: ["embedLinks", "addReactions", "manageMessages"],
            category: ctx.category
        });

        this.client = ctx.client;
    }

    async run(msg: Message, args: string[]): Promise<void> {
        const account = await this.client.diablo.getAccount(msg.author.id);
        const embeds: EmbedOptions[] = [];
        const heroes = args.length >= 1 && classes.includes(args[0]) ? account.heroes.filter((hero) => hero.classSlug === filter[args[0]]) : account.heroes;

        for (const hero of heroes) {
            // prettier-ignore
            embeds.push({
                author: {
                    name: hero.name,
                    // prettier-ignore
                    icon_url: hero.seasonal && hero.hardcore
                        ? "https://files.catbox.moe/wznz0k.png"
                        : hero.seasonal
                            ? "https://files.catbox.moe/9yi5yd.png"
                            : hero.hardcore
                                ? "https://files.catbox.moe/6jydwb.png"
                                : undefined
                },
                thumbnail: {
                    url: classImageMap[`${hero.classSlug}-${hero.gender === 0 ? "male" : "female"}`]
                },
                description: `ID: ${hero.id}\n` +
                    `Class: ${hero.class.split("-").map((part) => part.capitalize()).join(" ")}\n` +
                    "\n\n" +
                    `\`${settings.prefix}hero <id>\` for more details`,
                color: classColorMap[hero.classSlug]
            });
        }

        await EmbedPaginator.createPaginationEmbed(msg, embeds, {
            cycling: true,
            timeout: 60 * 1000,
            extendedButtons: true
        });
    }
}
