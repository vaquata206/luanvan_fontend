import { Device } from '@app/modals/Device';
import React from 'react';

const DeviceBox = ({device}: {device: Device}) => {
    return (
        <div className={`small-box ${device.loaiThietBi.StyleClass}`}>
            <div className="inner">
                <h3>{device.now == null ? "--": `${device.now.Value} ${device.DonViDo}` }</h3>

                <label>{device.SensorName}</label>
                <p>{device.Location}</p>
            </div>
            <div className="icon">
                <i className={`ion ion-${device.loaiThietBi.Icon}`} />
            </div>
            <a href="/" className="small-box-footer">
                More info <i className="fas fa-arrow-circle-right" />
            </a>
        </div>
    )
}

export default DeviceBox;