import Command from "~/Command";
import CommandContext from "~/types/CommandContext";
import Lilith from "~/utils/Client";
import { Message } from "eris";
import { classImageMap, classColorMap, isGuildChannel, regions, rbattleTag } from "~/utils/Utils";
import Hero from "~/types/diablo/Hero";
import settings from "~/settings";

export default class extends Command {
    client: Lilith;

    constructor(ctx: CommandContext) {
        super({
            name: "hero",
            description: "Get more detailed info about a hero",
            usage: "hero <id> [<region> <battleTag>]",
            example: "hero 123456789",
            requiredArgs: 1,
            botPermissions: ["embedLinks"],
            category: ctx.category
        });

        this.client = ctx.client;
    }

    async run(msg: Message, args: string[]): Promise<void> {
        let prefix = settings.prefix;
        if (isGuildChannel(msg.channel)) {
            prefix = this.client.guildPrefixMap.get(msg.channel.guild.id) || settings.prefix;
        }

        const heroID = args[0].trim();
        if (!/^\d+$/iu.test(heroID)) {
            msg.channel.createMessage("Invalid hero id");
            return;
        }

        let hero: Hero;
        let region: string;
        let tag: string;

        switch (args.length) {
            case 1:
                hero = await this.client.diablo.getHero(msg.author.id, heroID);
                break;
            case 3:
                region = args[1].trim();
                tag = args[2].trim();

                if (!regions.includes(region)) {
                    msg.channel.createMessage("Invalid region");
                    return;
                }

                if (!rbattleTag.test(tag)) {
                    msg.channel.createMessage("Invalid battle tag");
                    return;
                }

                hero = await this.client.diablo.getHeroByTag(heroID, region, tag);
                break;
            default:
                msg.channel.createMessage(`Invalid command usage, check \`${prefix}\`help ${this.name} to see how it's used.`);
                return;
        }

        await msg.channel.createMessage({
            embed: {
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
                    url: classImageMap[`${hero.class}-${hero.gender === 0 ? "male" : "female"}`]
                },
                color: classColorMap[hero.class],
                fields: [
                    {
                        name: "Level",
                        value: hero.level.toString(),
                        inline: true
                    },
                    {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                    },
                    {
                        name: "Paragon",
                        value: hero.paragonLevel.toString(),
                        inline: true
                    },
                    {
                        name: "Season",
                        value: hero.seasonCreated.toString(),
                        inline: true
                    },
                    {
                        name: "\u200B",
                        value: "\u200B",
                        inline: true
                    },
                    {
                        name: "Highest Solo Rift",
                        value: hero.highestSoloRiftCompleted.toString(),
                        inline: true
                    },
                    {
                        name: "Alive",
                        value: hero.alive ? "yes" : "no"
                    },
                    {
                        name: "\u200B",
                        value: "**__Active Skills__**"
                    },
                    ...hero.skills.active.map((active) => ({ name: active.skill.name, value: active.rune.name, inline: true })),
                    {
                        name: "\u200B",
                        value: `**__Passive Skills__**\n${hero.skills.passive.map((active) => active.skill.name).join("\n")}`
                    }
                ]
            }
        });
    }
}
