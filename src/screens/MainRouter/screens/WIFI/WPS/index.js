import React,{Component} from 'react';
import {FormGroup,FormButton,PageText,PageText2,Modal} from '@/screens/components';
import {axios,HYID ,posturl,handleRedir} from '@/share';
import {message,Switch} from 'antd';
import ReactValidator from '@/share/validator/index.js';
/**
  enable:WPS功能开关,
  pinenable:PIN码功能开关,
  wifienable:表示2g和5g wifi都关闭，1表示有wifi开启
  pincode:PIN码
 */
let wpsstatus=null;//0或2表示失败，34表示成功，35表示超时，36表示连接中


export default class WIFIBase extends Component {
  constructor(props) {
      super(props);
      this.state={
        mode12Visble:false,
        pinVisble:false,
        result:{},
        result_src:{}
      };
      this.WORD = {
        statusSuccess:window.__('Connect Success'),
        statusFail:window.__('Connect Fail'),
        statusTimeout:window.__('Connect Timeout'),
        connectting:window.__('Connectting...'),
        resetPin:window.__('Resetting pin code...'),
        resetSuccess:window.__('Reset Success'),
        generatingPincode:window.__('Generating random pin code...'),
        generateSuccess:window.__('Generate success'),
        setting:window.__('Setting...'),
        settingSuccess:window.__('Setting Success'),
      }
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount(){
    this.getData();
  }
  /**获取无线WPS功能开关 */
  getData = () => {
    axios.post({
      data:{
        HYID:HYID.get_wifi_wps
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
          enable:res.huayi_r.enable,
          pinenable:res.huayi_r.pinenable,
          wifienable:res.huayi_r.wifienable,
          pincode:res.huayi_r.pincode,
        })
      }
    })
  };  
  
  /**获取无线wps状态 ---WPS连接时定时去取*/
  getWifiWpsstatus = (connect) => {
    if(connect===0){
      clearInterval(this.timer);
      this.setState({
        statusWord:this.WORD.statusFail
      })
      setTimeout(() => {
          this.setState({
            mode12Visble:false,
            //文字  连接超时
          })
      }, 1000);//1s后关闭
      return;
    }
    if(connect===1){
      this.timer = setInterval(() => {   
        //定时获取WPS状态 HYID 70       
        axios.post({
          data:{
            HYID:HYID.get_wifi_wpsstatus
          },
          url:posturl
        }).then((res)=>{
          if(res.errcode===2000){
            wpsstatus=res.huayi_r.wpsstatus                
          if(wpsstatus!=null){
            let statusWord = '';
            switch(wpsstatus){
              case 34:          
                  //文字  连接成功
                  statusWord=this.WORD.statusSuccess;
                  break;
              case 0: 
              case 2:          
                //文字  连接失败
                  statusWord=this.WORD.statusFail;      
                  break;  
              case 35:          
                  //文字  连接超时
                  statusWord=this.WORD.statusTimeout;   
                  break;
                
              case 36:          
                //文字  连接中
                  statusWord=this.WORD.connectting;
                  break;
              
              default:
                    //文字  连接中
                  statusWord=this.WORD.connectting;
                  break;
            } 
            if(wpsstatus!==36){
              clearInterval(this.timer);
              this.setState({
                //mode12Visble:false,
                //文字
                statusWord:statusWord
              })
              setTimeout(() => {
                  this.setState({
                    mode12Visble:false,
                    //文字  连接超时
                  })
              }, 1000);//1s后关闭
              return;
            }
          }
          }
        })
      }, 2000);
      
      setTimeout(() => {
        if(wpsstatus===36){     
          clearInterval(this.timer);
          this.setState({
            statusWord: this.WORD.statusTimeout,
            //文字  连接超时
          })
          setTimeout(() => {
            this.setState({
              mode12Visble:false,
            })
          }, 1000);//1s后关闭
          return;
        }
      },130*1000);//130s
    }
  };  
  
  
  /**设置无线WPS功能开关 */
  setWifiWps = (checked) => {
    axios.post({
      data:{
        HYID:HYID.set_wifi_wps,
        enable:checked
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        message.success(window.__('Success'));
      }
    })
  };  
  
  /**模式一：设置无线WPS的PBC连接功能*/  
  setData = (connect) => {
    axios.post({
      data:{
        HYID:HYID.set_wifi_wps_pbc,
        enable:connect
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        if(connect===0){             
          this.getWifiWpsstatus(connect);          
        }
        if(connect===1){
          this.validator.hideMessages();
          this.getWifiWpsstatus(connect);
          this.setState({
            mode12Visble:true,
            //清空之前的文字
            statusWord:this.WORD.connectting
          })
        }
        //message.success(window.__('Success'));
        //TODO:连接后的处理
      }
    })
  };  
  
  /**模式二：设置无线WPS的输入终端pin码连接*/  
  setWifiWpsstapin = (connect,stapin=null) => {
    axios.post({
      data:{
        HYID:HYID.set_wifi_wpsstapin,
        enable:connect,
        stapin:stapin
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        
        if(connect===0){             
          this.getWifiWpsstatus(connect);          
        }
        if(connect===1){
          this.getWifiWpsstatus(connect);
          this.setState({
            mode12Visble:true,
            statusWord:this.WORD.connectting
          })
        }
        this.setState({
          stapin:''
        })
        this.validator.hideMessages()
        this.forceUpdate();
      }
    })
  };  
  handleSetWifiWpsstapin=(connect)=>{
    if(connect===0){
      this.setWifiWpsstapin(connect);
      return;
    }
    if(connect===1){
      //校验
      if(this.validator.allValid()){
        this.setWifiWpsstapin(connect,this.state.stapin);
      }else {
        this.validator.showMessages();
        this.forceUpdate();
      }
    }
  }
  /**模式三：获取无线WPS的本地pin码*/  
  getWifiWpspin = () => {
    axios.post({
      data:{
        HYID:HYID.get_wifi_wpspin
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
          pinenable:res.huayi_r.pinenable,
          pincode:res.huayi_r.pincode,
        })
      }
    })
  };  
  
  /**模式三：恢复无线WPS的初始pin码*/  
  setWifiWpsFirstpin = () => {
    this.validator.hideMessages();
    axios.post({
      data:{
        HYID:HYID.set_wifi_wps_firstpin
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){      
        this.setState({
          mode3Visble:true,
          mode3word:this.WORD.resetPin
        })
        setTimeout(() => {
          this.getWifiWpspin()
          this.setState({
            //mode3Visble:false,
            mode3word:this.WORD.resetSuccess
          })
          setTimeout(() => {
            this.setState({
              mode3Visble:false,
            })
            return;
          }, 1000);
          return;
        }, res.progresstime*1000);
      }
    })
  };  
  
  /**模式三：生成无线WPS的随机pin码*/  
  setWifiWpsRandompin = () => {
    this.validator.hideMessages();
    axios.post({
      data:{
        HYID:HYID.set_wifi_wps_randompin
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){              
        this.setState({
          mode3Visble:true,
          mode3word:this.WORD.generatingPincode
        })
        setTimeout(() => {
          this.getWifiWpspin()
          this.setState({
            //mode3Visble:false,
            mode3word:this.WORD.generateSuccess
          })
          setTimeout(() => {
            this.setState({
              mode3Visble:false,
            })
            return;
          }, 1000);
          return;
        }, res.progresstime*1000);
      }
    })
  }; 
    
  /**模式三：设置无线WPS本地pin码开关*/  
  setWifiWpsOwnpin = (checked) => {
    axios.post({
      data:{
        HYID:HYID.set_wifi_wps_ownpin,
        enable:checked,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){                 
        this.setState({
          mode3Visble:true,
          mode3word:this.WORD.setting
        })
        setTimeout(() => {
          this.getWifiWpspin()
          this.setState({
            //mode3Visble:false,
            pinenable:checked,
            mode3word:this.WORD.settingSuccess
          })
          setTimeout(() => {
            this.setState({
              mode3Visble:false,
            })
            return;
          }, 1000);
          return;
        }, res.progresstime*1000);
      }
    })
  }; 
  handleSwitch= name => checked =>{    
    if(name ==='enable'){   
      this.setState({ [name]:checked });
      this.setWifiWps(checked)
    }
    if(name==='pinenable'){
      this.setWifiWpsOwnpin(checked)
    }
  }
  
  handleChange = name => event => {
    let value = event.target.value;
    this.setState({ [name]:value });
  };
  
