import React,{Component} from 'react';
import {FormGroup,FormButton,PageText,Progress,FormPassword,FormRadioCheck} from '@/screens/components';
import {axios,HYID ,posturl,smsurl,sms_HYID,deepCopy,handleRedir} from '@/share';
import {message,Icon,Select,Checkbox,Radio} from 'antd';
import ReactValidator from '@/share/validator/index.js';
const { Option } = Select;

export default class LAN extends Component {
  state={
    result:{dns_arr:[]},
    result_src:{},
    showProgress:false,
    locktime:0,
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount(){
    this.getData();
    this.getCurrentUserInfo();
  }
  
  getData = () => {
    axios.post({
      data:{
        HYID:sms_HYID.get_wan_config
      },
      url:smsurl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
          result:deepCopy(res.huayi_r),
          result_src:deepCopy(res.huayi_r)
        })
      }
    })
  };  
  setEthWanConfig=(values)=>{    
    axios.post({
      data:{
        HYID:sms_HYID.set_eth_wan_config,
        ...values,
      },
      url:smsurl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({          
          //result_src:deepCopy(this.state.result),
          redir:res.reconnection,
          redir_ip:res.reconnection_addr,
          showProgress:res.progresstime!==0,
          locktime:res.progresstime
        })
      }
    })
  }
  
  handleChange = name => event => {
    let result = deepCopy(this.state.result);
    let value = event.target.value;
    result[name] = value;
    if(name==='dns0'){
      result.dns_arr[0]=value;
    }
    if(name==='dns1'){
      result.dns_arr[1]=value;
    }
    if(name==='wan_mode'){
      if(value==='mobile'){
        result.proto='dhcp';
      }
      else if(value==='wired'){
        result.proto=this.state.result_src.proto;
      }
    }
    if(name==='mac_addr'){      
      result.mac_addr=value.toUpperCase();
    }
    this.setState({ result });
  };
  
  changeHostIP=(event)=>{
    if(event.target.checked===true){
      let {result} = this.state;
      result.dest_ip=this.state.user_ip;
      this.setState({
        result:result
      })
    }
    else{
      let {result,result_src} = this.state;
      result.dest_ip = result_src.dest_ip;      
      this.setState({
        result:result
      })
    }
  }
  //获取克隆本机MAC地址
  getCurrentUserInfo = () => {
    axios.post({
      data:{
        HYID:HYID.get_current_user_info
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){        
        this.setState({
          usr_mac:res.huayi_r.usr_mac
        })
      }
    })
  };  
  changeCloneMac=(event)=>{
    if(event.target.checked===true){ 
      let {result} = this.state;
      result.mac_addr=this.state.usr_mac.toUpperCase();
      this.setState({
        result:result
      })
    }
    else{
      let {result} = this.state;
      result.mac_addr = result.def_mac_addr;      
      this.setState({
        result:result
      })
    }
  }
  handleSelect= name => value =>{    
    let result = deepCopy(this.state.result);
    result[name] = value;
    this.setState({ result });
    this.validator.hideMessages();
  }
  handleRedirect=()=>{
    handleRedir(this.state.redir,this.state.redir_ip)
    this.getData();
    this.setState({
      showProgress:false,
    })
  }
  
  handleSave=()=>{
    let result = deepCopy(this.state.result);
    let result_src = deepCopy(this.state.result_src);
    let values = {}
    if(result.wan_mode==="mobile"){
      if(result.use_apn===1){
        if(this.validator.someValid(['apn_name','apn_usr','apn_pwd'])){  
          if(result.wan_mode===result_src.wan_mode&&
            result.use_apn===result_src.use_apn&&
            result.auth_type===result_src.auth_type&&
            result.apn_name ===result_src.apn_name&&
            result.apn_usr ===result_src.apn_usr&&
            result.apn_pwd ===result_src.apn_pwd){
              message.success(window.__('Data Up to Date'));
              return false;
          }
          values = {
            wan_mode:"mobile",
            use_apn: 1,
            apn_name:result.apn_name,
            apn_usr:result.apn_usr,
            apn_pwd:result.apn_pwd,
            auth_type: result.auth_type,
            proto: "dhcp"
          }
          this.setEthWanConfig(values)
        }else{
          this.validator.showMessages();
          this.forceUpdate();
        }
      }else{
        if(this.validator.someValid(['hostname','cc_mtu','mac_addr'])){
          if(result_src.wan_mode === result.wan_mode&&
            result.use_apn===result_src.use_apn&&
            result_src.proto === result.proto&&
            result_src.hostname === result.hostname&&
            result_src.mac_addr === result.mac_addr&&
            result_src.cc_mtu === result.cc_mtu ){
            message.success(window.__('Data Up to Date'))     
            return;
          }
          values = {
            wan_mode:"mobile",
            use_apn: 0,
            proto : 'dhcp',
            cc_mtu:result.cc_mtu,
            hostname :result.hostname,
            mac_addr:result.mac_addr.toUpperCase(),
          }
          this.setEthWanConfig(values)
        }else{
          this.validator.showMessages();
          this.forceUpdate();
        }
      }
    }else if(result.proto === 'dhcp'){
        if( this.validator.someValid(['hostname','mac_addr','cc_mtu']) ){
            if(result_src.wan_mode === result.wan_mode&&
                result_src.proto === result.proto&&
                result_src.hostname === result.hostname&&
                result_src.mac_addr === result.mac_addr&&
                result_src.cc_mtu === result.cc_mtu ){
                message.success(window.__('Data Up to Date'))     
                return;
            }
            values = {
                wan_mode:result.wan_mode,
                proto : 'dhcp',
                cc_mtu:result.cc_mtu,
                hostname :result.hostname,
                mac_addr:result.mac_addr.toUpperCase(),
            }
            this.setEthWanConfig(values)            
        } else {
            this.validator.showMessages();
            this.forceUpdate();
          }
    }else if(result.proto === 'static'){
        if( this.validator.someValid(['ip_addr','subnet_mask','gateway','dns0','dns1','mac_addr','cc_mtu']) ){
          if(result.dns_arr[0]===result.dns_arr[1]){
            
            message.error(window.__('DNS1 Can Not Same As DNS2!'))     
            return;
          } 
          if(result_src.wan_mode === result.wan_mode&&
                result_src.proto === result.proto&&
                result_src.ip_addr === result.ip_addr&&
                result_src.subnet_mask === result.subnet_mask&&
                result_src.gateway === result.gateway&&
                String(result_src.dns_arr) === String(result.dns_arr)&&
                result_src.mac_addr === result.mac_addr&&
                result_src.cc_mtu === result.cc_mtu ){
                  message.success(window.__('Data Up to Date'))     
                    return;
            }
            values = {
                wan_mode:result.wan_mode,
                proto : 'static',
                ip_addr :result.ip_addr,
                subnet_mask :result.subnet_mask,
                gateway :result.gateway,
                dns_arr :result.dns_arr,
                mac_addr:result.mac_addr,
                cc_mtu:result.cc_mtu,
            }
            this.setEthWanConfig(values)
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }else if(result.proto === 'pppoe'){
        if( this.validator.someValid(['usr','pwd','ac','service','ppp_mtu','mac_addr']) ){
            if(result_src.wan_mode === result.wan_mode&&
                result_src.proto === result.proto&&
                result_src.usr === result.usr&&
                result_src.pwd === result.pwd&&
                result_src.service === result.service&&
                result_src.ppp_mtu === result.ppp_mtu&&
                result_src.ac === result.ac&&
                result_src.mac_addr === result.mac_addr ){
                message.success(window.__('Data Up to Date'))     
                return;
            }
            values = {
                wan_mode:result.wan_mode,
                proto : 'pppoe',
                ppp_mtu:result.ppp_mtu,
                ac :result.ac,
                service :result.service,
                mac_addr:result.mac_addr,
                usr :result.usr,
                pwd :result.pwd,
            }
            this.setEthWanConfig(values)
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }
  }

  render(){
    const {result:{link,wan_mode,proto,ip_addr,subnet_mask,gateway,dns_arr,usr,pwd,ac,
      service,hostname,mac_addr,def_mac_addr,ppp_mtu,cc_mtu,use_apn,apn_name,apn_usr,apn_pwd,auth_type}} = this.state;
    return (
      <div>
        <div style={{height:20}}></div>
        <PageText 
          title={window.__('WAN Setting')}
          msg={window.__('You can configure the parameters of multiple Internet Access Modes.')}
          showHelp={true}
          helpmsg={window.__("The Access Point Name (APN) is the name for the settings your device reads to set up a connection to the gateway between your carrier's cellular network and the public Internet. Most of the time, your device already has these settings in the system files, and can fill in the APN information automatically when it connects. If the APN can't connect to the Internet automatically, you can change the APN manually.")}
					/>
          
          <FormGroup lable={window.__('Internet Type')}>
          <Radio.Group onChange={this.handleChange('wan_mode')} value={wan_mode}>
            <Radio value={'wired'}>{window.__('Wired')}</Radio>
            <Radio value={'mobile'}>{window.__('Mobile')}</Radio>
          </Radio.Group>
          </FormGroup>
          <div style={{height:20}}></div>
          {wan_mode==="mobile"&&
            <FormGroup lable={window.__('Dialing 4G')}>
              <Select value={use_apn|| 0} 
                // disabled={wan_mode==='wired'}
                onChange={this.handleSelect('use_apn')}>
                <Option value={0}>{window.__('AUTO')}</Option>
                <Option value={1}>{window.__('Manual')}</Option>
              </Select>
            </FormGroup>
          }
          {wan_mode==="mobile"&&use_apn===1?<>
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
          </>:<>
            <FormGroup lable={window.__('Internet Access Mode')}>
              <Select disabled={wan_mode==='mobile'} value={proto ||''} onChange={this.handleSelect('proto')}>
                <Option value={'static'}>{window.__('STATIC')}</Option>
                <Option value={'dhcp'}>{window.__('DHCP')}</Option>
                <Option value={'pppoe'}>{window.__('PPPOE')}</Option>
              </Select>
            </FormGroup>
            {
              proto==='dhcp'?<>            
                <FormGroup lable={window.__('Host Name')}>
                    <input value={hostname||''} onChange={this.handleChange('hostname')}/>
                </FormGroup>                  
              <div className="tip-err">
              {this.validator.message('hostname', hostname, 'houtais&&ascii&&max:32','',{            
                  default: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                  max: window.__('Host Name At Most 32 Characters!'),
                  ascii:window.__('Only Supports ASCII Code!'),
              })}</div>   

                <FormGroup lable={window.__('MTU')}>
                    <input value={cc_mtu||''} onChange={this.handleChange('cc_mtu')}/>
                    <div className="tip-err">
                    {this.validator.message('cc_mtu', cc_mtu, 'required&&range:576-1500','',{
                        default:window.__('MTU Field Required!'),
                        range: window.__('MTU Range Is 576-1500!')})}</div>  
                </FormGroup>
              </>:
              proto==='static'?<>                  
                <FormGroup lable={window.__('IP Address')}>
                    <input value={ip_addr||''} onChange={this.handleChange('ip_addr')}/>
                    <div className="tip-err">
                    {this.validator.message('ip_addr', ip_addr, 'required&&ip','',{
                        default: window.__('IP Address Field Required!'),
                        ip: window.__('IP Address Format Invalid!'),})}</div>  
                </FormGroup>

                <FormGroup lable={window.__('Subnet Mask')}>
                    <input value={subnet_mask||''} onChange={this.handleChange('subnet_mask')}/>
                    <div className="tip-err">
                    {this.validator.message('subnet_mask', subnet_mask, 'required&&netmask','',{
                        default: window.__('Subnet Mask Field Required!'),
                        netmask: window.__('Subnet Mask Format Invalid!'),})}</div>  
                </FormGroup>

                <FormGroup lable={window.__('Default Gateway')}>
                    <input value={gateway||''} onChange={this.handleChange('gateway')}/>
                    <div className="tip-err">
                    {this.validator.message('gateway', gateway, 'required&&ip','',{
                      default: window.__('Default Gateway Field Required!'), 
                      ip: window.__('Default Gateway Format Invalid!')})}</div>  
                </FormGroup>

                <FormGroup lable={window.__('DNS1')}>
                    <input value={dns_arr[0]||''} onChange={this.handleChange('dns0')}/>
                    <div className="tip-err">
                    {this.validator.message('dns0', dns_arr[0], 'required&&ip','',{
                    default: window.__('DNS1 Field Required!'),
                    ip: window.__('DNS1 Format Invalid!'),
                  })}</div>  
                </FormGroup>

                <FormGroup lable={window.__('DNS2')}>
                    <input value={dns_arr[1]||''} onChange={this.handleChange('dns1')}/>
                    <div className="tip-err">
                    {this.validator.message('dns1', dns_arr[1]||'', 'ip','',{
                        default: window.__('DNS2 Field Required!'),
                        ip: window.__('DNS2 Format Invalid!'),})}</div>  
                </FormGroup>

                <FormGroup lable={window.__('MTU')}>
                    <input value={cc_mtu||''} onChange={this.handleChange('cc_mtu')}/>
                    <div className="tip-err">
                    {this.validator.message('cc_mtu', cc_mtu, 'required&&range:576-1500','',{
                      default: window.__('MTU Field Required!'),
                      range: window.__('MTU Range Is 576-1500!')})}</div>  
                </FormGroup>
              </>:
              proto==='pppoe'?<>                
                <FormGroup lable={window.__('Account')}>
                    <input value={usr||''} onChange={this.handleChange('usr')}/>
                </FormGroup>
                <div className="tip-err">
                {this.validator.message('usr', usr, 'required&&max:128&&min:1&&ascii&&houtais','',{            
                    default: window.__('Account Field Required!'),           
                    houtais: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                    ascii: window.__('Only Supports ASCII Code!'),
                    min: window.__('Account At Least 1 Character!'),
                    max: window.__('Account At Most 128 Characters!'),
                })}</div>  

                <FormPassword lable={window.__('Password')}
                  value={pwd||''} onChange={this.handleChange('pwd')}>
                </FormPassword>
                <div className="tip-err">
                {this.validator.message('pwd', pwd, 'required&&max:128&&min:1&&ascii&&houtais','',{            
                    default: window.__('Password Field Required!'),           
                    houtais: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                    ascii: window.__('Only Supports ASCII Code!'),
                    min: window.__('Password At Least 1 Character!'),
                    max: window.__('Password At Most 128 Characters!'),
                })}</div>  

                <FormGroup lable={window.__('AC')}>
                    <input value={ac||''} placeholder={window.__("AUTO Leave Blank To Auto Detect")}
                    onChange={this.handleChange('ac')}/>
                </FormGroup>
                <div className="tip-err">
                {this.validator.message('ac', ac, 'max:32&&houtais','',{            
                    default: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),          
                    max: window.__('AC At Most 32 Characters!'),
                })}</div>   

                <FormGroup lable={window.__('Service Name')}>
                    <input value={service||''} placeholder={window.__("AUTO Leave Blank To Auto Detect")}
                    onChange={this.handleChange('service')}/>
                </FormGroup>
                <div className="tip-err">
                {this.validator.message('service', service, 'max:32&&houtais','',{            
                    default: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),        
                    max: window.__('Server At Most 32 Characters!'),
                })}</div>   

                <FormGroup lable={window.__('MTU')}>
                    <input value={ppp_mtu||''} onChange={this.handleChange('ppp_mtu')}/>
                    <div className="tip-err">
                    {this.validator.message('ppp_mtu', ppp_mtu, 'required&&range:576-1492','',{
                        default: window.__('MTU Field Required!'),
                        range: window.__('MTU Range Is 576-1492!')
                    })}</div>  
                </FormGroup>
              </>:null
            }

            <FormGroup lable={window.__('MAC Address')}>
                <input value={mac_addr||''} onChange={this.handleChange('mac_addr')}/>
                <div className="tip-err">
                {this.validator.message('mac_addr', mac_addr, 'required&&mac','',{
                    default: window.__('MAC Address Field Required!'),
                    mac: window.__('Valid Format Is XX:XX:XX:XX:XX:XX!')
                    })}</div>  
            </FormGroup>

            <FormRadioCheck>
              <Checkbox checked={mac_addr!==def_mac_addr} onChange={this.changeCloneMac}>
                {window.__('Clone MAC Address')}
              </Checkbox>
            </FormRadioCheck>
          </>}
    
          <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>
        
          <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Configuring...Please Do Not Shut Down The Device,Completed After '/>

        <div style={{height:88}}></div>
      </div>
    );
  }
}


  