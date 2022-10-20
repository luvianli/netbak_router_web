import React,{Component} from 'react';
import {FormGroup,PageText} from '@/screens/components';
import {axios,HYID ,posturl} from '@/share';
import {message,Button,Switch} from 'antd';
import './index.less'

export default class WIFIBase extends Component {
  state={
    syslog_admin:false,
    log_content:''
  }
  
  componentDidMount(){
    this.getData();
    this.displaySyslog();
  }
  
  getData=()=>{    
    axios.post({
      data:{
        HYID:HYID.get_syslog_config,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({
          syslog_admin:res.huayi_r.syslog_admin
        })
      }
    })
  }

  setData=(checked=null)=>{    
    let syslog_admin  = this.state;
    if(checked!==null){
      syslog_admin = checked;
    }
    axios.post({
      data:{
        HYID:HYID.set_syslog_config,
        syslog_admin,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        message.success(window.__('Success'));
      }
    })
  }

  cleanSyslog=()=>{    
    axios.post({
      data:{
        HYID:HYID.clean_syslog,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        message.success(window.__('Success'));
        this.setState({
          log_content:''
        })
      }
    })
  }

  displaySyslog=(refresh=null)=>{    
    axios.post({
      data:{
        HYID:HYID.display_syslog,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){     
        this.setState({
          log_content:res.huayi_r.log_content
        })
        if(refresh==='refresh'){
          message.success(window.__('Success'));
        }
      }
    })
  }

  handleSwitch= name => checked =>{
    this.setState({ [name]:checked });
    if(name ==='syslog_admin'){   
      this.setData(checked)
      if(checked===true){        
        this.displaySyslog();
      }
    }
  }
  
  
  render(){    
    const {syslog_admin,log_content}=this.state;
    return (
      <div className="log-container">
        <PageText 
          title={window.__('System Log')}/>

        <FormGroup lable={window.__('System Log Enable')}>
            <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={syslog_admin||false} onChange={this.handleSwitch('syslog_admin')}/>
        </FormGroup>

        {syslog_admin===true?<>
          <div className="no-lable">
          <FormGroup lable={''}>
            <a href={HYID.downlog} download="SystemLog">
              <Button type="primary" >{window.__('Save Log')}</Button>
            </a>
            <Button style={{margin:"0 10px 0 10px"}} type="primary" onClick={this.cleanSyslog}>{window.__('Clear')}</Button>
            <Button onClick={()=>this.displaySyslog('refresh')}>{window.__('Refresh')}</Button>
            <div style={{height:30}}></div>
          </FormGroup>
          </div>

          <textarea 
            readOnly
            value = {log_content}
            className="log-textarea"/>
        </>:null}
      </div>
    );
  }
}


  