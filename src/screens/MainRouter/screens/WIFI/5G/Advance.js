import React, { Component } from 'react';
import AdvanceWifi from '../AdvanceWifi'
import {axios,HYID ,posturl,} from '@/share';

class Advance5G extends Component {  
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
            wifi_radio:1
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
        <AdvanceWifi radio_id={1} wifi_enable={this.state.wifi_admin}/>
    );
  }
}

export default Advance5G

