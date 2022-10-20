import React,{Component} from 'react';
import {ClickButton,PageText,Progress} from '@/screens/components';
import {axios,HYID ,posturl,handleRedir} from '@/share';
import {Modal} from 'antd';

export default class Restart extends Component {
  state={
    showProgress:false,
    locktime:0,
  }
  setData = () => {
    axios.post({
      data:{
        HYID:HYID.reset
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({         
          redir:res.reconnection,
          redir_ip:res.reconnection_addr||'', 
          showProgress:res.progresstime!==0,
          locktime:res.progresstime,
        })
      }
    })
  };
  confirm=() =>{
    if(this.state.showProgress){
      return
    }
    const this_=this
    Modal.confirm({
      title: window.__('Confirm To Reset?'),
      okText: window.__('OK'),
      cancelText: window.__('Cancel'),
      onOk() {
        this_.setData()
      },
    });
  }
  handleRedirect=()=>{
    handleRedir(this.state.redir,this.state.redir_ip)
    this.setState({
      showProgress:false,
    })
  }
  render(){    
    return (
      <div>
        <PageText 
          title={window.__('Reset')}
          msg={window.__('All Configurations Will Be Restored To Factory Settings. Please Proceed With Caution.')}/>
        <ClickButton onClick={this.confirm}>{window.__('Reset')}</ClickButton>
      
        <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Resetting...Please Do Not Shut Down The Device,Completed After '/>

      </div>
    );
  }
}


  