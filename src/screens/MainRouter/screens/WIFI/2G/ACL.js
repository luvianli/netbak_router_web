import React, { Component } from 'react';
import ACLWifi from '../ACLWifi'
import {axios,HYID ,posturl,} from '@/share';

class ACL extends Component {
  state={
    wifi_admin:""
  }
  componentDidMount(){
    this.getData()
  }
  getData=()=>{    
      axios.post({
        data:{
            HYID:HYID.get_wireless_basic_config,
            wifi_radio:0
        },
        url:posturl
      }).then((res)=>{
        if(res.errcode === 2000){    
          this.setState({
            wifi_admin:res.huayi_r.wifi_admin,
          })
        }
      })
  }  
    render() {   
      return (
        <ACLWifi radio_id={0} wifi_enable={this.state.wifi_admin}/>
    );
  }
}


export default ACL

