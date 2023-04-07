import { IoTValue } from "./IoTValue";
import { LoaiThietBi } from "./LoaiThietBi";


export interface Device {
    Id: number;
    SensorName: string;
    Location: string;
    IdLoaiThietBi: number;
    loaiThietBi: LoaiThietBi;
    DonViDo: string;
    now: IoTValue
}