import Logger from "../utils/Logger";
import { ISettings } from "./ISettings";
// import { Model } from "mongoose";

// export interface IDatabaseContext {
//     user: Model<any>;
// }

export interface ICommandContext {
    settings: ISettings;
    logger: Logger;
    // database: IDatabaseContext;
}
