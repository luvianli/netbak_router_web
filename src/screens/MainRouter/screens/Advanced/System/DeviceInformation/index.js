import React,{Component} from 'react';
import {FormGroup,FormButton,PageText} from '@/screens/components';
import {HYID ,posturl,axios,deepCopy} from '@/share';
import {message} from 'antd';

export default class WIFIBase extends Component {
  state={
    result:{}
  }
  componentDidMount(){
    this.getData();
  }
  
  getData=(refresh=null)=>{    
    axios.post({
      data:{
        HYID:HYID.get_system_info,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({
          result:deepCopy(res.huayi_r)
        })
        if(refresh==='refresh'){
          message.success(window.__('Refresh Success'))
        }
      }
    })
  }
  render(){
    const {result:{product_name,product_model,software_version,
      webui_version,lan_mac,ip_address}} = this.state;
    return (
      <div>
        <PageText 
          title={window.__('Device Information')}/>
          <div className='label-info'>
        <FormGroup lable={window.__('Product Name')}>
            <label>{product_name||window.__('Unknown')}</label>
        </FormGroup>
        <FormGroup lable={window.__('Product Model')}>
            <label>{product_model||window.__('Unknown')}</label>
        </FormGroup>
        <FormGroup lable={window.__('Firmware Version')}>
            <label>{software_version||window.__('Unknown')}</label>
        </FormGroup>
        <FormGroup lable={window.__('Web UI Version')}>
            <label>{webui_version||'2.0.0'}</label>
        </FormGroup>
        <FormGroup lable={window.__('LAN MAC Address')}>
            <label>{lan_mac||window.__('Unknown')}</label>
        </FormGroup>
        <FormGroup lable={window.__('WAN IP Address')}>
            <label>{ip_address||window.__('Unknown')}</label>
        </FormGroup>

        <FormButton onClick={()=>this.getData('refresh')}>{window.__('Refresh')}</FormButton>
        <div style={{height:66}}></div>
        
        </div>
      </div>
    );
  }
}


  