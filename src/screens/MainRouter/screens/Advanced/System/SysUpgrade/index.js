import React, { Component } from 'react';
import { PageText,Upload,FormGroup,FormRadioCheck } from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import { Checkbox } from 'antd';

class SysConfiguration extends Component {
  state={
    upgrade_info:{},
    set_system_upgrade:`${HYID.set_system_upgrade}1`,
    keep_setting:true,
  }
  componentDidMount(){
    this.getData();
  }
  getData = () => {
    axios.post({
      data:{
        HYID:HYID.get_upgrade_info
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({
          upgrade_info:deepCopy(res.huayi_r)
        })
      }
    })
  };
  handleChange = name => event => {
    if(name==='keep_setting'){      
      let value =  event.target.checked===true?'1':'0' ;
      this.setState({ 
        keep_setting :value,
        set_system_upgrade:`${HYID.set_system_upgrade}${value}`
      });
    }
  };
  render() {
    const {upgrade_info:{pro_model,fw_version,release_time,maxsize,maxsize_tip}}=this.state;
    return (
      <div>
      <PageText 
        title={window.__('Firmware Upgrade')}/>
        <div className='label-info'>
        <FormGroup lable={window.__('Product Model')}>
            <label>{pro_model}</label>
        </FormGroup>
        <FormGroup lable={window.__('Firmware Version')}>
            <label>{fw_version}</label>
        </FormGroup>
        <FormGroup lable={window.__('Release Time')}>
            <label>{release_time}</label>
        </FormGroup>
        </div>

        <Upload 
          fileurl={this.state.set_system_upgrade} 
          title={'Firmware Upgrade'}
          max_size = {Number(maxsize)}
          max_size_tip = {maxsize_tip}
          message={window.__("Upgrading...Please Do Not Shut Down The Device,Completed After ")}
        />
       
        <FormRadioCheck>
          <Checkbox defaultChecked={true} 
          onChange={this.handleChange('keep_setting')}
          >{window.__('Keep Settings')}</Checkbox>
        </FormRadioCheck>
        
      </div>
    );
  }
}

export default SysConfiguration;
