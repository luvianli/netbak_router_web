import React,{Component} from 'react';
import {Table,PageText} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import {message,Button,Modal} from 'antd';
import moment from 'moment';

export default class MACFilter extends Component {
  state={
    usr_arr:[],
  }
  componentDidMount(){
    this.getData()
    this.interval=setInterval(()=>{
      this.getData();
    },5000)
  }
  componentWillUnmount(){
    clearInterval(this.interval);
  }
  getData = () => {
    axios.post({
      data:{
        HYID:HYID.get_vpn_user_onlien
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
          usr_arr:deepCopy(res.huayi_r.usr_arr),
        })
      }
    })
  };  
  setData=(pid)=>{
    axios.post({
      data:{
        HYID:HYID.set_vpn_user_onlien,
        pid,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        message.success(window.__('Success'));
        this.getData();
      }
    })
  }
  
  handleDelete = (pid) => {
    Modal.confirm({
        title: window.__("Confirm Disconnect?"),
        okText: window.__('OK'),
        okType: 'danger',
        cancelText: window.__("Cancel"),
        onOk: () => {
            this.setData(pid);
        }
    })
  }
  render(){
    this.columns=[
        {
            title: window.__("User Name"),
            dataIndex: "account",
            key: 'account',
        }, {
            title: window.__("User Type"),
            dataIndex: "account_type",
            key: 'account_type',
        }, {
            title: window.__("Dial IP"),
            dataIndex: "ip_addr",
            key: 'ip_addr',
        }, {
            title: window.__("Assign IP"),
            dataIndex: "device_addr",
            key: 'device_addr',
        }, {
            title: window.__("JoinTime"),
            dataIndex: "jointime",
            key: 'jointime',
            render: (index,record) => (
              <td key='actiontd'>
                {moment(record.jointime*1000).format("YYYY-MM-DD HH:mm:ss")}
              </td>
            ),
        },
      {
        title:window.__('Action'),
        key: 'action',
        render: (index,record) => (
          <td key='actiontd'>
          <Button type="danger" onClick={()=>this.handleDelete(record.pid)} >
              {window.__('Disconnect')}
          </Button>
          </td>
        ),
      },
    ]
    const {usr_arr} = this.state;
    return (
      <div>
        <PageText 
          title={window.__('Account Status')}
          msg={window.__('')}
        />
                    
        <div style={{marginBottom:30}}></div>
        <Table 
        title={window.__('Account Status')}
        selectKey={false}
        columns={this.columns}
        showAdd={false}
        dataSource={usr_arr}/>
      </div>
    );
  }
}
  