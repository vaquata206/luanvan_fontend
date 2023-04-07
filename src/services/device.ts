import { SearchIoT } from "@app/modals/SearchIoT";
import intance from "@app/utils/axios"

export const getStatusDevice = async () => {
    var req = await intance.get('/sensor/statusDevices')
    return req.data;
}

export const getList = async () => {
    var req = await intance.get('/sensor');
    return req.data;
}

export const searchDataIot = async (d: SearchIoT) => {
    var req = await intance.post('/iot/search', d);
    return req.data;
}

export const verifyDataIot = async (sensorId: number) => {
    var req = await intance.get('/iot/verify/'+ sensorId);
    return req.data;
}