import D3 from "../structures/D3Client";
import { ISettings } from "../interfaces/ISettings";

export interface IEvent {
    name: string;
    run: (client: D3, settings: ISettings, ...args: any[]) => Promise<void>;
}
