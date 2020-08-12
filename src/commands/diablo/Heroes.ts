import EmbedPaginator from "eris-pagination";
import settings from "~/settings";
import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Lilith from "~/utils/Client";
import { Account, Hero } from "~/types/diablo/Account";
import { Message, EmbedOptions } from "eris";
import { classes, classImageMap, classColorMap, acronymClassMap, regions, rbattleTag, isGuildChannel } from "~/utils/Utils";

export default class extends Command {
    client: Lilith;

    constructor(ctx: CommandContext) {
        super({
            name: "heroes",
            description: "Get a list of your heroes",
            usage: "heroes [class] [<region> <battleTag>]",
            example: "heroes dh",
            botPermissions: ["embedLinks", "addReactions", "manageMessages"],
            category: ctx.category
        });

        this.client = ctx.client;
    }

    async run(msg: Message, args: string[]): Promise<void> {
        const embeds: EmbedOptions[] = [];

        let prefix = settings.prefix;
        if (isGuildChannel(msg.channel)) {
            prefix = this.client.guildPrefixMap.get(msg.channel.guild.id) || settings.prefix;
        }

        let account: Account;
        let heroes: Hero[];
        let filter: string;
        let region: string;
        let tag: string;

        switch (args.length) {
            case 0:
                account = await this.client.diablo.getAccount(msg.author.id);
                heroes = account.heroes;
                break;
            case 1: // Only class
                filter = args[0].trim();
                if (!classes.includes(filter)) {
                    msg.channel.createMessage("Invalid class");
                    return;
                }

                account = await this.client.diablo.getAccount(msg.author.id);
                heroes = account.heroes.filter((hero) => hero.classSlug === acronymClassMap[filter]) || [];
                break;
            case 2: // Only region + battle tag
                region = args[0].trim();
                tag = args[1].trim();

                if (!regions.includes(region)) {
                    msg.channel.createMessage("Invalid region");
                    return;
                }

                if (!rbattleTag.test(tag)) {
                    msg.channel.createMessage("Invalid battle tag");
                    return;
                }

                account = await this.client.diablo.getAccountByTag(region, tag);
                heroes = account.heroes;
                break;
            case 3: // class, region and battle tag
                filter = args[0].trim();
                region = args[1].trim();
                tag = args[2].trim();

                if (!regions.includes(region)) {
                    await msg.channel.createMessage("Invalid region");
                    return;
                }

                if (!rbattleTag.test(tag)) {
                    await msg.channel.createMessage("Invalid battle tag");
                    return;
                }

                account = await this.client.diablo.getAccountByTag(region, tag);
                heroes = account.heroes.filter((hero) => hero.classSlug === acronymClassMap[filter]) || [];
                break;
            default:
                await msg.channel.createMessage(`Invalid command usage, check \`${prefix}\`help ${this.name} to see how it's used.`);
                return;
        }

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

        if (!embeds.length) {
            await msg.channel.createMessage("No heroes found");
            return;
        } else if (embeds.length === 1) {
            await msg.channel.createMessage({
                embed: embeds[0]
            });
        } else {
            await EmbedPaginator.createPaginationEmbed(msg, embeds, {
                cycling: true,
                timeout: 60 * 1000,
                extendedButtons: true
            });
        }
    }
}
