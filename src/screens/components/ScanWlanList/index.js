import React from 'react';
import {Table,Modal,FormButton} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import PropTypes from 'prop-types';

export default class ScanList extends React.Component{ 
  state={
    wifista_list : [],
  }
    
  getWifiStamaclist = () => {
    axios.post({
      data:{
        HYID:HYID.get_wifi_stamaclist
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
          wifista_list:deepCopy(res.huayi_r.wifista_list),
        })
      }
    })
  };  
  
  handleSelect=(index) => {
    let {wifista_list} = this.state;
    this.setState({
        visible: false,
    });
    let mac_addr = wifista_list[index].mac_addr.toUpperCase();
    this.props.scanWlanData(mac_addr);
  }

  handleScanList=()=>{
    this.getWifiStamaclist()
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
        title: window.__('MAC Address'),
        dataIndex: 'mac_addr',
        key: 'mac_addr',
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
    const {wifista_list} = this.state;
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
            dataSource={wifista_list}
            opration={this.handleModal}/>
          </Modal>
          </div>
    )
  }
}

ScanList.propTypes = {
  scanWlanData:PropTypes.func.isRequired,
};  

ScanList.defaultProps = {
  scanWlanData:function(){return;}
};