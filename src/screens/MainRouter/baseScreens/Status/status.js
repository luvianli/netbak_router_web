import React, { Component } from 'react';
import {axios,HYID ,posturl,deepCopy,secondsToFormatTime_H} from '@/share';
import './status.less'

class BaseLan extends Component {
    
  state={
    system_info:{},
  }
  
  componentDidMount(){
    this.getData()
  }
  
  getData=()=>{    
    axios.post({
      data:{
          HYID:HYID.get_basic_status_info,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode === 2000){    
        this.setState({
          system_info:deepCopy(res.huayi_r)
        })
      }
    })
}  

  render() {
    const {system_info,} = this.state
    return (
      <div>          
          <div className="sys-lable">
            <dl><dt>{window.__('Product Name')}</dt><dd>{system_info.pro_name}</dd></dl>
            <dl><dt>{window.__('Firmware Version')}</dt><dd>{system_info.fw_version}</dd></dl>          
            <dl><dt>{window.__('Official Website')}</dt><dd>
            <a href={`http://${system_info.company_domain}`} target="blank">
            {system_info.company_domain}</a></dd></dl>
            <dl><dt>{window.__('Release Time')}</dt><dd>{system_info.release_time}</dd></dl>
            <dl><dt>{window.__('CPU Usage')}</dt><dd>{system_info.cpu_usage}%</dd></dl>
            <dl><dt>{window.__('Memory Usage')}</dt><dd>{system_info.mem_usage}%</dd></dl>
            <dl><dt>{window.__('Flash Usage')}</dt><dd>{system_info.flash_usage}%</dd></dl>
            {/*<dl><dt>{window.__('Time of Day')}</dt><dd>{new Date(system_info.time_day*1000).Format("yyyy-MM-dd hh:mm:ss")}</dd></dl>*/}
            <dl><dt>{window.__('Time of Day')}</dt><dd>{system_info.time_day}</dd></dl>
            <dl><dt>{window.__('Uptime')}</dt><dd>{secondsToFormatTime_H(system_info.uptime)}</dd></dl>
            {
                system_info.sys_mode!==0?<dl><dt>{window.__('Associations')}</dt><dd>{system_info.sta_num}</dd></dl>:null
            }
            {
                system_info.sys_mode===2?<dl><dt>{window.__('Relay State')}</dt>
                <dd>{window.__(system_info.rep_status===0?'Failure':'Success')}</dd></dl>:null
            }
          </div>

      </div>
    );
  }
}

export default BaseLan;
