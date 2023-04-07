import { DateTime } from "luxon";

export interface IoTValue {
    Id: number;
    IdSensor: number;
    Time: Date;
    Value: number;
    IdContract: string
}