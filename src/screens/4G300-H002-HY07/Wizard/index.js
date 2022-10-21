import React from 'react';
import {Header,FormGroup,Progress,FormPassword,FormRadioCheck,Modal} from '@/screens/components';
import {Card, Button, Icon, Divider,Select,Switch,message,Radio,Checkbox} from 'antd'
import {axios,HYID ,posturl,handleRedir,deepCopy} from '@/share';
import ReactValidator from '@/share/validator/index.js';
import logo_img from '@/logo.png';
import './index.less'
import Repeater from '@/screens/MainRouter/screens/Network/WANPrior/repeater'
import lock1 from '@/screens/MainRouter/screens/Network/WANPrior/img/lock1.png'
import lock2 from '@/screens/MainRouter/screens/Network/WANPrior/img/lock2.png'
import lock3 from '@/screens/MainRouter/screens/Network/WANPrior/img/lock3.png'
import lock4 from '@/screens/MainRouter/screens/Network/WANPrior/img/lock4.png'
import unlock1 from '@/screens/MainRouter/screens/Network/WANPrior/img/unlock1.png'
import unlock2 from '@/screens/MainRouter/screens/Network/WANPrior/img/unlock2.png'
import unlock3 from '@/screens/MainRouter/screens/Network/WANPrior/img/unlock3.png'
import unlock4 from '@/screens/MainRouter/screens/Network/WANPrior/img/unlock4.png'

const {Option} = Select;
export default class Quick extends React.Component{
  state={
    loading:false,
    step1: true,
    proto: 'dhcp',
    speed: 1000,
    wanmsg:{     
      host_name: ""
    },
    wan_type:"",
    ssid_config:	{
    },
    showProgress: false,
    locktime: 0,
    first_boot:0,
    wanmsg_src:{},
    values: {}
  }

  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount(){
    this.getData()
  }

  getData=()=>{
    axios.post({
      url: posturl,
      data: {
        HYID: HYID.get_quick_setting_config
      }
    }).then((res)=>{
      if(res.errcode === 2000){
        if(res.huayi_r.first_boot===0) {
          window.location.hash="#/Home"
        } 
        let wanmsg = {}
        wanmsg = {
          wan_type: res.huayi_r.wan_type,
          proto:res.huayi_r.proto,
          usr:res.huayi_r.usr,
          pwd:res.huayi_r.pwd,
          ac:res.huayi_r.ac,
          service:res.huayi_r.service,
          host_name: res.huayi_r.host_name,
          auth_type: res.huayi_r.auth_type,
          apn_name: res.huayi_r.apn_name,
          apn_usr: res.huayi_r.apn_usr,
          apn_pwd: res.huayi_r.apn_pwd,
          use_apn: res.huayi_r.use_apn,
          proto_4g: res.huayi_r.proto_4g,
        }
        this.setState({
          ssid_config: res.huayi_r.ssid_config,
          speed: res.huayi_r.speed,
          first_boot:res.huayi_r.first_boot,
          wanmsg,
          wanmsg_src: wanmsg,
          result_src:deepCopy(res.huayi_r)
        })
      }
    })
  }

  setQuickSettingConfig=(values,ssid_config)=>{
    axios.post({
      url: posturl,
      data: {
        HYID: HYID.set_quick_setting_config,
        ...values,
        ...ssid_config,
      }
    }).then((res)=>{
      if(res.errcode == 2000) {
        this.setState({
          showProgress: res.progresstime!= 0,
          locktime: res.progresstime,
          redir:res.reconnection,
          redir_ip:res.reconnection_addr||'', 
        })
      }
    })
  }

  handleRedirect=()=>{
    handleRedir(this.state.redir,this.state.redir_ip)      
    this.setState({
      showProgress:false,
      showRelaySSID: true
    })
    // window.location.hash="#/Home";
  }
  setWanmsg=(wanmsg)=>{
    this.setState({wanmsg})
  }

  setSsidConfig=(ssid_config)=>{
    this.setState({ssid_config})
  }

