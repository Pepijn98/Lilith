// eslint-disable-next-line @typescript-eslint/no-unused-vars
import eris from "eris";

declare module "eris" {
    type FilterFN = (message: Message) => boolean;
    interface AwaitOptions {
        time: number;
        maxMatches: number;
    }

    interface User {
        tag: string;
    }

    interface Member {
        tag: string;
    }

    interface Channel {
        awaitMessages(filter: FilterFN, options: AwaitOptions): Promise<Message[]>;
    }
}
