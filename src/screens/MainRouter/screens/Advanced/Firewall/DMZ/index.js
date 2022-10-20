import React,{Component} from 'react';
import {FormGroup,FormButton,PageText} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import {message,Checkbox, Switch} from 'antd';
import ReactValidator from '@/share/validator/index.js';

export default class WIFIBase extends Component {
  state={
    result:{},
    usr_ip:'',
    usr_mac:''

  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount(){
    this.getData();
    this.getUserInfo();
  }
  
  getData = () => {
    axios.post({
      data:{
        HYID:HYID.get_dmz_config
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
          result:deepCopy(res.huayi_r),
          result_src:deepCopy(res.huayi_r)
        })
      }
    })
  };  
  setData=(result={},checked=null)=>{    
    //let result  = deepCopy(this.state.result);
    if(checked!==null){
      result.dmz_admin = checked;
    }
    axios.post({
      data:{
        HYID:HYID.set_dmz_config,
        ...result,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        message.success(window.__('Success'));
        this.getData();
      }
    })
  }
  
  getUserInfo = () => {
    axios.post({
      data:{
        HYID:HYID.get_current_user_info
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
          usr_ip:res.huayi_r.usr_ip,
          usr_mac:res.huayi_r.usr_mac
        })
      }
    })
  };
  handleSave=()=>{    
    let result = deepCopy(this.state.result)
    let result_src = deepCopy(this.state.result_src)
    if(this.validator.allValid()){
      if(result.dmz_admin===result_src.dmz_admin&&
        result.dest_addr===result_src.dest_addr){          
          message.success(window.__('Data Up to Date'));
          return;
        }
      this.setData(result,true)
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  handleChange = name => event => {
    let result = deepCopy(this.state.result);
    let value = event.target.value;
    result[name] = value;
    this.setState({ result });
  };
  
  handleSwitch= name => checked =>{
    let result = deepCopy(this.state.result);
    result[name] = checked;
    this.setState({ result });
    if(checked===false && name ==='dmz_admin'){   
      this.setData(this.state.result_src,checked)
    }
  }
  changeHostIP=(event)=>{
    if(event.target.checked===true){
      let {result} = this.state;
      result.dest_addr=this.state.usr_ip;
      this.setState({
        result:result
      })
    }
    else{
      let {result,result_src} = this.state;
      result.dest_addr = result_src.dest_addr;      
      this.setState({
        result:result
      })
    }
  }
  
  render(){
    const {result:{dmz_admin,dest_addr},usr_ip} = this.state;
    return (
      <div>
        <PageText 
          title={window.__('DMZ Setting')}
          msg={window.__('You can configure a DMZ host, for internal host provide services on the internet.')}/>

        <FormGroup lable={window.__('DMZ Setting')}>
            <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={dmz_admin||false} onChange={this.handleSwitch('dmz_admin')}/>
        </FormGroup>
        {
          dmz_admin===true?
          <>
          <FormGroup lable={window.__('DMZ Host')}>
              <input value={dest_addr||''} onChange={this.handleChange('dest_addr')}/>
              <div className='tip' style={{marginTop:10}}>
                <label><Checkbox /*checked={dest_addr===usr_ip}*/ onChange={this.changeHostIP}/>
                  <span style={{marginLeft:10}}>{window.__('Current Access Device IP ')+usr_ip}</span>
                </label></div>
              <div className="tip-err">
              {this.validator.message('dest_addr', dest_addr, 'required&&ip','',{
                default:window.__('Host IP Address Field Required!'), 
                ip: window.__('Host IP Address Format Invalid!'),})}</div>  
          </FormGroup>

          <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>
          </>:null
        }
          
        
      </div>
    );
  }
}


  