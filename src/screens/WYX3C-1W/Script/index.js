import React, { Component } from 'react';
import { PageText,Upload,ClickButton } from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import { message } from 'antd';

class Script extends Component {
  state={
    upgrade_info:{},
    set_system_upgrade:`${HYID.custom_script_upload}`,
  }
  setData = () => {
    axios.post({
      data:{},
      url:HYID.custom_script_execute
    }).then((res)=>{
      if(res.errcode===2000){
        message.success(window.__('Success'))
      }
    })
  };
  render() {
    return (
      <div>
      <PageText 
        title={window.__('Custom Script')}/>

        <Upload 
          fileurl={this.state.set_system_upgrade} 
          title={'Custom Script'}
          max_size = {0}
          max_size_tip = ''
          UploadText = {'Upload'}
          message={window.__('Configuring...Please Do Not Shut Down The Device,Completed After ')}
        />
        <ClickButton onClick={this.setData}>{window.__('Execute The Script')}</ClickButton>
        
      </div>
    );
  }
}

export default Script;
