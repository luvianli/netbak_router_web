import React,{Component} from 'react';
import {FormGroup,PageText,PageText2} from '@/screens/components';
import {axios,HYID,sms_HYID,posturl,deepCopy,smsurl} from '@/share';

export default class WIFIBase extends Component {
  state={
    lan_infos:{}
  }
  componentDidMount(){
    this.getData();
    this.testCgi()
  }
  
  getData = () => {
    axios.post({
      data:{
        HYID:HYID.get_network_info
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
          lan_infos:deepCopy(res.huayi_r.lan_infos),
        })
      }
    })
  }; 
  testCgi = () => {
    axios.post({
      data:{
        HYID:sms_HYID.cgi_get_no_data
      },
      url:smsurl
    }).then((res)=>{})
  }; 
  
  render(){
    const {lan_infos} = this.state
    return (
      <div className='label-info'>
      <PageText 
          title={window.__('LAN Status')}/>
        <FormGroup lable={window.__('MAC Address')}>
          <label>{lan_infos.mac_addr}</label>
        </FormGroup>
        <FormGroup lable={window.__('IP Address')}>
            <label>{lan_infos.ip_addr}</label>
        </FormGroup>
        <FormGroup lable={window.__('Subnet Mask')}>
            <label>{lan_infos.subnet_mask}</label>
        </FormGroup>
        <FormGroup lable={window.__('Associations')}>
            <label>{lan_infos.client_sum}</label>
        </FormGroup>
      <div style={{height:100}}></div>
      </div>
    );
  }
}


  