handleRedirect=()=>{
  handleRedir(this.state.redir,this.state.redir_ip)
  this.setState({
    showProgress:false,
  })
}
  render(){
    const {enable,pinenable,wifienable,stapin,pincode,statusWord}=this.state;
    return (
      <div>
        <PageText 
          title={window.__('WLAN WPS')}
          msg={window.__('You can quickly connect to Wi-Fi using Wi-Fi protected setup (WPS).')}
          showHelp={true}
          helpmsg={window.__('To use WPS, you must ensure that:\n\
    1. Wi-Fi is already on.\n\
    2. Wi-Fi stealth has been disabled.\n\
    3. Safe mode is set to WPA2-PSK, WPA/WPA2-PSK or not encrypted.')}/>
          {
            wifienable===0?<div style={{width:380,margin:'85px auto auto'}}>
              <span>{window.__('WPS is temporarily unavailable, please make sure that:')}<br/>
              {window.__('1. Wi-Fi is on')}<br/>
              {window.__('2. Wi-Fi stealth has been disabled')}<br/>
              {window.__('3. Security mode is set to WPA2-PSK, WPA/WPA2-PSK or open')}<br/>
              </span>
            </div>:<>
              <FormGroup lable={window.__('WPS')}>
                <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
                checked={enable||false} onChange={this.handleSwitch('enable')}/>
              </FormGroup>
              {                
                enable===true?<>
                          
                  <PageText2 
                    title={window.__('Method 1')}
                    msg={window.__('Press the WPS button on the device, and click the PBC Connect button within 2 minutes to connect to Wi-Fi.')}/>
                    
                  <FormButton onClick={()=>this.setData(1)}>{window.__('PBC Connect')}</FormButton>

                  <PageText2 
                    title={window.__('Method 2')}
                    msg={window.__("Enter your personal device's PIN here and click CONNECT.")}/>
                    
                  <FormGroup lable=''>  
                    <input value={stapin||''} onChange={this.handleChange('stapin')}/>
                    <div className="tip-err">
                    {this.validator.message('stapin', stapin, 'required&&PINCode','',{
                      default: window.__('WPS PIN must be 4 or 8 digits.'),})}</div> 
                    {/*<div className='tip'>{window.__('Enter the PIN code generated by the device')}</div>*/}
                  </FormGroup>
                  
                  <FormButton onClick={()=>this.handleSetWifiWpsstapin(1)}>{window.__('Connect')}</FormButton>

                  <PageText2 
                    title={window.__('Method 3')}
                    msg={window.__("Enter the router's PIN on your personal device.")}/>

                  <FormGroup lable={window.__('PIN')}>
                    <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
                    checked={pinenable||false} onChange={this.handleSwitch('pinenable')}/>
                  </FormGroup>
                      {
                        pinenable===true?<>
                          <FormGroup lable={window.__("SIM's PIN")}>
                              <label>{pincode}</label>
                          </FormGroup>

                          <FormButton onClick={this.setWifiWpsFirstpin}>{window.__('Reset PIN')}</FormButton>
                          
                          <FormButton onClick={this.setWifiWpsRandompin}>{window.__('Generate PIN')}</FormButton>
                        </>:null
                      }
                  <div style={{height:88}}></div>
                </>:null
              }
        
          </>}
          
          <Modal
            style={{width:450,height:200,marginTop:100}}
            visible={this.state.mode3Visble}
            >          
            <div style={{marginTop:60,fontSize:15,textAlign:'center'}}>
              <span>{this.state.mode3word}</span> 
            </div>
          </Modal>

          <Modal
            style={{width:450,height:200,marginTop:100}}
            visible={this.state.mode12Visble}
            >          
            <div style={{marginTop:30,fontSize:15,textAlign:'center'}}>
              <span>{statusWord||window.__('Connectting...')}</span> 
            <br/>
            <button className='modal-confirm-btn'
              onClick={()=>this.setData(0)}>{window.__('Cancel')}</button>
       
            </div>
          </Modal>
          
        </div>
    );
  }
}


  