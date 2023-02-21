import Embed from "../../utils/Embed";
import Hero from "../../types/diablo/Hero";
import Lilith from "../../utils/Lilith";

import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from "slash-create";
import { classColors, classImages, regionChoices } from "../../utils/Helpers";

export default class HeroCommand extends SlashCommand<Lilith> {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: "hero",
            description: "Get more detailed info about a hero",
            requiredPermissions: [
                "SEND_MESSAGES"
            ],
            options: [
                {
                    type: CommandOptionType.STRING,
                    name: "id",
                    description: "Hero ID",
                    required: true
                },
                {
                    type: CommandOptionType.STRING,
                    name: "battletag",
                    description: "Your BattleTag (AbcXyz#12345)"
                },
                {
                    type: CommandOptionType.STRING,
                    name: "region",
                    description: "The region of the account",
                    choices: regionChoices
                }
            ]
        });
    }

    async onError(err: Error, ctx: CommandContext): Promise<void> {
        await ctx.send(err && err.message ? err.message : "Error while fetching hero. If this keeps happening please contact ForestOni#0001 or join the support server.");
    }

    async run(ctx: CommandContext): Promise<void> {
        await ctx.defer();

        if ((!ctx.options.region && ctx.options.battletag) || (ctx.options.region && !ctx.options.battletag)) {
            await Embed.Danger(ctx, "❌ Region and BattleTag have to be used together.");
            return;
        }

        if (!/^\d+$/iu.test(ctx.options.id)) {
            await Embed.Danger(ctx, "❌ Invalid hero id");
            return;
        }

        let hero: Hero;
        if (ctx.options.region && ctx.options.battletag) {
            hero = await this.client.diablo.getHeroByTag(ctx.options.id, ctx.options.region, ctx.options.battletag);
        } else {
            hero = await this.client.diablo.getHero(ctx.user.id, ctx.options.id);
        }

        await ctx.send({
            embeds: [
                {
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
                        url: classImages[`${hero.class}-${hero.gender === 0 ? "male" : "female"}`]
                    },
                    color: classColors[hero.class],
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
            ]
        });
    }
}
