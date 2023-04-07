import { DateTime } from "luxon";

export interface IoTValue {
    Id: number;
    IdSensor: number;
    Time: DateTime;
    Value: number;
    IdContract: string
}