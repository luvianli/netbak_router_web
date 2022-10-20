import React from 'react';
import {Table,Modal,FormButton} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy,secondsToFormatTime_H} from '@/share';
import PropTypes from 'prop-types';

export default class ClientList extends React.Component{ 
  state={
    client_list : [],
  }
  componentDidMount(){
      this.props.onRef(this)
  }
  getUserWirelessClient=(radio_id)=>{    
    axios.post({
      data:{
          HYID:HYID.get_user_wireless_client,
          wifi_radio:radio_id
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode === 2000){    
        this.setState({
          client_list:deepCopy(res.huayi_r.wireless_clients_arr),     
        })
      }
    })
  }  

  handleSelect=(index) => {
    let {client_list} = this.state;
    this.setState({
        visible: false,
    });
    let mac = client_list[index].bssid.toUpperCase();
    this.props.scanData('',mac);
  }

  handleScanList=(radio_id = 0)=>{
    this.getUserWirelessClient(radio_id)
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
    this.columns=this.props.show_action ? [
      {
        title: window.__('Index'),
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: window.__('MAC Address'),
        dataIndex: 'bssid',
        key: 'bssid',
      },
      {
        title: window.__('Assoc Time'),
        // dataIndex: 'stauptime',
        key: 'stauptime',
        render: (index,record) => (
          <td key='stauptime'>{secondsToFormatTime_H(record.stauptime)}</td>
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
    ]:[
      {
        title: window.__('Index'),
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: window.__('MAC Address'),
        dataIndex: 'bssid',
        key: 'bssid',
      },
      {
        title: window.__('Assoc Time'),
        key: 'stauptime',
        render: (index,record) => (
        <td key='stauptime'>{secondsToFormatTime_H(record.stauptime)}</td>
        ),
      },
    ]
    const {client_list} = this.state;
    return (
          <div>
          {this.props.show_scanbtn && 
            <FormButton 
              onClick={()=>this.handleScanList(this.props.radio_id)} 
              style={{marginTop:20}}>
                {window.__('Scan')}
            </FormButton>}
          
          <Modal
            title={this.props.radio_id===0?'2.4G ' + window.__('Wireless Client List'):
                  this.props.radio_id===1?'5.8G ' + window.__('Wireless Client List'):
                  window.__('Wireless Client List')}
            style={{width:650,}}
            visible={this.state.visible}
            closeModel={this.handleCloseModal}
            close={true}
            >          
              <Table 
              columns={this.columns}
              dataSource={client_list}
              opration={this.handleModal}/>
          </Modal>
          </div>
    )
  }
}

ClientList.propTypes = {
  scanData:PropTypes.func.isRequired,
  onRef:PropTypes.func,
  radio_id:PropTypes.number,
  show_action:PropTypes.bool,
  show_scanbtn:PropTypes.bool,
};  

ClientList.defaultProps = {
  //radio_id:0, //默认下发0
  show_action:true,//默认不显示操作项
  show_scanbtn: true,
  scanData:function(){return;},
  onRef:function(){return;}
};