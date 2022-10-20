import React,{Component} from 'react';
import {FormGroup,PageText,FormButton,FormPassword,Progress} from '@/screens/components';
import {axios,smsurl,sms_HYID,deepCopy,handleRedir} from '@/share';
import {message,Icon,Select,Checkbox} from 'antd';
import ReactValidator from '@/share/validator/index.js';
import SIM from '../SIM';
const {Option} = Select;

export default class MobileNetwork extends Component {
  
  state={
    loadingVisble:false,
    result:{},
    result_src:{},
    showProgress:false,
    locktime:0,
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount(){
    this.getData();
  }
  
  handleLoading=(enabled)=>{
    //目前用进度条代替
    //this.setState({
    //  loadingVisble:enabled
    //})
  }
  getData = () => {
    axios.post({
      data:{
        HYID:sms_HYID.get_module_apn_config
      },
      url:smsurl
    }).then((res)=>{
      if(res.errcode===2000){
        this.handleLoading(false);
        this.setState({     
          result:deepCopy(res.huayi_r),
          result_src:deepCopy(res.huayi_r),
        })        
      }
    }); 
  } 
  setModuleApnConfig = (values) => {
    this.handleLoading(true);
    axios.post({
      data:{
        HYID:sms_HYID.set_module_apn_config,
        ...values
      },
      url:smsurl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({          
          redir:res.reconnection,
          redir_ip:res.reconnection_addr,
          showProgress:res.progresstime!==0,
          locktime:res.progresstime
        })
        //this.getData();
        //message.success(window.__('Success'))
      }else{
        this.handleLoading(false);
        
      }
    }); 
  } 
  handleRedirect=()=>{
    handleRedir(this.state.redir,this.state.redir_ip)
    //this.getData();
    this.setState({
      showProgress:false,
    })
  }
  
  handleSave=()=>{
    const result_src =  deepCopy(this.state.result_src);
    const result =  deepCopy(this.state.result);
    if(this.validator.allValid()){
        if(Number(result_src.use_apn) === 0 &&
          result.use_apn===result_src.use_apn){
            message.success(window.__('Data Up to Date'));
            return false;
          }
        if(Number(result_src.use_apn) === 1 &&
          result.use_apn===result_src.use_apn&&
          result.auth_type===result_src.auth_type&&
          result.apn_name ===result_src.apn_name&&
          result.apn_usr ===result_src.apn_usr&&
          result.apn_pwd ===result_src.apn_pwd){
            message.success(window.__('Data Up to Date'));
            return false;
          }
        this.setModuleApnConfig(result)
      
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  
  
  handleChange = (name) => event => {
    let value = event.target.value;
    let result = deepCopy(this.state.result);
    result[name] = value;
    this.setState({ result });
    
  };
  
  
  handleSelect= (name) => value =>{     
    let result = deepCopy(this.state.result);
    result[name] = value;
    this.setState({ result });
  }
  
  render(){        
    const {result:{module_ready,sim_state,use_apn,
      auth_type,apn_name,apn_usr,apn_pwd,wan_mode}}=this.state;
      
    
    return (
      <div>
      <PageText 
        title={window.__('Internet Connection')}
        msg={window.__("The Access Point Name (APN) is the name for the settings your device reads to set up a connection to the gateway between your carrier's cellular network and the public Internet. Most of the time, your device already has these settings in the system files, and can fill in the APN information automatically when it connects. If the APN can't connect to the Internet automatically, you can change the APN manually.")}/>
        
        {module_ready===true&&sim_state===1?
        <div>
          
        <FormGroup lable={window.__('Dialing 4G')}>
          <Select value={use_apn|| 0} 
            disabled={wan_mode==='wired'}
            onChange={this.handleSelect('use_apn')}>
            <Option value={0}>{window.__('AUTO')}</Option>
            <Option value={1}>{window.__('Manual')}</Option>
          </Select>
        </FormGroup>
        
        {use_apn?<div>
            
          <FormGroup lable={window.__('APN Name')}>
              <input value={apn_name||''}               
                disabled={wan_mode==='wired'}
                onChange={this.handleChange('apn_name')}/>
              <div className="tip-err">
              {this.validator.message('apn_name', apn_name, 'required&&apnname&&max:64','',{
                  default: window.__('APN Name Field Required!'),
                  apnname: window.__('Can\'t Contain The Following: \" & \' < > ` \\'),
                  max: window.__('APN Name At Most 64 Characters!'),})}</div>  
          </FormGroup>
            
          <FormGroup lable={window.__('User Name')}>
            <input value={apn_usr||''}
            disabled={wan_mode==='wired'}
            onChange={this.handleChange('apn_usr')}/>
            <div className="tip-err">
            {this.validator.message('apn_usr',apn_usr, 'apnusername&&max:32','',{
                default: window.__('Limited To English Letters And Characters, Numbers,But Not Contain The Following: \" & \' < > ` \\'),
                max: window.__('User Name At Most 32 Characters!'),})}</div>  
          </FormGroup>
          <FormPassword lable={window.__('Password')}  
            disabled={wan_mode==='wired'}      
            value ={apn_pwd||""} 
            onChange={this.handleChange('apn_pwd')}>
          </FormPassword>                
          <div className="tip-err">
          {this.validator.message('apn_pwd', apn_pwd, 'apnusername&&max:32','',{
              default: window.__('Limited To English Letters And Characters, Numbers,But Not Contain The Following: \" & \' < > ` \\'),
              max: window.__('Password At Most 32 Characters!'),})}</div>  
          
          <FormGroup lable={window.__('Authentication')}>
            <Select value={auth_type||'0'}
            disabled={wan_mode==='wired'}
            onChange={this.handleSelect('auth_type')}>
              <Option value="0">NONE</Option>
              <Option value="1">PAP</Option>
              <Option value="2">CHAP</Option>
            </Select>
          </FormGroup>
          </div>:null}

          <FormButton           
            disabled={wan_mode==='wired'}
            onClick={this.handleSave}>{window.__('Apply')}</FormButton>
          
        </div>:null
        }
        
        <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Configuring...Please Do Not Shut Down The Device,Completed After '/>
        
      <SIM module_ready={module_ready} sim_state={sim_state} loadingVisble={this.state.loadingVisble}>
      </SIM>  
        
       </div>
    );
  }
}


  