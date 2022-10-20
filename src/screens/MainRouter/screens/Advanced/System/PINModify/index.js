import React,{Component} from 'react';
import {FormGroup,FormButton,FormPassword,PageText,Modal,FormRadioCheck,Progress} from '@/screens/components';
import {axios,sms_HYID,smsurl} from '@/share';
import {message,Checkbox,Switch, Spin} from 'antd';
import ReactValidator from '@/share/validator/index.js';

export default class PINModify extends Component {
  state={
    loadingVisble:true,
    visible:false,
    modify:false,
    showpinpage:false,
    sim_clck_lock:true,
    showProgress:false,
    locktime:0,
    step:0
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
        this.handleLoading(false);
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
  handleChange = name => event => {
    this.setState({ [name] : event.target.value });
  };
  
  validPassword=()=>{
    const {old_pin_code,new_pin_code,confirm_pin_code} = this.state;
    if( this.validator.someValid(['old_pin_code','new_pin_code','confirm_pin_code'])){
      if(old_pin_code === new_pin_code){ 
        message.warning(window.__('The New PIN Code Cannot Be The Same As The Original PIN Code.'))
        return false
      }
      if(new_pin_code !== confirm_pin_code){ 
        message.error(window.__('The New PIN Code Is Not The Same As The Confirmed PIN Code.'))
        return false
      }
      this.handleChangePincode()
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }

  }
  /**修改PIN码 */
  handleChangePincode=()=>{
    const {old_pin_code,new_pin_code} = this.state
    const values = {old_pin_code,new_pin_code}
    this.handleLoading(true);
    axios.post({
      data:{
        HYID:sms_HYID.change_module_pin_code,//10
        ...values
      },
      url:smsurl
    }).then((res)=>{
      this.setState({
        old_pin_code:'',
        new_pin_code:'',
        confirm_pin_code:'',
        modify:false,
      })
      this.validator.hideMessages();
      if(res.errcode===2000){
        this.handleLoading(false);
        message.success(window.__('Success'));
        this.getData()
      }else if(res.errcode===4012){
        this.handleLoading(false);
        this.setState({    
          last_times:res.last_times,
          //text:window.__('Please Enter The Correct PIN Code!')
        })              
        message.error(window.__('Please Enter The Correct PIN Code!'));
      }
    })
  }

  goPINCode=()=>{
    window.location.hash="Advanced/System/PINCode";
    window.location.reload();
  }
  render(){    
    const {module_ready,sim_state,last_times,old_pin_code,new_pin_code,confirm_pin_code,
      showpinpage,loadingVisble} = this.state;
    return (
      <div>
        <PageText 
          title={window.__('Modify PIN Code')}/>

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
              <a style={{color:'#007DFF'}} onClick={this.goPINCode}>{window.__('Enter PIN Code ')}</a>
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
              <div>
                <FormPassword lable={window.__('Original PIN Code')}
                  value ={old_pin_code||""}
                  onChange={this.handleChange('old_pin_code')}>
                </FormPassword>
                  <div className="tip-err">
                  {this.validator.message('old_pin_code', old_pin_code, 'required&&PINCode','',{
                    default: window.__('Original PIN Code Field Required!'),    
                    PINCode: window.__('PIN Code Must Be 4 Or 8 Digits')
                  })}</div> 

                <FormPassword lable={window.__('New PIN')}        
                  value ={new_pin_code||""}
                  onChange={this.handleChange('new_pin_code')}>
                </FormPassword>
                  <div className="tip-err">
                  {this.validator.message('new_pin_code', new_pin_code, 'required&&PINCode','',{
                    default: window.__('New PIN Code Field Required!'),    
                    PINCode: window.__('PIN Code Must Be 4 Or 8 Digits')
                    })}
                  </div>   
                
                <FormPassword lable={window.__('Confirm PIN')}        
                  value ={confirm_pin_code||""}
                  onChange={this.handleChange('confirm_pin_code')}>
                </FormPassword>
                <div className='tip'>{window.__('Remaining Attempts:')+last_times}</div>
                  <div className="tip-err">
                  {this.validator.message('confirm_pin_code', confirm_pin_code, 'required&&PINCode','',{
                    default: window.__('Confirm PIN Code Field Required!'),    
                    PINCode: window.__('PIN Code Must Be 4 Or 8 Digits')
                  })}
                </div>
                
                <FormButton onClick={this.validPassword}>{window.__('Apply')}</FormButton>
              </div>
          :null}
          </>
        }
          
          <Modal
            style={{width:450,height:200,marginTop:100}}
            visible={loadingVisble}
            >          
            <div style={{marginTop:60,fontSize:15,textAlign:'center'}}>
              <Spin/><span style={{paddingLeft:10}}>{window.__('Loadding...')}</span> 
            </div>
          </Modal>
      </div>
    );
  }
}


  