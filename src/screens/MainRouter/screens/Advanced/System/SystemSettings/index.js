import React,{Component} from 'react';
import {PageText,Upload} from '@/screens/components';
import {HYID } from '@/share';
import './index.less';

export default class System extends Component {

  render(){    
    return (
      <div>

      {/*<PageText 
        title={window.__('System Settings')}/>*/}
      
        <PageText
          title={window.__('Backup Configuration File')}/>

        {/* <FormButton>
          <div className="sys-cfg"><a href={HYID.bakconfig} download={'Configfile'}>
            {window.__('Backup Configuration File')}
          </a></div>
        </FormButton>  */}
        <div className="down-btn">
          <a href={HYID.bakconfig} download={'Configfile'}>
            {window.__('Backup Configuration File')}
          </a>
        </div>
      
        <div style={{height:60}}></div>
        <PageText 
          title={window.__('Restore Configuration File')}/>
        {/*  <a href={HYID.resetconfig} download={'Configfile'}>
          <FormButton>{window.__('Restore Configuration Files')}</FormButton>
        </a>*/}          

        <div style={{height:30}}></div>
        
        <span style={{marginBottom:-30,display:'block'}}>{window.__('Restore Configuration File')}</span>
        <div  className="sys-upload">
          <Upload 
            fileurl={HYID.resetconfig}
            max_size = {2*1024*1024}
            max_size_tip = {"2M"}
            UploadText={'Upload'}
            message={window.__("Restoring...Please Do Not Shut Down The Device,Completed After ")}
            />
        </div>
       
      </div>
    );
  }
}


  