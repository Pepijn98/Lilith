import EmbedPaginator from "eris-pagination";
import settings from "~/settings";
import Command from "~/Command";
import Lilith from "~/structures/Client";
import { Message, EmbedOptions } from "eris";
import { classes, classImageMap, classColorMap, filter } from "~/utils/Helpers";

export default class extends Command {
    constructor(category: string) {
        super({
            name: "heroes",
            description: "Get a list of your heroes",
            usage: "heroes [class]",
            example: "heroes dh",
            category
        });
    }

    async run(msg: Message, args: string[], client: Lilith): Promise<void> {
        const account = await client.diablo.getAccount(msg.author);
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
