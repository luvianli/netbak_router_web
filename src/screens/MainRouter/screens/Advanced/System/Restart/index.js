import React,{Component} from 'react';
import {FormButton,ClickButton,PageText,Progress} from '@/screens/components';
import {axios,HYID ,posturl,handleRedir} from '@/share';
import {Modal} from 'antd';
import {connect} from 'react-redux'
import {actionCreater } from '@/proconfig/store'

class Restart extends Component {
  state={
    showProgress:false,
    locktime:0,
  }
  setData = () => {
    axios.post({
      data:{
        HYID:HYID.restart
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
      title: window.__('Confirm To Reboot?'),
      okText: window.__('OK'),
      cancelText: window.__('Cancel'),
      autoFocusButton:"cancel",
      onOk() {
        this_.setData()
        this_.props.setFresh(false);
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
          title={window.__('Reboot')}
          msg={window.__('Click The Button Below Will Reboot The Device.')}/>
        <ClickButton onClick={this.confirm}>{window.__('Reboot')}</ClickButton>
      
        <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Rebooting...Please Do Not Shut Down The Device,Completed After '/>

      </div>
    );
  }
}

const mapState = (state)=>({
  canFresh:state.getIn(['common','canFresh']),
})

const mapDispatch = (dispatch) =>({
  setFresh(args){
      dispatch(actionCreater.setFresh(args))
  },
})

export default connect(mapState,mapDispatch)(Restart)



  