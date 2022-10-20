import React, { Component } from 'react';
import {axios,HYID ,posturl,deepCopy,handleRedir} from '@/share';
import { PageText,Progress,FormPassword,FormGroup,FormButton,Modal,FormRadioCheck} from '@/screens/components';

import {message,Switch, Select,Icon,Radio} from 'antd';
import './index.less'
import ReactValidator from '@/share/validator/index.js';
const { Option } = Select;

class BaseLan extends Component {
  state={
    two2one:false,
    opmodeMsg:{},
    showProgress:false,
    locktime:0,
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount(){
    this.getData()
  }
  getData=()=>{
    axios.post({
      data:{
        HYID:HYID.get_system_mode,
      },
      url:posturl
    }).then((res)=>{
        if(res.errcode === 2000){   
          let opmodeMsg = deepCopy(res.huayi_r)
          let two2one = false;
          if(opmodeMsg.authmode_24g){
            if(opmodeMsg.authmode_58g ==="disable" && opmodeMsg.authmode_24g==="disable"){
              if(opmodeMsg.ssid_58g === opmodeMsg.ssid_24g){
                two2one=true
              }
            }else if(opmodeMsg.ssid_58g === opmodeMsg.ssid_24g&&
              opmodeMsg.authmode_58g === opmodeMsg.authmode_24g&&
              opmodeMsg.cipher_58g === opmodeMsg.cipher_24g&&
              opmodeMsg.key_58g === opmodeMsg.key_24g){
                two2one=true
              }   
          }else if(opmodeMsg.ssid_58g === opmodeMsg.ssid_24g&&
              opmodeMsg.encryption_58g === opmodeMsg.encryption_24g&&
              opmodeMsg.key_58g === opmodeMsg.key_24g){
                two2one=true  
          }         
          this.setState({
            opmodeMsg,
            opmodeMsg_src:deepCopy(res.huayi_r),
            two2one,
          })
        }      
      })
    }
    
    handleRepConfig=()=>{
        let opmodeMsg = deepCopy(this.state.opmodeMsg)
        let opmodeMsg_src = deepCopy(this.state.opmodeMsg_src)
        let validarr =[]
        if(this.state.two2one===true){
          validarr = ['ssid_24g']
          if(opmodeMsg.authmode_24g){
            if(opmodeMsg.authmode_24g!=="disable"){
              validarr.push('key_24g')
            }
          }else if(opmodeMsg.encryption_24g !== 0){
            validarr.push('key_24g')
          }
        }
        else{
          validarr = ['ssid_24g','ssid_58g']
          if(opmodeMsg.authmode_24g){
            if(opmodeMsg.authmode_24g!=="disable"){
              validarr.push('key_24g')
            }
          }else{
            if(opmodeMsg.encryption_24g !== 0){
              validarr.push('key_24g')
            }
          }
          if(opmodeMsg.authmode_58g){
            if(opmodeMsg.authmode_58g!=="disable"){
              validarr.push('key_58g')
            }
          }else{
            if(opmodeMsg.encryption_58g !== 0){
              validarr.push('key_58g')
            }
          }
        }
        if(this.state.two2one===true){
          opmodeMsg = this.handleTwo2one(true)
        }
        if(opmodeMsg.authmode_24g){
          if(opmodeMsg.authmode_24g==="disable"){
            opmodeMsg.cipher_24g = opmodeMsg_src.cipher_24g;
            opmodeMsg.key_24g = opmodeMsg_src.key_24g;
          }
          if(opmodeMsg.authmode_58g==="disable"){
            opmodeMsg.cipher_58g = opmodeMsg_src.cipher_58g;
            opmodeMsg.key_58g = opmodeMsg_src.key_58g;
          }
        }else{
          if(opmodeMsg.encryption_24g ===0){
            opmodeMsg.key_24g = opmodeMsg_src.key_24g;
          }
          if(opmodeMsg.encryption_58g ===0){
            opmodeMsg.key_58g = opmodeMsg_src.key_58g;
          }
        }

        if( this.validator.someValid(validarr) ){
          if(opmodeMsg.authmode_24g){
            if(
              opmodeMsg.ssid_58g===opmodeMsg_src.ssid_58g&&
              opmodeMsg.ssid_24g===opmodeMsg_src.ssid_24g&&
              opmodeMsg.authmode_24g===opmodeMsg_src.authmode_24g&&
              opmodeMsg.authmode_58g===opmodeMsg_src.authmode_58g&&
              opmodeMsg.cipher_24g===opmodeMsg_src.cipher_24g&&
              opmodeMsg.cipher_58g===opmodeMsg_src.cipher_58g&&
              opmodeMsg.key_58g===opmodeMsg_src.key_58g&&
              opmodeMsg.key_24g===opmodeMsg_src.key_24g){
                message.success(window.__('Data Up to Date'))     
                return;
              }
          }else if(
            opmodeMsg.ssid_58g===opmodeMsg_src.ssid_58g&&
            opmodeMsg.ssid_24g===opmodeMsg_src.ssid_24g&&
            opmodeMsg.encryption_58g===opmodeMsg_src.encryption_58g&&
            opmodeMsg.encryption_24g===opmodeMsg_src.encryption_24g&&
            opmodeMsg.key_58g===opmodeMsg_src.key_58g&&
            opmodeMsg.key_24g===opmodeMsg_src.key_24g){
              message.success(window.__('Data Up to Date'))     
              return;
            }
          this.setData(opmodeMsg)
        } else {
          this.validator.showMessages();
          this.forceUpdate();
        }
    }
    
    setData=(msg)=>{
      axios.post({
        data:{
          HYID:HYID.set_basic_wifi,
          ...msg
        },
        url:posturl
      }).then((res)=>{
          if(res.errcode === 2000){              
            this.setState({
              showProgress:res.progresstime!==0,
              locktime:res.progresstime,
              redir:res.reconnection,
              redir_ip:res.reconnection_addr||'', 
            })
            if(res.progresstime===0){                     
              message.success(window.__('Success'))     
              this.getData()   
            }
          }      
        })
      }
      handleRedirect=()=>{
        //handleRedir(this.state.redir,this.state.redir_ip)      
        this.setState({
          showProgress:false,
        })
        message.success(window.__('Success'))     
        this.getData()
    }
  handleChange = (name,list) => event => {
    let result;
    if(list==='ap'){
      result = deepCopy(this.state.opmodeMsg)
    }
    else if(list==='repeater'){
      result = deepCopy(this.state.selectList)
    }
    /**切换加密方式时 修改加密类型 */
    if((name === 'authmode') && (event.target.value !=='NONE'))
    result['encryption'] = 'TKIP'
    else if((name === 'authmode') && (event.target.value ==='NONE')){
      result['encryption'] = ''
      result['key'] = ''
    }
    result[name] = event.target.value
    if(list==='ap'){
      this.setState({ opmodeMsg:result });
    }
    else if(list==='repeater'){
      this.setState({ selectList:result });
    }
  };
  handleTwo2one=(bool)=>{
    let opmodeMsg = deepCopy(this.state.opmodeMsg)
    let opmodeMsg_src = deepCopy(this.state.opmodeMsg_src)
    if(bool){
      if(opmodeMsg.authmode_24g){
        opmodeMsg.ssid_58g = opmodeMsg.ssid_24g;
        opmodeMsg.authmode_58g = opmodeMsg.authmode_24g;
        opmodeMsg.cipher_58g = opmodeMsg.cipher_24g;
        opmodeMsg.key_58g = opmodeMsg.key_24g;
      }else{
        opmodeMsg.ssid_58g = opmodeMsg.ssid_24g;
        opmodeMsg.encryption_58g = opmodeMsg.encryption_24g;
        opmodeMsg.key_58g = opmodeMsg.key_24g;
      }
    }else{ 
      if(opmodeMsg.authmode_24g){
        opmodeMsg.ssid_24g = opmodeMsg_src.ssid_24g;
        opmodeMsg.authmode_24g = opmodeMsg_src.authmode_24g;
        opmodeMsg.cipher_24g = opmodeMsg_src.cipher_24g;
        opmodeMsg.key_24g = opmodeMsg_src.key_24g;

        opmodeMsg.ssid_58g = opmodeMsg_src.ssid_58g;
        opmodeMsg.authmode_58g = opmodeMsg_src.authmode_58g;
        opmodeMsg.cipher_58g = opmodeMsg_src.cipher_58g;
        opmodeMsg.key_58g = opmodeMsg_src.key_58g;
      }
    }
    return opmodeMsg
  }

  handleChange_toNum = (name,list) => value => {
    let result;
    if(list==='ap'){
      result = deepCopy(this.state.opmodeMsg)
    }
    
    //if((name==='encryption_24g') && (value ===0)){
    //  result['key_24g']=''
    //}
    //if((name==='encryption_58g') && (value ===0)){
    //  result['key_58g']=''
    //}

    result[name] = Number(value)
    this.setState({ result });
    if(list==='ap'){
      this.setState({ opmodeMsg:result });
    }
  };

  handleSwitch=name=>(checked)=>{
    let opmodeMsg = deepCopy(this.state.opmodeMsg)
    if(name==='two2one'){
      opmodeMsg = this.handleTwo2one(checked);
      this.setState({ 
        [name]:checked,
        opmodeMsg:opmodeMsg
      });
    }
  }
  handleSelect = (name) => value => {
    let opmodeMsg = deepCopy(this.state.opmodeMsg);
    opmodeMsg[name] = value;
    this.setState({ opmodeMsg });

    // if(name === 'auth_mode'){
    //   result.cipher_mode = value === 'disable' ? this.state.result_src.cipher_mode : this.state.result.cipher_mode;
    //   result.key = value === 'disable' ? this.state.result_src.key : this.state.result.key;
    // }
  }
  render() {
    const {two2one,opmodeMsg,opmodeMsg:{ssid_24g,encryption_24g,key_24g,ssid_58g,encryption_58g,key_58g}} = this.state  
  
    return (
      <div>
        <PageText
          title={window.__('Dual-band Combination')}
        />
      <>
          <FormGroup  lable={window.__('Dual-band Combination')}>     
              <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
              checked={this.state.two2one}  onChange={this.handleSwitch('two2one')}/>
          </FormGroup>
          
          <FormGroup lable={window.__(two2one?'SSID':'2.4G SSID')}>
              <input value={ssid_24g||''} onChange={this.handleChange('ssid_24g','ap')}/>
              <div className="tip-err">
              {this.validator.message('ssid_24g', ssid_24g, 'required&&max:32&&ssid&&houtais','',{
                  default: window.__(two2one?'SSID Field Required!':"2.4G SSID Field Required!"),                 
                  houtais:  window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                  max: window.__(two2one?'SSID At Most 32 Characters!':'2.4G SSID At Most 32 Characters!'),
                  ssid: window.__('Chinese Characters, Numbers, Letters, Underscores, Bars, Spaces Are Vaild!')
              })}</div>  
          </FormGroup>

          {opmodeMsg.authmode_24g?
            <div>
              <FormGroup lable={window.__(two2one?'Security Mode':'2.4G Security Mode')}>
                  <Select onChange={this.handleSelect("authmode_24g")} value={opmodeMsg.authmode_24g}>
                    <Option value={"disable"}>{window.__("Disable")}</Option>
                    <Option value={"WPAPSK"} >{window.__("WPAPSK")}</Option>
                    <Option value={"WPA2PSK"} >{window.__("WPA2PSK")}</Option>
                    <Option value={"WPAPSKWPA2PSK"} >{window.__("WPAPSKWPA2PSK")}</Option>
                  </Select>
                </FormGroup>
                {opmodeMsg.authmode_24g !== "disable" && <>
                  <FormRadioCheck lable={window.__(two2one?'Cipher Mode':'2.4G Cipher Mode')}>
                    <Radio.Group onChange={this.handleChange('cipher_24g','ap')} value={opmodeMsg.cipher_24g}>
                      <Radio value={"TKIP"}>{window.__('TKIP')}</Radio>
                      <Radio value={"AES"}>{window.__('AES')}</Radio>
                      <Radio value={"TKIPAES"}>{window.__('TKIPAES')}</Radio>
                    </Radio.Group>
                  </FormRadioCheck>
                  <FormPassword lable={window.__(two2one?'Password':'2.4G Password')}   
                    value ={key_24g||""}
                    onChange={this.handleChange('key_24g','ap')}>
                  </FormPassword>                       
                  <div className="tip-err">
                  {this.validator.message('key_24g', key_24g, 'required&&min:8&&max:63&&password&&houtais','',{
                      default: window.__(two2one?'Password Field Required!':'2.4G Password Field Required!'),             
                      houtais:  window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                      min: window.__(two2one?'Password At Least 8 Characters!':'2.4G Password At Least 8 Characters!'),
                      max: window.__(two2one?'Password At Most 63 Characters!':'2.4G Password At Most 63 Characters!'),
                      password: window.__('Only Supports ASCII Code!')
                  })}</div>
                </>}
            </div>
          :
            <div>
              <FormGroup  lable={window.__(two2one?'Encryption':'2.4G Encryption')}>      
                <Select onChange={this.handleChange_toNum("encryption_24g",'ap')} value={encryption_24g}>
                  <Option value ={0}>{window.__('None')}</Option>
                  <Option value ={1} >{window.__('Encrypted')}</Option>
                </Select>
              </FormGroup>
              {
                encryption_24g===0?null:
                <>
                  <FormPassword lable={window.__(two2one?'Password':'2.4G Password')}   
                    value ={key_24g||""}
                    onChange={this.handleChange('key_24g','ap')}>
                  </FormPassword>                       
                  <div className="tip-err">
                  {this.validator.message('key_24g', key_24g, 'required&&min:8&&max:63&&password&&houtais','',{
                      default: window.__(two2one?'Password Field Required!':'2.4G Password Field Required!'),             
                      houtais:  window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                      min: window.__(two2one?'Password At Least 8 Characters!':'2.4G Password At Least 8 Characters!'),
                      max: window.__(two2one?'Password At Most 63 Characters!':'2.4G Password At Most 63 Characters!'),
                      password: window.__('Only Supports ASCII Code!')
                  })}</div>  
                  </>
              }
            </div>
          }

        <div style={{display:two2one?'none':'block'}}>
                    
          <FormGroup lable={window.__('5.8G SSID')}>
              <input value={ssid_58g||''} onChange={this.handleChange('ssid_58g','ap')}/>
              <div className="tip-err">
              {this.validator.message('ssid_58g', ssid_58g, 'required&&max:32&&ssid&&houtais','',{
                default: window.__('5.8G SSID Field Required!'),                 
                houtais:  window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                max: window.__('5.8G SSID At Most 32 Characters!'),
                ssid: window.__('Chinese Characters, Numbers, Letters, Underscores, Bars, Spaces Are Vaild!')
              })}</div>  
          </FormGroup>

          {opmodeMsg.authmode_24g?
            <div>
              <FormGroup lable={window.__('5.8G Security Mode')}>
                  <Select onChange={this.handleSelect("authmode_58g")} value={opmodeMsg.authmode_58g}>
                    <Option value={"disable"}>{window.__("Disable")}</Option>
                    <Option value={"WPAPSK"} >{window.__("WPAPSK")}</Option>
                    <Option value={"WPA2PSK"} >{window.__("WPA2PSK")}</Option>
                    <Option value={"WPAPSKWPA2PSK"} >{window.__("WPAPSKWPA2PSK")}</Option>
                  </Select>
                </FormGroup>
                {opmodeMsg.authmode_58g !== "disable" && <>
                  <FormRadioCheck lable={window.__('5.8G Cipher Mode')}>
                    <Radio.Group onChange={this.handleChange('cipher_58g','ap')} value={opmodeMsg.cipher_58g}>
                      <Radio value={"TKIP"}>{window.__('TKIP')}</Radio>
                      <Radio value={"AES"}>{window.__('AES')}</Radio>
                      <Radio value={"TKIPAES"}>{window.__('TKIPAES')}</Radio>
                    </Radio.Group>
                  </FormRadioCheck>
                  <FormPassword lable={window.__('5.8G Password')}   
                    value ={key_58g||""}
                    onChange={this.handleChange('key_58g','ap')}>
                  </FormPassword>                          
                  <div className="tip-err">
                  {this.validator.message('key_58g', key_58g, 'required&&min:8&&max:63&&password&&houtais','',{
                      default: window.__('5.8G Password Field Required!'),             
                      houtais:  window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                      min: window.__('5.8G Password At Least 8 Characters!'),
                      max: window.__('5.8G Password At Most 63 Characters!'),
                      password: window.__('Only Supports ASCII Code!')
                  })}</div> 
                </>}
            </div>
          :
            <div>
              <FormGroup  lable={window.__('5.8G Encryption')}>      
                <Select onChange={this.handleChange_toNum("encryption_58g",'ap')} value={encryption_58g}>
                  <Option value ={0}>{window.__('None')}</Option>
                  <Option value ={1} >{window.__('Encrypted')}</Option>
                </Select>
              </FormGroup>
              {
                encryption_58g===0?null:            
                <>
                  <FormPassword lable={window.__('5.8G Password')}   
                    value ={key_58g||""}
                    onChange={this.handleChange('key_58g','ap')}>
                  </FormPassword>                          
                  <div className="tip-err">
                  {this.validator.message('key_58g', key_58g, 'required&&min:8&&max:63&&password&&houtais','',{
                      default: window.__('5.8G Password Field Required!'),             
                      houtais:  window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                      min: window.__('5.8G Password At Least 8 Characters!'),
                      max: window.__('5.8G Password At Most 63 Characters!'),
                      password: window.__('Only Supports ASCII Code!')
                  })}</div>  

                  </>
              }
            </div>
          }
          </div> 
          <FormButton onClick={()=>this.handleRepConfig()}>{window.__('Apply')}</FormButton>

          <div className='leave_blank'></div>
          </>

          <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Configuring...Please Do Not Shut Down The Device,Completed After '/>
            
      </div>
    );
  }
}

export default BaseLan;
