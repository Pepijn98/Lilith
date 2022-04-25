// TODO : Use for logging (maybe)

import { Message } from "eris";

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

    private static Build(msg: Message, text: string, type: typeof Embed.Type[keyof Type]): Promise<Message> {
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

        return msg.channel.createMessage({
            embed: {
                color,
                description: text
            }
        });
    }

    static Default(msg: Message, text: string): Promise<Message> {
        return Embed.Build(msg, text, Embed.Type.DEFAULT);
    }

    static Info(msg: Message, text: string): Promise<Message> {
        return Embed.Build(msg, text, Embed.Type.INFO);
    }

    static Success(msg: Message, text: string): Promise<Message> {
        return Embed.Build(msg, text, Embed.Type.SUCCESS);
    }

    static Warning(msg: Message, text: string): Promise<Message> {
        return Embed.Build(msg, text, Embed.Type.WARNING);
    }

    static Danger(msg: Message, text: string): Promise<Message> {
        return Embed.Build(msg, text, Embed.Type.DANGER);
    }
}
