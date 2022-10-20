import React, { Component } from 'react';
import {axios,HYID ,posturl,deepCopy,handleRedir} from '@/share';
import { Progress,FormPassword,FormGroup,FormButton,Modal} from '@/screens/components';

import {message,Switch, Select,Icon} from 'antd';
import './index.less'
import ReactValidator from '@/share/validator/index.js';
const { Option } = Select;
//基础设置的WIFI页面与系统模式的AP页面都用这个组件；
//注意区分两者的不同
//下发的时候，一个需要opmode,WIFI不需要发opmode
//判断数据是否修改的情况，系统模式要看是否是相同模式
class BaseLan extends Component {
  state={
    two2one:false,
    opmodeMsg:{},
    showProgress:false,
    locktime:0,
    showModal: false
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
        HYID:this.props.HYID_get,
        //HYID:HYID.get_system_mode,
      },
      url:posturl
    }).then((res)=>{
        if(res.errcode === 2000){   
          let opmodeMsg = deepCopy(res.huayi_r)
          let two2one = false;
          if(opmodeMsg.authmode_24g){
            opmodeMsg.encryption_24g = opmodeMsg.authmode_24g==="disable"? 0 : 1
            opmodeMsg.encryption_58g = opmodeMsg.authmode_58g==="disable"? 0 : 1
          }
          if(opmodeMsg.ssid_58g === opmodeMsg.ssid_24g&&
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
    
    handleRepConfig=(mode)=>{
      if(mode==='ap'){
        let opmodeMsg = deepCopy(this.state.opmodeMsg)
        let opmodeMsg_src = deepCopy(this.state.opmodeMsg_src)
        let validarr =[]
        if(this.state.two2one===true){
          validarr = ['ssid_24g']
          if(opmodeMsg.encryption_24g !== 0){
            validarr.push('key_24g')
          }
        }
        else{
          validarr = ['ssid_24g','ssid_58g']          
          if(opmodeMsg.encryption_24g !== 0){
            validarr.push('key_24g')
          }
          if(opmodeMsg.encryption_58g !== 0){
            validarr.push('key_58g')
          }
        }
        if(this.state.two2one===true){
          opmodeMsg = this.handleTwo2one(true)
        }

        if(opmodeMsg.encryption_24g ===0){
          opmodeMsg.key_24g = '';
        }
        if(opmodeMsg.encryption_58g ===0){
          opmodeMsg.key_58g = '';
        }

        if( this.validator.someValid(validarr) ){
          //opmode = undefined:表示WIFI页调用， = 1 ：系统模式页调用 ======》（用于cgi下发时带opmode)
          //src_opmode = 1 :高级页系统模式调用， = undefined:基础页WIFI和基础页AP调用  =====》（用于判断数据是否需要判断相同）
          
          //基础页的AP模式下发时不需要判断数据是否修改；  opmode=1,src_opmode=undefined
          //高级页系统模式AP页下发时，要判断原来opmode是否等于1;  opmode=1,src_opmode=1/2
          //基础WIFI页下发时，要判断数据是否修改; opmode=undefined,src_opmode=undefined
          if((this.props.src_opmode === 1||//高级页
            (this.props.opmode === undefined && this.props.src_opmode ===undefined)) && //WIFI页
            opmodeMsg.sysmode===opmodeMsg_src.sysmode&&
            opmodeMsg.ssid_58g===opmodeMsg_src.ssid_58g&&
            opmodeMsg.ssid_24g===opmodeMsg_src.ssid_24g&&
            opmodeMsg.encryption_58g===opmodeMsg_src.encryption_58g&&
            opmodeMsg.encryption_24g===opmodeMsg_src.encryption_24g&&
            opmodeMsg.key_58g===opmodeMsg_src.key_58g&&
            opmodeMsg.key_24g===opmodeMsg_src.key_24g){
              message.success(window.__('Data Up to Date'))     
              return;
            }
          opmodeMsg.sysmode=this.props.opmode;
          this.setData(opmodeMsg,this.props.HYID_set/*HYID.set_sysmode_D3*/)
        } else {
          this.validator.showMessages();
          this.forceUpdate();
        }
      }
    }
    
    setData=(msg,HYID)=>{
      axios.post({
        data:{
          HYID,
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
            //this.props.setOpmode(msg.opmode)
            if(res.progresstime===0){                     
              message.success(window.__('Success'))     
              this.getData()   
            }
          }      
        })
      }
      handleRedirect=()=>{
        //handleRedir(this.state.reconnection,this.state.reconnection_addr)      
        this.setState({
          showProgress:false,
          showModal:true
        })

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
      opmodeMsg.ssid_58g = opmodeMsg.ssid_24g;
      opmodeMsg.encryption_58g = opmodeMsg.encryption_24g;
      opmodeMsg.key_58g = opmodeMsg.key_24g;
    }else{        
      opmodeMsg.ssid_24g = opmodeMsg_src.ssid_24g;
      opmodeMsg.encryption_24g = opmodeMsg_src.encryption_24g;
      opmodeMsg.key_24g = opmodeMsg_src.key_24g;

      opmodeMsg.ssid_58g = opmodeMsg_src.ssid_58g;
      opmodeMsg.encryption_58g = opmodeMsg_src.encryption_58g;
      opmodeMsg.key_58g = opmodeMsg_src.key_58g;
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
  handleCloseModal=()=>{
    this.setState({
      showModal:false
    })
  }
  render() {
    const {two2one,opmodeMsg:{rep_status,ssid_24g,encryption_24g,key_24g,ssid_58g,encryption_58g,key_58g
  },showModal} = this.state  
  
    return (
      <div>
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
          
          <FormGroup  lable={window.__('5.8G Encryption')}>      
            <Select onChange={this.handleChange_toNum("encryption_58g",'ap')} value={encryption_58g}>
              <Option value ={0}>{window.__('None')}</Option>
              <Option value ={1} >{window.__('Encrypted')}</Option>
            </Select>
          </FormGroup>
          {
            encryption_58g===0?null:            
            <>
              <FormPassword lable={window.__(two2one?'Password':'5.8G Password')}   
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
          <FormButton onClick={()=>this.handleRepConfig('ap')}>{window.__('Apply')}</FormButton>

          <div className='leave_blank'></div>
          </>

          <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Configuring...Please Do Not Shut Down The Device,Completed After '/>
          <Modal
            style={{width:650,height:260,marginTop:20}}
            visible={showModal}
            closeModel={this.handleCloseModal}
            close={true}
            >          
            <div className="relaysucess">
              <span><Icon type="check-circle"/>{window.__('Success! Please Reconnect To Network!')}</span>
              <div className="visitPage">{window.__('After reconnecting to the network, launch the browser and enter')}<span className="setup_url">&nbsp;{this.props.domainName}&nbsp;</span>{window.__('in the address')}</div>
              {two2one?
                <div>
                  <div><div className="textleft">{window.__('SSID')}:</div>{ssid_24g}</div>
                  {encryption_24g!==0?<div><div className="textleft">{window.__('Password')}:</div>{key_24g}</div>:null}
                </div>
              :
                <div>
                  <div><div className="textleft">{window.__('2.4G SSID')}:</div>{ssid_24g}</div>
                  {encryption_24g!==0?<div><div className="textleft">{window.__('Password')}:</div>{key_24g}</div>:null}
                  <div><div className="textleft">{window.__('5.8G SSID')}:</div>{ssid_58g}</div>
                  {encryption_58g!==0?<div><div className="textleft">{window.__('5.8G Password')}:</div>{key_58g}</div>:null}
                </div>
              }
            </div>
          </Modal>
            
      </div>
    );
  }
}

export default BaseLan;
