import React from 'react';
import {Table,Modal,FormButton} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import PropTypes from 'prop-types';

export default class ScanList extends React.Component{ 
  state={
    arp_arr : [],
  }
    
  getLanArpList = () => {
    axios.post({
      data:{
        HYID:HYID.get_lan_arp_list
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
          arp_arr:deepCopy(res.huayi_r.arp_arr),
        })
      }
    })
  };  
  
  handleSelect=(index) => {
    let {arp_arr} = this.state;
    this.setState({
        visible: false,
    });
    let mac_addr = arp_arr[index].mac_addr.toUpperCase();
    let ip_addr = arp_arr[index].ip_addr;
    this.props.scanData(ip_addr,mac_addr);
  }

  handleScanList=()=>{
    this.getLanArpList()
    this.setState({
        visible: true,
      });
  }
  handleCloseModal=()=>{    
    this.setState({
      visible: false,
    });
  }
  render() {
    this.columns=[
      {
        title: window.__('IP Address'),
        dataIndex: 'ip_addr',
        key: 'ip_addr',
      },
      {
        title: window.__('MAC Address'),
        dataIndex: 'mac_addr',
        key: 'mac_addr',
        render: (index,record) => (
          <td key='mac_addr'>{record.mac_addr.toUpperCase()}</td>
        ),
      },
      {
        title:window.__('Action'),
        key: 'action',
        render: (index,record) => (
          <td key='actiontd'>
          <button className='table-select' onClick={()=>this.handleSelect(index)}>{window.__('Select')}</button>
          </td>
        ),
      },
    ]
    const {arp_arr} = this.state;
    return (
          <div>
          <FormButton onClick={this.handleScanList} style={{marginTop:20}}>{window.__('Scan')}</FormButton>
          
          <Modal
            title={window.__('Scan List')}
            style={{width:650,}}
            visible={this.state.visible}
            closeModel={this.handleCloseModal}
            close={true}
            >          
            <Table 
            columns={this.columns}
            dataSource={arp_arr}
            opration={this.handleModal}/>
          </Modal>
          </div>
    )
  }
}

ScanList.propTypes = {
  scanData:PropTypes.func.isRequired,
};  

ScanList.defaultProps = {
scanData:function(){return;}
};