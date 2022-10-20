import React,{Component} from 'react';
import {Progress} from '@/screens/components';
import {axios,HYID ,posturl,handleRedir} from '@/share';
import {Modal,Icon} from 'antd';
import './common.less'
import {connect} from 'react-redux'
import {actionCreater } from '@/proconfig/store'
/**这个页面内容与重启的一样， 只是把按钮改成了Icon */
class Reboot extends Component {
  state={
    showProgress:false,
    locktime:0,
  }
  handleRestart = () => {
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
        this_.handleRestart()
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
      <>
        <div className="common-icon-pc">
          <Icon title={window.__('Reboot')} type="redo" onClick={this.confirm}/>
        </div>
        <div onClick={this.confirm} className="common-icon-mobile">
          <Icon title={window.__('Reboot')} type="redo" />
          <span className="logout-mobile" style={{marginLeft:'5px'}}>{window.__('Reboot')}</span>
        </div>
        <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Rebooting...Please Do Not Shut Down The Device,Completed After '/>

      </>
    );
  }
}

const mapState = (state)=>({
  canFresh:state.getIn(['common','canFresh']),
  language:state.getIn(['common','language']),
})

const mapDispatch = (dispatch) =>({
  setFresh(args){
      dispatch(actionCreater.setFresh(args))
  },
})

export default connect(mapState,mapDispatch)(Reboot)


  