// eslint-disable-next-line @typescript-eslint/no-unused-vars
import eris from "eris";

declare module "eris" {
    interface User {
        tag: string;
    }

    interface Member {
        tag: string;
    }
}