  handlePrevStep=()=>{
    this.setState({step1: true})
  }

  setStep1False=()=>{
    this.setState({step1: false})
  }

  handleFinish=(ssid_config)=>{
    this.setQuickSettingConfig(this.state.values,ssid_config)
  }

  setFirstData=(values)=>{
    this.setState({values})
  }

  handleCloseModal=()=>{
    this.setState({
      showRelaySSID:false
    })
    window.location.hash="#/Home";
  }

  render(){
    const {step1,values} = this.state
    return (
      <div className="wizard">
        <div><Header 
          // logo={logo_img}
        /></div>
        <div className="wizard-content">
        <h1>{step1==true?window.__("Network Quick Setting"):window.__("WLAN Quick Setting")}</h1>
          <Card bordered={false}>
          {
              step1==true?
              <div>
                <QuickNetSetting
                speed={this.state.speed}
                loading={this.state.loading}
                wanmsg={this.state.wanmsg}
                wanmsg_src={this.state.wanmsg_src}
                setWanmsg={this.setWanmsg}         
                setStep1False={this.setStep1False} 
                setFirstData={this.setFirstData}         
                />

              </div>
              :
              <div>
                <ACQuickSetting
                ssid_config={this.state.ssid_config}
                setSsidConfig={this.setSsidConfig}
                handlePrevStep={this.handlePrevStep}
                handleFinish={this.handleFinish}
                />
              </div>
            }
            <Modal
              style={{width:650,height:260,marginTop:20}}
              visible={this.state.showRelaySSID}
              closeModel={this.handleCloseModal}
              close={true}
              >          
              <div className="relaysucess">
                <span><Icon type="check-circle"/>{window.__('Success! Please Reconnect To Network!')}</span>
                <div><div className="textleft">{window.__("Wireless SSID After Relay:")}</div>{values.rep_ssid_24g}</div>
                {values.auth_mode!=='NONE'&&<div><div className="textleft">{window.__("Wireless Passowrd After Relay:")}</div>{values.key}</div>}
                {/* <div className="visitPage">{window.__('After reconnecting to the network, launch the browser and enter')}<span className="setup_url">&nbsp;{this.props.domainName}&nbsp;</span>{window.__('in the address')}</div> */}
              </div>
            </Modal>
            <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Configuring...Please Do Not Shut Down The Device,Completed After '/>
          </Card>
        </div>
      </div>
    )
  }
}

class QuickNetSetting extends React.Component{
  state={
    speed: this.props.speed,
    loading: this.props.loading,
    wanmsg: this.props.wanmsg,
    wanmsg_src: this.props.wanmsg_src,
    selectList: this.props.selectList
  }

