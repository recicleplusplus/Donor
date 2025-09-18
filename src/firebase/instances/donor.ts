import {Statistic} from "./statistic";

export interface Donor {
    email: string;
    name: string | null;
    phone: string | null;
    photoUrl: string | null;
    points: number;
    donations: Array<string>;
    address: Array<string>;
    notifications: Array<string>;
    statistic: Statistic;
}
