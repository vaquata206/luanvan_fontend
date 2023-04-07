/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import {ContentHeader} from '@components';
import DateTimePicker from 'react-datetime-picker'
import Select from 'react-select'
import { getList, searchDataIot, verifyDataIot } from '@app/services/device';
import { Device } from '@app/modals/Device';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { IoTValue } from '@app/modals/IoTValue';
import { DateTime } from 'luxon';
import ReactLoading from 'react-loading';

import './iotsystem.css'
import { PfButton } from '@profabric/react-components';
import { formatDateTimeToString } from '@app/utils/helpers';

interface GroupedOption {
  id: number;
  readonly label: string;
  readonly options: SelectOption[];
};

interface SelectOption {
  value: number;
  label: string;
};

const columns = [{
  dataField: "key",
  text: 'STT'
}, {
  dataField: 'Time',
  text: 'Thời gian'
}, {
  dataField: 'Value',
  text: 'Giá trị'
},
{
  dataField: 'Status',
  text: 'TT',
  headerClasses: 'tb-status-header',
  /*
  headerStyle: (a: any, b: any) => {
    return { width: '30px', textAlign: 'center' };
  },*/
  formatter: safetyFormat
}
];

const options = {
  //pageStartIndex: 1,
  sizePerPage: 10,
  onSizePerPageChange: (sizePerPage: any, page: any) => {
    console.log('Size per page change!!!');
    console.log('Newest size per page:' + sizePerPage);
    console.log('Newest page:' + page);
  },
  onPageChange: (page: any, sizePerPage: any) => {
    console.log('Page change!!!');
    console.log('Newest size per page:' + sizePerPage);
    console.log('Newest page:' + page);
  }
};

function safetyFormat(cell: any, row: any) {
  switch (row.Status){
    case 0: 
      return <ReactLoading type='spinningBubbles' color="#000000" height={'20px'} width={'20px'}/>
    case 1:
      return <div className="icon" style={{color: "green"}}>
                <i className={`ion ion-checkmark-circled`} />
            </div>
    case 2: 
      return <div className="icon" style={{color: "red"}}>
                <i className={`ion ion-close`} />
            </div>
    default:
      return <div className="icon">
                <i className={`ion ion-alert`} />
            </div>

  }
}

const IoTSystem = () => {

  const now = new Date();
  const [groupDevices, setGroupDevices] = useState<GroupedOption[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<SelectOption|null>(null);
  const [fromDate, setFromDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [toDate, setToDate] = useState(new Date());
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [dataIoT, setDataIot] = useState<IoTValue[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    getList().then((d) => {
      let groupedOptions:GroupedOption[] = [];
      let selected: SelectOption|null = null;
      d.forEach((element: Device) => {
        let group = groupedOptions.find(x => x.id == element.IdLoaiThietBi);
        let opt:SelectOption = {
          label: element.SensorName,
          value: element.Id
        }

        if (group == null || group == undefined){
          group = {
            id: element.IdLoaiThietBi,
            label: element.loaiThietBi.Name,
            options: []
          };

          groupedOptions.push(group);
        }

        group.options.push(opt);

        if (!selected){
          selected = opt;
        }
      });

      setGroupDevices(groupedOptions);
      setSelectedDevice(selected);
    });
  }, []);

  useEffect(() => {
    search();
  }, [selectedDevice, fromDate, toDate])
  
  useEffect(() => {
    verifyData();
  }, [dataIoT])

  const verifyData = async () => {
    var data = await verifyDataIot();
    debugger;
    var chanincodes = (data || []).map((x: any) => {
      return {
        fromDate: new Date(x.fromDate),
        toDate: new Date(x.toDate),
        status: x.status
      }
    });

    /*
    var dtable: any[] = (dataTable || []).map((x: any) => {

      var t = new Date(x.Time);
      var chaincode = chanincodes.find((c: any) => t >= c.fromDate && t <= c.toDate);
      var status = 3; // chua check
      if (chaincode){
        status = chaincode.status? 1: 2
      }

      return {
        ... x,
        status: status
      };
    });
    */
    var list:any[] = [];
    (dataTable || []).forEach((x: any) => {

      var t = new Date(x.Time);
      var chaincode = chanincodes.find((c: any) => t >= c.fromDate && t <= c.toDate);
      var status = 3; // chua check
      if (chaincode){
        status = chaincode.status? 1: 2
      }

      x.Status = status;
      list.push(x);
    });

    console.log(list);
    setDataTable([]);
  }

  const search = async () => {
    if (selectedDevice == null || isSearching){
      return;
    }

    setIsSearching(true);
    var data = await searchDataIot({
      fromDate: formatDateTimeToString(fromDate),
      toDate: formatDateTimeToString(toDate),
      sensorId: selectedDevice == null? 0: selectedDevice.value
    }).finally(() => {
      setIsSearching(false);
    });

    var d = (data || []).map((x: IoTValue, index: number) => {
      return {
        key: index + 1,
        id: x.Id,
        Time: x.Time,
        Value: x.Value,
        Status: 0 // đang check
      }
    });

    setDataIot(data);
    setDataTable(d);
    //verifyData();
  }

  return (
    <div>
      <ContentHeader title="Blank Page" />
      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tìm kiếm</h3>
              <div className="card-tools">
                <button
                  type="button"
                  className="btn btn-tool"
                  data-widget="collapse"
                  data-toggle="tooltip"
                  title="Collapse"
                >
                  <i className="fa fa-minus" />
                </button>
                <button
                  type="button"
                  className="btn btn-tool"
                  data-widget="remove"
                  data-toggle="tooltip"
                  title="Remove"
                >
                  <i className="fa fa-times" />
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className='row'>
                <div className='col-4'>
                  <div className='form-group'>
                    <label>Thiết bị:</label>
                    <Select options={groupDevices} onChange={setSelectedDevice} value={selectedDevice} />
                  </div>
                </div>
                <div className='col-4'>
                  <div className='form-group'>
                    <label>Từ ngày:</label>
                    <DateTimePicker className='form-control' onChange={setFromDate} value={fromDate} format='dd-MM-yyyy HH:mm' />
                  </div>
                </div>
                <div className='col-4'>
                  <div className='form-group'>
                    <label>Đến ngày:</label>
                    <DateTimePicker className='form-control' onChange={setToDate} value={toDate} format='dd-MM-yyyy HH:mm' />
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-2'>
                  <PfButton block type='button' loading={isSearching} onClick={search}>Tìm</PfButton>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              <div className='card'>
                <div className='card-header'>
                  <h3 className="card-title">Danh sách</h3>
                </div>
                <div className='card-body'>
                  <BootstrapTable
                      keyField="key"
                      data={dataTable}
                      columns={columns}
                      pagination={ paginationFactory(options) }
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IoTSystem;
