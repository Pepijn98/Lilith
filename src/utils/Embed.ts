// TODO : Use for logging (maybe)

import { CommandContext, Message, MessageOptions } from "slash-create";

type Colors = {
    default: number;
    info: number;
    success: number;
    warning: number;
    danger: number;
};

type Type = {
    DEFAULT: 0;
    INFO: 1;
    SUCCESS: 2;
    WARNING: 3;
    DANGER: 4;
};

export class Embed {
    static Colors: Colors = {
        default: 0xff,
        info: 0x209cee,
        success: 0x65c875,
        warning: 0xffdd57,
        danger: 0xee4f5e
    };

    static Type: Type = {
        DEFAULT: 0,
        INFO: 1,
        SUCCESS: 2,
        WARNING: 3,
        DANGER: 4
    };

    private static Build(ctx: CommandContext, text: string, type: typeof Embed.Type[keyof Type], options: MessageOptions = {}): Promise<boolean | Message> {
        let color: number;
        switch (type) {
            case Embed.Type.INFO:
                color = Embed.Colors.info;
                break;
            case Embed.Type.SUCCESS:
                color = Embed.Colors.success;
                break;
            case Embed.Type.WARNING:
                color = Embed.Colors.warning;
                break;
            case Embed.Type.DANGER:
                color = Embed.Colors.danger;
                break;
            case Embed.Type.DEFAULT:
            default:
                color = Embed.Colors.default;
                break;
        }

        const content = Object.assign({}, options, {
            embeds: [
                {
                    color,
                    description: text
                }
            ]
        });

        return ctx.send(content);
    }

    static Default(ctx: CommandContext, text: string, options: MessageOptions = {}): Promise<boolean | Message> {
        return Embed.Build(ctx, text, Embed.Type.DEFAULT, options);
    }

    static Info(ctx: CommandContext, text: string, options: MessageOptions = {}): Promise<boolean | Message> {
        return Embed.Build(ctx, text, Embed.Type.INFO, options);
    }

    static Success(ctx: CommandContext, text: string, options: MessageOptions = {}): Promise<boolean | Message> {
        return Embed.Build(ctx, text, Embed.Type.SUCCESS, options);
    }

    static Warning(ctx: CommandContext, text: string, options: MessageOptions = {}): Promise<boolean | Message> {
        return Embed.Build(ctx, text, Embed.Type.WARNING, options);
    }

    static Danger(ctx: CommandContext, text: string, options: MessageOptions = {}): Promise<boolean | Message> {
        return Embed.Build(ctx, text, Embed.Type.DANGER, options);
    }
}
