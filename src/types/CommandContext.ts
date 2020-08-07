import Logger from "~/utils/Logger";
import Settings from "./Settings";

export interface CommandContext {
    settings: Settings;
    logger: Logger;
}
