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
import ReactLoading from 'react-loading';

import './iotsystem.css'
import { PfButton } from '@profabric/react-components';
import { formatDateTimeToString } from '@app/utils/helpers';
import StatusDevice from './StatusDevice';

interface GroupedOption {
  id: number;
  readonly label: string;
  readonly options: SelectOption[];
};

interface SelectOption {
  value: number;
  label: string;
};

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

const IoTSystem = () => {
  
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

  function safetyFormat(cell: any, row: any) {
    return <StatusDevice data={row} chaincodes={chaincodes} />
  }

  const now = new Date();
  const [groupDevices, setGroupDevices] = useState<GroupedOption[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<SelectOption|null>(null);
  const [fromDate, setFromDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [toDate, setToDate] = useState(new Date());
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [dataIoT, setDataIot] = useState<IoTValue[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [chaincodes, setChaincodes] = useState<[]>();

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

  const verifyData = async (sensorId: number) => {
    //setChaincodes([]);
    var data = await verifyDataIot(sensorId);
    var chanincodes = (data || []).map((x: any) => {
      return {
        fromDate: new Date(x.fromDate),
        toDate: new Date(x.toDate),
        status: x.status
      }
    });
    
    console.log("cc");
    console.log(chanincodes)
    setChaincodes(chanincodes);
  }

  const search = async () => {
    if (selectedDevice == null || isSearching){
      return;
    }

    setIsSearching(true);
    var sensorId = selectedDevice == null? 0: selectedDevice.value;
    var data = await searchDataIot({
      fromDate: formatDateTimeToString(fromDate),
      toDate: formatDateTimeToString(toDate),
      sensorId: sensorId
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
    if (sensorId > 0){
      await verifyData(sensorId);
    }
    
    setDataIot(data);
    setDataTable(d);
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