  componentWillMount() {
    this.validator = new ReactValidator();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.speed !== this.props.speed ||
      nextProps.loading !== this.props.loading ||
      nextProps.wanmsg !==this.props.wanmsg ||
      nextProps.wanmsg_src !== this.props.wanmsg_src) {
      this.setState({
        speed:nextProps.speed,
        loading:nextProps.loading,
        wanmsg:nextProps.wanmsg,
        wanmsg_src:nextProps.wanmsg_src
      })
    }
  }

  handleChange = name => event => {
    let wanmsg = deepCopy(this.state.wanmsg)
    let value = event.target.value;
    if(name==="wan_type"){
      wanmsg[name] = value 
    }else{
      wanmsg[name]=value
    }
    this.setState({ wanmsg });
    this.props.setWanmsg(wanmsg)
  };
  handleSelect= name => value =>{   
    let wanmsg = deepCopy(this.state.wanmsg)
    wanmsg[name] = value;
    this.setState({ wanmsg });
    this.props.setWanmsg(wanmsg)
    this.validator.hideMessages();
  }
  mobileData=async()=>{
    let mobileChange = 0;//0是正常，1是格式错误，2是数据未修改
    let mobileValue = {}
    let wanmsg = deepCopy(this.state.wanmsg);
    let wanmsg_src = deepCopy(this.state.wanmsg_src)
    if(wanmsg.wan_type==="mobile"){//4g
      if(wanmsg.use_apn===0){//自动
        if( this.validator.someValid(['mhostname']) ){
          mobileValue =  {
            use_apn: 0,
            host_name: wanmsg.host_name,
            proto: "dhcp"
          }
        }else {
          mobileChange = 1;
          this.validator.showMessages();
          this.forceUpdate();
        }
      }
    }
    if(wanmsg.wan_type==="rep4g"){//有线优先下的4g
      if(wanmsg.use_apn===0){//自动
        mobileValue =  {
          use_apn: 0,
          // host_name:wanmsg_src.host_name,
          proto_4g: "dhcp"
        }
      }
    }
    if(wanmsg.wan_type==="rep4g"||wanmsg.wan_type==="mobile"){
      if(wanmsg.use_apn===1){//手动
        if( this.validator.someValid(['apn_name','apn_usr','apn_pwd']) ){
          mobileValue =  {
            use_apn: wanmsg.use_apn,
            apn_name: wanmsg.apn_name,
            apn_usr: wanmsg.apn_usr,
            apn_pwd: wanmsg.apn_pwd,
            auth_type: wanmsg.auth_type,
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
  handleSetData=()=>{
    let wanmsg = deepCopy(this.state.wanmsg);
    let values = {}
    if(wanmsg.wan_type==="rep"){
      values = {
        wan_type: "rep",
        ...this.state.selectList,
      }
      if(!values.ssid){
        message.error(window.__("Please select a wireless WAN!"))
        return
      }
      this.props.setFirstData(values)
      this.props.setStep1False()
    }else if(wanmsg.wan_type==="mobile"){
      if(this.state.mobileChange===1){
        return;
      }
      values = {
        wan_type: "mobile",
        ...this.state.mobileValue
      }
      this.props.setFirstData(values)
      this.props.setStep1False()
    }else{
      if(this.state.wiredChange===1||this.state.mobileChange===1){
        return;
      }
      values = {
        wan_type: "rep4g",
        ...this.state.mobileValue,
        ...this.state.selectList,
      }
      if(!values.ssid){
        message.error(window.__("Please select a wireless WAN!"))
        return
      }
      this.props.setFirstData(values)
      this.props.setStep1False()
    }
  }

  handleNextStep=()=>{
    let wanmsg = this.state.wanmsg
    if(wanmsg.wan_type==="rep"){
      if(this.childRef.handleRepConfig()){
        this.setState({selectList:this.refs.childData.state.selectList},()=>{this.handleSetData()})       
      }
    }else if(wanmsg.wan_type==="mobile"){
      this.mobileData().then(()=>{
				this.handleSetData()
      })
    }else{
      if(this.childRef.handleRepConfig()){
        this.setState({selectList:this.refs.childData.state.selectList})
        this.mobileData().then(()=>{
          this.handleSetData()
        })
      }
    }
  }
  handleToHome=()=>{
    axios.post({
      url: posturl,
      data: {
        HYID: HYID.set_first_boot,
        first_boot:0,
      }
    }).then((res)=>{
    })
    window.location.hash="#/Home"
  }

  handleChildEvent = (ref) =>{
    this.childRef = ref
  }

  selectTo=()=>{
    this.refs.wizard.scrollTop=0;
  }

  render() {
    const {speed, loading, wanmsg,wanmsg:{wan_type,auth_type,apn_name,
      apn_usr,apn_pwd,use_apn}} = this.state
    return(
      <div>
        {/* <Divider><h3>{window.__("Network Quick Setting")}</h3></Divider> */}
        <div className="wrapper" ref="wizard">
          
          <FormGroup lable={window.__('Internet Type')}>
            <Select value={wan_type ||''} onChange={this.handleSelect('wan_type')}>
              <Option value={'rep4g'}>{window.__('Wireless WAN+4G')}</Option>
              <Option value={'rep'}>{window.__('Wireless WAN')}</Option>
              <Option value={'mobile'}>{window.__('4G')}</Option>
            </Select>
          </FormGroup>         
          <div style={{height:20}}></div>
					{wan_type!=='mobile'&&<>
						{wan_type==='rep4g'&&<div style={{fontSize:22}}>{window.__('Wired')}</div>}
            <Repeater opmode={3} {...this.props} selectTo={this.selectTo}
                onChildEvent={this.handleChildEvent}
                ref='childData'
                lock1={lock1} 
                lock2={lock2} 
                lock3={lock3} 
                lock4={lock4} 
                unlock1={unlock1} 
                unlock2={unlock2} 
                unlock3={unlock3} 
                unlock4={unlock4} />
            </>}
					{(wan_type==='rep4g'||wan_type==='mobile')&&<>
            {wan_type==='rep4g'&&<>
              <div style={{fontSize:22}}>{window.__('4G')}</div>
            </>}
						<FormGroup lable={window.__('Dialing 4G')}>
							<Select value={use_apn||0} onChange={this.handleSelect('use_apn')}>
								<Option value={0}>{window.__('Automatic')}</Option>
								<Option value={1}>{window.__('Manual')}</Option>
							</Select>
						</FormGroup>
						{use_apn===0?<>
              {wan_type==='mobile'&&
                <FormGroup lable={window.__('Internet Access Mode')}>
                  <Select disabled value={'dhcp'} onChange={this.handleSelect('proto_4g')}>
                    <Option value={'static'}>{window.__('STATIC')}</Option>
                    <Option value={'dhcp'}>{window.__('DHCP')}</Option>
                    <Option value={'pppoe'}>{window.__('PPPOE')}</Option>
                  </Select>
                  </FormGroup>
              }
						</>:<>	
									<FormGroup lable={window.__('APN Name')}>
											<input value={apn_name||''}               
												// disabled={wan_type==='rep'}
												onChange={this.handleChange('apn_name')}/>
											<div className="tip-err">
											{this.validator.message('apn_name', apn_name, 'required&&apnname&&max:64','',{
													default: window.__('APN Name Field Required!'),
													apnname: window.__('Can\'t Contain The Following: \" & \' < > ` \\'),
													max: window.__('APN Name At Most 64 Characters!'),})}</div>  
									</FormGroup>
										
									<FormGroup lable={window.__('User Name')}>
										<input value={apn_usr||''}
										// disabled={wan_type==='rep'}
										onChange={this.handleChange('apn_usr')}/>
										<div className="tip-err">
										{this.validator.message('apn_usr',apn_usr, 'apnusername&&max:32','',{
												default: window.__('Limited To English Letters And Characters, Numbers,But Not Contain The Following: \" & \' < > ` \\'),
												max: window.__('User Name At Most 32 Characters!'),})}</div>  
									</FormGroup>
									<FormPassword lable={window.__('Password')}  
										// disabled={wan_type==='rep'}      
										value ={apn_pwd||""} 
										onChange={this.handleChange('apn_pwd')}>
									</FormPassword>                
									<div className="tip-err">
									{this.validator.message('apn_pwd', apn_pwd, 'apnusername&&max:32','',{
											default: window.__('Limited To English Letters And Characters, Numbers,But Not Contain The Following: \" & \' < > ` \\'),
											max: window.__('Password At Most 32 Characters!'),})}</div>  
									
									<FormGroup lable={window.__('Authentication')}>
										<Select value={auth_type||'0'}
										// disabled={wan_type==='rep'}
										onChange={this.handleSelect('auth_type')}>
											<Option value="0">NONE</Option>
											<Option value="1">PAP</Option>
											<Option value="2">CHAP</Option>
										</Select>
									</FormGroup>
						</>}
					</>}


          <div style={{textAlign:"center"}}>
            <Button  style={{marginRight:20, marginTop:20, marginBottom:60}}
            type="primary" 
            onClick={this.handleToHome}>{window.__("Skip")}</Button>
            <Button 
            type="primary" 
            onClick={this.handleNextStep}>{window.__("Next")}<Icon type="right"/></Button>
          </div>
        </div>
      </div>
    )
  }
}



class ACQuickSetting extends React.Component{
  state={
    ssid_config: this.props.ssid_config
  }

  componentWillMount() {
    this.validator = new ReactValidator();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props ) {
      if(this.props.ssid_config!=nextProps.ssid_config){
        this.setState({
          ssid_config:nextProps.ssid_config,
        })
      }
    }
  }
  handleToHome=()=>{
    axios.post({
      url: posturl,
      data: {
        HYID: HYID.set_first_boot,
        first_boot:0,
      }
    }).then((res)=>{
    })
    window.location.hash="#/Home"
  }

  handleFinish=()=>{
    let ssid_config = this.state.ssid_config
    let validarr = ['ssid_2g'];
    if(ssid_config.encry_2g !="0"){
      validarr.push('key_2g')
    }
    if(this.validator.someValid(validarr)){
      ssid_config.passphrase_2g = ssid_config.encry_2g=="0"?"":ssid_config.passphrase_2g
      this.props.handleFinish(ssid_config)
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }
    
  }
  
  handleChange = (name) => event => {
    let ssid_config = this.state.ssid_config
    let value = event.target.value;
    ssid_config[name]=value
    this.setState({ ssid_config });
    this.props.setSsidConfig(ssid_config)
  };

  handleEncry2g=(name) => event=>{
    let ssid_config = this.state.ssid_config
    ssid_config[name]=event
    this.props.setSsidConfig(ssid_config)
    this.setState({
      ssid_config
    })
  }


  render() {
    const {ssid_config}=this.state;
    return(
      <div>
        {/* <Divider><h3>{window.__("WLAN Quick Setting")}</h3></Divider> */}
        <div className="wrapper">

        <FormGroup lable={window.__('SSID')}>
            <input value={ssid_config.ssid_2g||''} onChange={this.handleChange('ssid_2g')}/>
            <div className="tip-err">
            {this.validator.message('ssid_2g', ssid_config.ssid_2g, 'required&&max:32&&ssid&&houtais','',{
                default: window.__('SSID Field Required!'),                 
                houtais:  window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                max: window.__('SSID At Most 32 Characters!'),
                ssid: window.__('Chinese Characters, Numbers, Letters, Underscores, Bars, Spaces Are Vaild!')
            })}</div>  
        </FormGroup>

        <FormGroup  lable={window.__('Encryption')}>      
          <Select onChange={this.handleEncry2g("encry_2g")} value={ssid_config.encry_2g}>
            <Option value ={0}>{window.__('None')}</Option>
            <Option value ={1} >{window.__('Encrypted')}</Option>
          </Select>
        </FormGroup>

        {
         ssid_config.encry_2g===0?null:
          <>
            <FormPassword lable={window.__('Password')}   
              value ={ssid_config.passphrase_2g||""}
              onChange={this.handleChange('passphrase_2g')}>
            </FormPassword>                       
            <div className="tip-err">
            {this.validator.message('key_2g', ssid_config.passphrase_2g, 'required&&min:8&&max:63&&password&&houtais','',{
                default: window.__('Password Field Required!'),             
                houtais:  window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                min: window.__('Password At Least 8 Characters!'),
                max: window.__('Password At Most 63 Characters!'),
                password: window.__('Only Supports ASCII Code!')
            })}</div>  
            </>
        }
        </div>

        <div style={{textAlign:"center"}}>
            <Button  style={{marginRight:20, marginTop:20, marginBottom:60}}
              type="primary" 
              onClick={this.handleToHome}>{window.__("Skip")}</Button>
            <Button style={{marginRight:20}}
              type="primary" 
              onClick={this.props.handlePrevStep}><Icon type="left"/>{window.__("Previous")}</Button>
            <Button  
              type="primary" 
              onClick={this.handleFinish}>{window.__("Complete")}</Button>
        </div>
      </div>

    )
  }
}