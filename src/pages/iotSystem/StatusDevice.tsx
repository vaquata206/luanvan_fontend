import ReactLoading from 'react-loading';


const StatusDevice = ({ data, chaincodes }: { data: any, chaincodes: any[] }) => {
  var t = new Date(data.Time);
  var status = 0;
  if (chaincodes.length > 0){
    var chaincode = chaincodes.find((c: any) => t >= c.fromDate && t <= c.toDate);
    if (chaincode) {
      status = chaincode.status ? 1 : 2
    }else{
      status = 3;
    }
  }
  
  switch (status) {
    case 0:
      return <ReactLoading type='spinningBubbles' color="#000000" height={'20px'} width={'20px'} />
    case 1:
      return <div className="icon" style={{ color: "green" }}>
        <i className={`ion ion-checkmark-circled`} />
      </div>
    case 2:
      return <div className="icon" style={{ color: "red" }}>
        <i className={`ion ion-close`} />
      </div>
    default:
      return <div className="icon">
        <i className={`ion ion-alert`} />
      </div>
  }
}

export default StatusDevice;