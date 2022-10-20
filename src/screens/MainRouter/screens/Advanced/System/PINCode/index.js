import React,{Component} from 'react';
import {FormGroup,FormButton,FormPassword,PageText,Modal,FormRadioCheck,Progress} from '@/screens/components';
import {axios,sms_HYID,smsurl} from '@/share';
import {message,Checkbox,Switch, Spin} from 'antd';
import ReactValidator from '@/share/validator/index.js';

export default class WIFIBase extends Component {
  state={
    loadingVisble:true,
    successVisble:false,
    visible:false,
    modify:false,
    showpinpage:false,
    sim_clck_lock:true,
    showProgress:false,
    locktime:0,
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount(){
    this.getData();
  }
  
  getData = () => {
    axios.post({
      data:{
        HYID:sms_HYID.get_module_pin_state//6
      },
      url:smsurl
    }).then((res)=>{
      if(res.errcode===2000){
        if(res.huayi_r.sim_state==1){
          this.getSimClck()
        }else{
          this.handleLoading(false);
        }
        this.setState({    
          sim_state:res.huayi_r.sim_state,
          last_times:res.huayi_r.last_times,
          module_ready:res.huayi_r.module_ready,
        })        
      }
    }); 
  } 
  handleLoading=(enabled)=>{
    this.setState({
      loadingVisble:enabled
    })
  }
  getSimClck = () => {
    axios.post({
      data:{
        HYID:sms_HYID.get_sim_clck//8
      },
      url:smsurl
    }).then((res)=>{
      if(res.errcode===2000){
        this.handleLoading(false);
        this.setState({    
          sim_clck:res.huayi_r.sim_clck,
          last_times:res.huayi_r.last_times,
        })        
      }
    }); 
  } 
  handleChange = name => event => {
    this.setState({ [name] : event.target.value });
  };
  handleModal=()=>{
    this.setState({
      visible:!this.state.visible,
      pin_code:'',
    })
    this.validator.hideMessages();
  }
  handleModify=()=>{
    this.setState({
      modify:!this.state.modify
    })
    if(this.state.modify===false){
      this.setState({
        old_pin_code:"",
        new_pin_code:"",
        confirm_pin_code:"",
      })
      this.validator.hideMessages();
    }
  }
  /**点击PIN码开关，需要输入PIN码 */
  handleSetPinClck=()=>{
    let {sim_clck,pin_code} = this.state;
    sim_clck = !sim_clck; 
    if(this.validator.someValid(['pin_code'])){ 
    this.handleLoading(true);   
      axios.post({
        data:{
          HYID:sms_HYID.set_pin_clck,//9
          sim_clck,pin_code
        },
        url:smsurl
      }).then((res)=>{
        if(res.errcode===2000){
          // this.getData();
          // this.setState({    
          //   visible:false,
          //   modify:false,
          // })        
          // message.success(window.__('Success'));
          this.handleLoading(false);
          this.setState({
            showProgress:res.progresstime!==0,
            locktime:res.progresstime
          })
        }else if(res.errcode===4012){
          this.handleLoading(false);
          this.setState({    
            last_times:res.last_times,
            visible:false,
            modify:false,
            successVisble:true,
            //text:window.__('Please Enter The Correct PIN Code!')
          })              
          message.error(window.__('Please Enter The Correct PIN Code!'));
          setTimeout(() => {
            this.setState({
              successVisble:false,
            })
            return;
          }, 2000);
        }else{          
          this.handleLoading(false);
        }
      }); 
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  /**输入PIN码解锁 */
  handleSimLockSetPin=()=>{
    const {sim_clck_lock,pin_code_lock} = this.state;
    if( this.validator.someValid(['pin_code_lock'])){   
      this.handleLoading(true);     
      axios.post({
        data:{
          HYID:sms_HYID.sim_lock_set_pin,//7
          sim_clck:!sim_clck_lock,//为true的时候关闭，实际是0
          pin_code:pin_code_lock
        },
        url:smsurl
      }).then((res)=>{
        if(res.errcode===2000){          
          // this.setState({
          //   successVisble:true,
          //   //text:window.__('Success')
          // })
          // message.success(window.__('Success'));
          // setTimeout(() => {
          //   this.setState({
          //     successVisble:false,
          //   })
          //   window.location.hash="Home";
          //   return;
          // }, 2000);
          this.handleLoading(false); 
          this.setState({
            showProgress:res.progresstime!==0,
            locktime:res.progresstime
          })
        }else if(res.errcode===4012){
          this.handleLoading(false);
          this.setState({    
            last_times:res.last_times,
            successVisble:true,
            //text:window.__('Please Enter The Correct PIN Code!')
          })              
          message.error(window.__('Please Enter The Correct PIN Code!'));
          setTimeout(() => {
            this.setState({
              successVisble:false,
            })
            return;
          }, 2000);
        }
      })
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }

  }
  handleChange = name => event => {
    this.setState({ [name]:event.target.value });
  };
  
  handleCheck = name => event => {
    this.setState({ [name]:event.target.checked });
  };
  
  handleShowpinpage=()=>{
    this.setState({
      showpinpage:true
    })
  }

  handleRedirect=()=>{
    this.setState({
      showProgress:false,
    })
    message.success(window.__('Success'));
    setTimeout(() => {
      window.location.hash="Home";
      return;
    }, 2000);
  }
  render(){    
    const {module_ready,sim_state,last_times,sim_clck,pin_code,showpinpage,sim_clck_lock,loadingVisble,pin_code_lock} = this.state;
    return (
      <div>
        <PageText 
          title={window.__('SIM Card Lock')}/>

        {
          module_ready===false?          
          <div style={{width:380,margin:'155px auto auto',textAlign:'center'}}>
            <span>{window.__('Module Initialization, Please Try Again Later.')}
            </span>
          </div>:
          <>
          {
            sim_state===0?//未插SIM卡
            <div style={{width:380,margin:'155px auto auto',textAlign:'center'}}>
              <span>{window.__('Temporarily Unavailable. Please Insert SIM Card And Try Again Later.')}
              </span>
            </div> :
            sim_state===2&&showpinpage===false?//PIN被锁住   
            <div style={{width:380,margin:'155px auto auto',textAlign:'center',cursor:'pointer'}}>
              <span>
              {window.__('Temporarily Unavailable. Please ')}
              <a style={{color:'#007DFF'}} onClick={this.handleShowpinpage}>{window.__('Enter PIN Code ')}</a>
              {window.__('To Unlock.')}
              </span>
            </div>    
            :
            sim_state===3?//提示PUK锁住
            <div style={{width:380,margin:'155px auto auto',textAlign:'center'}}>
              <span>{window.__('The PUK Has Been Locked, Please Go To The Business Hall To Unlock.')} 
              </span>
            </div>              
            :sim_state===1?///**SIM卡可正常使用 */
            <>          
                  
              <FormGroup lable={window.__('Lock Enable')}>
                  <Switch checkedChildren={window.__('ON')}  unCheckedChildren={window.__('OFF')}
                    onClick={this.handleModal} checked={sim_clck}/>
              </FormGroup>
              <Modal
                title={window.__('Please enter PIN Code!')}
                style={{width:650,}}
                visible={this.state.visible}
                closeModel={this.handleModal}
                close={true}
                >          
                <FormPassword lable={window.__("SIM's PIN")}        
                  value ={pin_code||""}
                  onChange={this.handleChange('pin_code')}>
                </FormPassword>
                <div className='tip'>{window.__('Remaining Attempts:')+last_times}</div>
                <div className="tip-err">
                {this.validator.message('pin_code', pin_code, 'required&&PINCode','',{
                     default: window.__('PIN Code Field Required!'),
                     PINCode: window.__('PIN Code Must Be 4 Or 8 Digits')
                   })}
                 </div> 
                <button className='modal-confirm-btn'
                  onClick={this.handleModal}>{window.__('Cancel')}</button>
                <button className='modal-confirm-btn'
                  onClick={this.handleSetPinClck}>{window.__('OK')}</button> 
              </Modal>  
            </>
          :null}
          </>
        }
        {
          showpinpage===true?<div>
            
            <FormPassword lable={window.__("SIM's PIN")}        
              value ={pin_code_lock||""}
              onChange={this.handleChange('pin_code_lock')}>
            </FormPassword>
            <div className='tip'>{window.__('Remaining Attempts:')+last_times}</div>
              <div className="tip-err">
              {this.validator.message('pin_code_lock', pin_code_lock, 'required&&PINCode','',{
                default: window.__('PIN Code Field Required!'),
                PINCode: window.__('PIN Code Must Be 4 Or 8 Digits')
              })}
            </div> 
            <FormRadioCheck lable={window.__('Disable PIN verification')}>
                <Checkbox checked={sim_clck_lock} onClick={this.handleCheck('sim_clck_lock')}/>
            </FormRadioCheck>

            <FormButton onClick={this.handleSimLockSetPin}>{window.__('Apply')}</FormButton>
          </div>:null
        }

          {/*<Modal
            style={{width:450,height:200,marginTop:100}}
            visible={this.state.successVisble}
            >          
            <div style={{marginTop:60,fontSize:15,textAlign:'center'}}>
              <span>{this.state.text||window.__('Success')}</span> 
            </div>
          </Modal>*/}
          
          <Modal
            style={{width:450,height:200,marginTop:100}}
            visible={loadingVisble}
            >          
            <div style={{marginTop:60,fontSize:15,textAlign:'center'}}>
              <Spin/><span style={{paddingLeft:10}}>{window.__('Loadding...')}</span> 
            </div>
          </Modal>
          <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect}
            message='Configuring...Please Do Not Shut Down The Device,Completed After '/>
      </div>
    );
  }
}


  