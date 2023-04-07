import {SmallBox} from '@app/components';
import React, { useEffect, useState } from 'react';
import {ContentHeader} from '@components';
import DeviceBox from './DeviceBox';
import { Device } from '@app/modals/Device';
import { getStatusDevice } from '@app/services/device';

const Dashboard = () => {
  const [groupDevice, setGroupDevice] = useState({});
  useEffect(() => {
    getStatusDevice().then((d) => {
      let dv:Device[] = d;
      let a = dv.reduce((r: any, a) => {
        const {loaiThietBi} = a;
        r[loaiThietBi.Name] = [...r[loaiThietBi.Name] || [], a];
        return r;
      }, {});
      setGroupDevice(a);
    });
  }, []);

  const renderGroupDevice = (ds: Device[]) => {
    return (ds.map((v, index) => 
      <div key={index} className="col-lg-3 col-6">
        <DeviceBox device={v} />
      </div>
    ));
  }

  return (
    <div>
      <ContentHeader title="Dashboard" />
      <section className="content">
        <div className="container-fluid">
          {
            Object.keys(groupDevice).map((k: string, index) => {
              let gd: Device[] = (groupDevice as any)[k];
              return (
                <div key={`gdivce-${index}`}>
                  <div className='row'>
                    <div className='col-12'>
                      <label>{k}</label>
                    </div>
                  </div>
                  <div className="row">
                    {
                      renderGroupDevice(gd)
                    }
                  </div>
                </div>
              );
            }
            )
          }
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
