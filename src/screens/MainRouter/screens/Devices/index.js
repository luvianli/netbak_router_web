import React,{Component} from 'react';
import {Table,} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import {message,Button,Icon} from 'antd';
import './index.less'
const ButtonGroup = Button.Group;

export default class MACFilter extends Component {
  state={
    ACLvisible:false
  }
  
  componentDidMount(){
    this.getStaList();
    this.getAclList();
    /**定时获取数据 */
    this.intervalId = setInterval(() => {
      this.getStaList();
      this.getAclList();
    }, 6000);
  }
  
  componentWillUnmount(){
    clearInterval(this.intervalId);
  }

  getStaList = () => {
    axios.post({
      data:{
        HYID:HYID.get_allstalist
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
          staline_arr:deepCopy(res.huayi_r.staline_arr),
        })
      }
    })
  };  
  
  getAclList = () => {
    axios.post({
      data:{
        HYID:HYID.get_acl_list
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
          acl_arr:deepCopy(res.huayi_r.acl_arr),
        })
      }
    })
  };  
  addAclList = (acl_addr) => {
    axios.post({
      data:{
        HYID:HYID.add_acl_list,
        acl_addr
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        //message.success(window.__('Unlocked Successfully'));
        message.success(window.__('Success'));
        this.getStaList();
      }
    })
  };  
  deleteAclList = (acl_addr) => {
    axios.post({
      data:{
        HYID:HYID.delete_acl_list,
        acl_addr
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        //message.success(window.__('Locked Successfully'));
        message.success(window.__('Success'));
        this.getAclList();
      }
    })
  }; 
  
  changeShowList=(visible)=>{
    if(visible===false){      
      this.getStaList();
    }
    else if(visible===true){     
      this.getAclList();
    }
    this.setState({
      ACLvisible:visible
    })
  }

  render(){    
    this.columns=[
      {
        title:window.__('IP Address'),
        dataIndex: 'ip_addr',
        key: 'ip_addr',
      },
      {
        title:window.__('MAC Address'),
        dataIndex: 'mac_addr',
        key: 'mac_addr',
        render: (index,record) => (
          <td key='mac_addr'>{record.mac_addr.toUpperCase()}</td>
        ),
      },
      {
        title:window.__('Host Name'),
        dataIndex: 'host_name',
        key: 'host_name',
      },
      {
        title:window.__('Action'),
        key: 'action',
        render: (index,record) => (
          <td key='actiontd'>
          <Icon type="lock" className='table-icon' onClick={()=>this.addAclList(record.mac_addr)}/>
          </td>
        ),
      },
    ]
    this.columnsACL=[
      {
        title:window.__('MAC Address'),
        dataIndex: 'acl_addr',
        key: 'acl_addr',
        render: (index,record) => (
          <td key='mac'>{record.acl_addr.toUpperCase()}</td>
        ),
      },
      {
        title:window.__('Action'),
        key: 'action',
        render: (index,record) => (
          <td key='actiontd'>
          <Icon type="unlock" className='table-icon' onClick={()=>this.deleteAclList(record.acl_addr)}/>
          </td>
        ),
      },
    ]
    const {staline_arr,acl_arr,ACLvisible} = this.state;
    
    return (
      <div className="devices-content">
        {/* <div style={{marginBottom:32}}></div> */}
      <ButtonGroup>
        <Button type="primary" className={ACLvisible===false?"visibleBtn": "initBtn"}
          style={{marginBottom:20}}
          onClick={()=>this.changeShowList(false)} >
        {window.__('Online List')}
        </Button>
        <Button type="primary" className={ACLvisible===true?"visibleBtn": "initBtn"}
          onClick={()=>this.changeShowList(true)}>
        {window.__('ACL List')}
        </Button>
      </ButtonGroup>
      {
        ACLvisible===false?
        <Table
        title={window.__('Online List')}
        selectKey={false}
        columns={this.columns}
        dataSource={staline_arr}
        opration={this.handleModal}/>
        :
        <Table
        title={window.__('ACL List')}
        selectKey={false}
        columns={this.columnsACL}
        dataSource={acl_arr}
        opration={this.handleModal}/>

      }

      </div>
    );
  }
}


  