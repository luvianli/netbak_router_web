import React,{Component} from 'react';
import {FormGroup,FormButton,PageText,Progress,FormPassword,FormRadioCheck,Modal} from '@/screens/components';
import {axios,HYID ,posturl,smsurl,sms_HYID,deepCopy,handleRedir} from '@/share';
import {message,Icon,Select,Checkbox,Radio} from 'antd';
import ReactValidator from '@/share/validator/index.js';
import Repeater from './repeater'

const { Option } = Select;

export default class WANPrior extends Component {
  state={
    result:{
			dns_arr:[],
		},
    result_src:{},
    showProgress:false,
    locktime:0,
		loadingVisble: false,
    mobileChange: 0,
    mobileValue:{},
    selectList:[],
    showRelaySSID: false
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount(){
    this.getData();
    this.getCurrentUserInfo();
  }

  selectTo=()=>{
    this.refs.mainWizard.scrollIntoView(true);
  }
  
  getData = () => {
    axios.post({
      data:{
        HYID:sms_HYID.cgi_get_wan_or_wan4g_config
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
        HYID:sms_HYID.cgi_set_wan_or_wan4g_config,
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
  handleRedirect=()=>{
    handleRedir(this.state.redir,this.state.redir_ip)
    this.getData();
    this.setState({
      showProgress:false,
      showRelaySSID: true
    })
  }
  
  handleSetData=()=>{
    let result = deepCopy(this.state.result);
    let result_src = deepCopy(this.state.result_src);
    let values = {}
    if(result.wan_mode==="rep"){
      values = {
        wan_mode: "rep",
        ...this.state.selectList,
      }
      if(!values.ssid){
        message.error(window.__("Please select a wireless WAN!"))
        return
      }
      this.setEthWanConfig(values)
    }else if(result.wan_mode==="mobile"){
      if(this.state.mobileChange===1){
        return;
      }
      if(this.state.mobileChange===2&&(result.wan_mode===result_src.wan_mode)){
        message.success(window.__('Data Up to Date'))  
        return;
      }
      values = {
        wan_mode: "mobile",
        ...this.state.mobileValue
      }
      this.setEthWanConfig(values)
    }else{
      values = {
        wan_mode: "rep4g", 
        detect_ip: this.state.result.detect_ip,
        detect_time: this.state.result.detect_time,
        ...this.state.mobileValue,
        ...this.state.selectList,
      }
      if(!values.ssid){
        message.error(window.__("Please select a wireless WAN!"))
        return
      }
      this.setEthWanConfig(values)
    }
  }
  handleSelect= name => value =>{ 
    let result = deepCopy(this.state.result);
    if(name==='wan_mode'){
        if(value==='mobile'){
          result.proto='dhcp';
        }
        else if(value==='rep'||'rep4g'){
          result.proto=this.state.result_src.proto;
        }
    }
		result[name] = value;
    this.setState({ result });
    this.validator.hideMessages();
  }
  handleChange= name => event => {
    let result = deepCopy(this.state.result);
    let value = event.target.value;
    result[name] = value;
    if(name==='dns0'){
      result.dns_arr[0]=value;
    }
    if(name==='dns1'){
      result.dns_arr[1]=value;
    }
    if(name==='mac_addr'){      
      result.mac_addr=value.toUpperCase();
    }
    this.setState({ result });
  };
  mobileData=async()=>{
    let mobileChange = 0;//0是正常，1是格式错误，2是数据未修改
    let mobileValue = {}
    let result = deepCopy(this.state.result);
    let result_src = deepCopy(this.state.result_src)
    if(result.wan_mode==="mobile"){//4g
      if(result.use_apn===0){//自动
        if( this.validator.someValid(['mhostname','mcc_mtu','mmac_addr']) ){
          if(result_src.use_apn===result.use_apn&&
            result_src.hostname===result.hostname&&
            result_src.cc_mtu===result.cc_mtu&&
            result_src.mac_addr.toUpperCase()===result.mac_addr.toUpperCase()){    
              mobileChange = 2;
          }
          mobileValue =  {
            use_apn: 0,
            hostname: result.hostname,
            cc_mtu: result.cc_mtu,
            mac_addr: result.mac_addr,
            proto: "dhcp"
          }
        }else {
          mobileChange = 1;
          this.validator.showMessages();
          this.forceUpdate();
        }
      }
    }
    if(result.wan_mode==="rep4g"){//有线优先下的4g
      if(result.use_apn===0){//自动
        if(result_src.use_apn===result.use_apn){
          mobileChange = 2;
        }
        mobileValue =  {
          use_apn: 0,
          hostname:result_src.hostname,
          cc_mtu:result_src.cc_mtu,
          proto_4g: "dhcp"
        }
      }
    }
    if(result.wan_mode==="rep4g"||result.wan_mode==="mobile"){
      if(result.use_apn===1){//手动
        if( this.validator.someValid(['apn_name','apn_usr','apn_pwd']) ){
          if(result_src.use_apn===result.use_apn&&
            result_src.apn_name===result.apn_name&&
            result_src.apn_usr===result.apn_usr&&
            result_src.apn_pwd===result.apn_pwd&&
            result_src.auth_type===result.auth_type){    
              mobileChange = 2;
          }
          mobileValue =  {
            use_apn: result.use_apn,
            apn_name: result.apn_name,
            apn_usr: result.apn_usr,
            apn_pwd: result.apn_pwd,
            auth_type: result.auth_type,
            proto: "dhcp"
          }
        }else {
          mobileChange = 1;
          this.validator.showMessages();
          this.forceUpdate();
        }
      }
    }
    this.setState({mobileChange:mobileChange,mobileValue:mobileValue})
  }
  handleSave=()=>{
    let result = deepCopy(this.state.result);
    if(result.wan_mode==="rep"){      
      if(this.childRef.handleRepConfig()){
        this.setState({selectList:this.refs.childData.state.selectList},()=>{this.handleSetData()})       
      }else{
        this.selectTo()
      }
    }else if(result.wan_mode==="mobile"){
      this.mobileData().then(()=>{
				this.handleSetData()
      })
    }else{ 
      if( this.validator.someValid(['detect_ip','detect_time']) ){       
        if(this.childRef.handleRepConfig()){
          this.setState({selectList:this.refs.childData.state.selectList})
          this.mobileData().then(()=>{
            this.handleSetData()
          })
        } 
      }else{
        this.validator.showMessages();
        this.forceUpdate();
        this.selectTo()
        return false
      }
    }
  }
  changeCloneMac=(event)=>{
    let {result} = this.state;
    if(event.target.checked===true){
      result.mac_addr=this.state.usr_mac.toUpperCase();
    }else{
      result.mac_addr = result.def_mac_addr;
    }
    this.setState({ result })
  }
  handleChildEvent = (ref) =>{
    this.childRef = ref
  }
  handleCloseModal=()=>{
    this.setState({
      showRelaySSID:false,
    })
  }
  render(){
    const {result:{wan_mode,def_mac_addr,hostname,mac_addr,cc_mtu,auth_type,apn_name,
      apn_usr,apn_pwd,use_apn,detect_ip,detect_time},selectList} = this.state;
    return (
      <div ref='mainWizard'>
        <div style={{height:20}}></div>
        <PageText 
          title={window.__('WAN Setting')}
          msg={window.__('You can configure the parameters of multiple Internet Access Modes.')}
          showHelp={true}
          helpmsg={window.__("The Access Point Name (APN) is the name for the settings your device reads to set up a connection to the gateway between your carrier's cellular network and the public Internet. Most of the time, your device already has these settings in the system files, and can fill in the APN information automatically when it connects. If the APN can't connect to the Internet automatically, you can change the APN manually.")}
					/>
          <FormGroup lable={window.__('Internet Type')}>
            <Select value={wan_mode ||''} onChange={this.handleSelect('wan_mode')}>
              <Option value={'rep4g'}>{window.__('Wireless WAN+4G')}</Option>
              <Option value={'rep'}>{window.__('Wireless WAN')}</Option>
              <Option value={'mobile'}>{window.__('4G')}</Option>
            </Select>
          </FormGroup>
          {wan_mode==='rep4g'&&
            <>
              <FormGroup lable={window.__('Detect External Network Address')}>
                  <input value={detect_ip||''} onChange={this.handleChange('detect_ip')}/>
                  <div className="tip-err">
                    {this.validator.message('detect_ip', detect_ip, 'required&&url&&max:63&&houtais','',{
                      default:window.__('IP Or Domain Field Required!'),
                      houtais:window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                      url: window.__('IP Or Domain Format Invalid,Valid Format Is xxx.yyy.zzz(such as baidu.com,www.baidu.com)!'),
                      max: window.__('IP or Domain Name At Most 63 Characters!')
                    })}</div>  
              </FormGroup>
              <FormGroup lable={window.__('Wireless Delay Detection(ms)')}>
                <input value={detect_time||''} onChange={this.handleChange('detect_time')}/>
                <div className='tip' >{window.__('Note: After The Wireless Delay Exceeds This Value For Five Consecutive Times, The Network Switches To 4G!')}</div>
                <div className="tip-err">
                  {this.validator.message('detect_time', detect_time, 'required&&range:150-1000','',{
                    default: window.__('Wireless Delay Detection Time Field Required!'),
                    range: window.__('Wireless Delay Detection Time Range Is 150-1000(Default 300)!'),
                })}</div>
              </FormGroup>
            </>
          }
          <div style={{height:20}}></div>
					{wan_mode!=='mobile'&&<>
						{wan_mode==='rep4g'&&<div style={{fontSize:22}}>{window.__('Wireless WAN')}</div>}
              <Repeater opmode={3} {...this.props} selectTo={this.selectTo}
                onChildEvent={this.handleChildEvent}
                ref='childData'
              />
            </>}
					{(wan_mode==='rep4g'||wan_mode==='mobile')&&<>
            {wan_mode==='rep4g'&&<>
              <div style={{fontSize:22}}>{window.__('4G')}</div>
            </>}
						<FormGroup lable={window.__('Dialing 4G')}>
							<Select value={use_apn||0} onChange={this.handleSelect('use_apn')}>
								<Option value={0}>{window.__('Automatic')}</Option>
								<Option value={1}>{window.__('Manual')}</Option>
							</Select>
						</FormGroup>
						{use_apn===0?<>
              {wan_mode==='mobile'&&<>
                <FormGroup lable={window.__('Internet Access Mode')}>
                  <Select disabled value={'dhcp'} onChange={this.handleSelect('proto_4g')}>
                    <Option value={'static'}>{window.__('STATIC')}</Option>
                    <Option value={'dhcp'}>{window.__('DHCP')}</Option>
                    <Option value={'pppoe'}>{window.__('PPPOE')}</Option>
                  </Select>
                  </FormGroup>
                <FormGroup lable={window.__('Host Name')}>
                      <input value={hostname||''} onChange={this.handleChange('hostname')}/>
                  </FormGroup>                  
                <div className="tip-err">
                {this.validator.message('mhostname', hostname, 'houtais&&ascii&&max:32','',{            
                    default: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                    max: window.__('Host Name At Most 32 Characters!'),
                    ascii:window.__('Only Supports ASCII Code!'),
                })}</div> 

							<FormGroup lable={window.__('MTU')}>
									<input value={cc_mtu||''} onChange={this.handleChange('cc_mtu')}/>
									<div className="tip-err">
									{this.validator.message('mcc_mtu', cc_mtu, 'required&&range:576-1500','',{
											default:window.__('MTU Field Required!'),
											range: window.__('MTU Range Is 576-1500!')})}</div>  
							</FormGroup>
                <FormGroup lable={window.__('MAC Address')}>
                  <input value={mac_addr||''} onChange={this.handleChange('mac_addr')}/>
                  <div className="tip-err">
                  {this.validator.message('mmac_addr', mac_addr, 'required&&mac','',{
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
						</>:<>	
									<FormGroup lable={window.__('APN Name')}>
											<input value={apn_name||''}               
												// disabled={wan_mode==='rep'}
												onChange={this.handleChange('apn_name')}/>
											<div className="tip-err">
											{this.validator.message('apn_name', apn_name, 'required&&apnname&&max:64','',{
													default: window.__('APN Name Field Required!'),
													apnname: window.__('Can\'t Contain The Following: \" & \' < > ` \\'),
													max: window.__('APN Name At Most 64 Characters!'),})}</div>  
									</FormGroup>
										
									<FormGroup lable={window.__('User Name')}>
										<input value={apn_usr||''}
										// disabled={wan_mode==='rep'}
										onChange={this.handleChange('apn_usr')}/>
										<div className="tip-err">
										{this.validator.message('apn_usr',apn_usr, 'apnusername&&max:32','',{
												default: window.__('Limited To English Letters And Characters, Numbers,But Not Contain The Following: \" & \' < > ` \\'),
												max: window.__('User Name At Most 32 Characters!'),})}</div>  
									</FormGroup>
									<FormPassword lable={window.__('Password')}  
										// disabled={wan_mode==='rep'}      
										value ={apn_pwd||""} 
										onChange={this.handleChange('apn_pwd')}>
									</FormPassword>                
									<div className="tip-err">
									{this.validator.message('apn_pwd', apn_pwd, 'apnusername&&max:32','',{
											default: window.__('Limited To English Letters And Characters, Numbers,But Not Contain The Following: \" & \' < > ` \\'),
											max: window.__('Password At Most 32 Characters!'),})}</div>  
									
									<FormGroup lable={window.__('Authentication')}>
										<Select value={auth_type||'0'}
										// disabled={wan_mode==='rep'}
										onChange={this.handleSelect('auth_type')}>
											<Option value="0">NONE</Option>
											<Option value="1">PAP</Option>
											<Option value="2">CHAP</Option>
										</Select>
									</FormGroup>
						</>}
					</>}
					<FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>
          <Modal
              style={{width:650,height:260,marginTop:20}}
              visible={this.state.showRelaySSID}
              closeModel={this.handleCloseModal}
              close={true}
              >          
              <div className="relaysucess">
                <span><Icon type="check-circle"/>{window.__('Success! Please Reconnect To Network!')}</span>
                <div><div className="textleft">{window.__("Wireless SSID After Relay:")}</div>{selectList.rep_ssid_24g}</div>
                {selectList.auth_mode!=='NONE'&&<div><div className="textleft">{window.__("Wireless Passowrd After Relay:")}</div>{selectList.key}</div>}
                {/* <div className="visitPage">{window.__('After reconnecting to the network, launch the browser and enter')}<span className="setup_url">&nbsp;{this.props.domainName}&nbsp;</span>{window.__('in the address')}</div> */}
              </div>
          </Modal>
          <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Configuring...Please Do Not Shut Down The Device,Completed After '/>

        <div style={{height:48}}></div>
      </div>
    );
  }
} 