import React,{Component} from 'react';
import {Progress, Modal, FormGroup, FormRadioCheck} from '@/screens/components';
import {axios,HYID ,posturl,handleRedir} from '@/share';
import {Icon, Radio} from 'antd';
import './common.less'

export default class Mode extends Component {
  state={
    visible: false,
    confirmVisible: false,
    mode: 0,
    init_mode: 0,
    showProgress:false,
  }
  //获取数据
  getData=()=>{
    axios.post({
      data:{
        HYID:HYID.get_mode_status
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({
          mode: res.huayi_r.mode,
          init_mode: res.huayi_r.mode,
        })
      }
    })
  }
  //打开modal框
  handleChange=()=>{
    this.getData()
    this.setState({ visible: true })
  }
  //关闭modal框
  handleCloseModal=()=>{
    this.setState({ visible:false })
    this.forceUpdate()
  }
  //radio选择
  handleSelect = (event) => {
    this.setState({ mode: event.target.value })
  }
  //点击确认
  handleConfirm=() =>{
    const { mode, init_mode }= this.state
    if(mode!==init_mode){
      this.setMode()
    }else{
      this.handleCloseModal()
    }
  }
  //发送mode
  setMode=()=>{
    axios.post({
      data:{
        HYID:HYID.set_mode_status,
        mode: this.state.mode
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.handleRestart()
      }
    })
  }
  //重启
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
  //重启进度条
  handleRedirect=()=>{
    handleRedir(this.state.redir,this.state.redir_ip)
    this.setState({
      showProgress:false,
    },()=>{this.getData()})
  }
  render(){
    const { visible, mode } = this.state   
    return (
      <>
        <div className="common-icon-pc">
          <Icon type="swap" title={window.__('Change Mode')} onClick={this.handleChange}/>
        </div>
        <div  onClick={this.handleChange} className="common-icon-mobile">
          <Icon type="swap" title={window.__('Change Mode')} onClick={this.handleChange}/>
          <span className="logout-mobile" style={{marginLeft:'5px'}}>{window.__('Change Mode')}</span>
        </div>
        <Modal
          title={window.__('Change Mode')}
          //style={{width:650,}}
          visible={visible}
          closeModel={this.handleCloseModal}
          close={false}
          >          
          <FormGroup>
            <Radio.Group onChange={this.handleSelect} value={mode}>
              <Radio value={0}>{window.__('Router Mode')}</Radio>
              <Radio value={1}>{window.__('AP Mode')}</Radio>
            </Radio.Group>
          </FormGroup>
          <button className='modal-confirm-btn'
            onClick={this.handleCloseModal}>{window.__('Cancel')}</button>
          <button className='modal-confirm-btn'
            onClick={this.handleConfirm}>{window.__('OK')}</button>
        </Modal>
        <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Rebooting...Please Do Not Shut Down The Device,Completed After '/>
      </>
    );
  }
}


  