import React,{Component} from 'react';
import {FormGroup,PageText,PageText2} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy,totalTrafficbps,totalTrafficByte} from '@/share';

export default class WIFIBase extends Component {
  state={
    wan_infos:{},
  }
  componentDidMount(){
    this.getData();
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
          wan_infos:deepCopy(res.huayi_r.wan_infos),
        })
      }
    })
  };  
  renderDNS=(ddnsArr)=>{
    if(!ddnsArr) return;
    if(ddnsArr.length<=1){
      return(        
        <FormGroup lable={window.__('DNS Server')}>
            <label>{ddnsArr[0]||window.__('Unknown')}</label>
        </FormGroup>
      )
    }
    return ddnsArr.map((item,index)=>{
      return(        
        <FormGroup key={index} lable={window.__('DNS Server')+(index+1)}>
            <label>{item}</label>
        </FormGroup>
      )
    })
  }
  render(){
    const {wan_infos:{mac_addr,link,mtu_num,ip_addr,subnet_mask,gateway,dns_server_addr_addr,
      tx_bps,rx_bps,rx_bytes,tx_bytes},} = this.state
    return (
      <div className='label-info'>
      <PageText 
        title={window.__('WAN Status')}/>
          
        <FormGroup lable={window.__('MAC Address')}>
            <label>{mac_addr}</label>
        </FormGroup>
        <FormGroup lable={window.__('Connection Status')}>
            <label>{window.__(link===1?'Connected':'Disconnected')}</label>
        </FormGroup>
        <FormGroup lable={window.__('MTU')}>
            <label>{mtu_num}</label>
        </FormGroup>
        <FormGroup lable={window.__('IP Address')}>
            <label>{ip_addr}</label>
        </FormGroup>
        <FormGroup lable={window.__('Subnet Mask')}>
            <label>{subnet_mask}</label>
        </FormGroup>
        <FormGroup lable={window.__('Default Gateway')}>
            <label>{gateway}</label>
        </FormGroup>

        {this.renderDNS(dns_server_addr_addr)}

        <FormGroup lable={window.__('Upload speed')}>
            <label>{totalTrafficbps(tx_bps)}</label>
        </FormGroup>
        <FormGroup lable={window.__('Download speed')}>
            <label>{totalTrafficbps(rx_bps)}</label>
        </FormGroup>
        {/* <FormGroup lable={window.__('Rx Bytes')}>
            <label>{totalTrafficByte(rx_bytes)}</label>
        </FormGroup>
        <FormGroup lable={window.__('Tx Bytes')}>
            <label>{totalTrafficByte(tx_bytes)}</label>
        </FormGroup> */}

      <div style={{height:100}}></div>
      </div>
    );
  }
}


  