import React,{Component} from 'react';
import {FormGroup,FormButton,PageText,FormPassword,FormLabel} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import {message,Select,Switch} from 'antd';
import ReactValidator from '@/share/validator/index.js';
const { Option } = Select;

export default class WIFIBase extends Component {
  state={
    result:{},
    result_src:{}
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
        HYID:HYID.get_ddns_config
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
  setData=(result={},checked=false)=>{    
    //let result  = deepCopy(this.state.result);
    if(checked!==null){
      result.ddns_admin = checked;
    }
    axios.post({
      data:{
        HYID:HYID.set_ddns_config,
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
    if(checked===false && name==='ddns_admin'){
      this.validator.hideMessages();
      this.setData(this.state.result_src,checked)
    }
  }
  
  handleSelect= name => value =>{    
    let result = deepCopy(this.state.result);
    result[name] = value;
    this.setState({ result });
  }
  
  handleSave=()=>{    
    let result = deepCopy(this.state.result)
    let result_src = deepCopy(this.state.result_src)
    if(this.validator.allValid()){
      if(result.ddns_admin===result_src.ddns_admin&&
        result.server_addr===result_src.server_addr&&
        result.domain_name===result_src.domain_name&&
        result.pwd===result_src.pwd&&
        result.usrname===result_src.usrname){        
          message.success(window.__('Data Up to Date'));
          return;
        }
      this.setData(result,true);
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  render(){    
    const {result:{ddns_admin,server_addr,domain_name,
      usrname,pwd,ddns_addr,ddns_state}} = this.state;
    return (
      <div>
        <PageText 
          title={window.__('DDNS Service')}
          msg={window.__('You can configure the dynamic DNS parameters to match your Dynamic WAN IP address with a static domain name,you can get account from server provider.')}/>
                    
        <FormGroup lable={window.__('DDNS Service')}>
            <Switch  checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={ddns_admin||false} onChange={this.handleSwitch('ddns_admin')}/>
        </FormGroup>
      {ddns_admin===true?<>
        <FormGroup lable={window.__('Server Provider')}>
          <Select value={server_addr||''} onChange={this.handleSelect('server_addr')}>
            <Option value={'3322.org'}>{window.__('www.3322.org')}</Option>
            <Option value={'oray.com'}>{window.__('www.oray.com')}</Option>
            <Option value={'dyndns.org'}>{window.__('dyndns')}</Option>
            <Option value={'no-ip.com'}>{window.__('no-ip')}</Option>
          </Select>
        </FormGroup>
        
        <FormLabel><a style={{color:'blue'}} href={server_addr==='3322.org'?'http://www.pubyun.com/accounts/signup/':
          server_addr==='oray.com'?'https://console.oray.com/passport/register.html':
          server_addr==='dyndns.org'?'https://dyn.com/dns/':
          server_addr==='no-ip.com'?'https://www.no-ip.com/newUser.php/':'javascript:void(0)'}
          target="blank"> {window.__('Go to Register')}
        </a></FormLabel>

        <FormGroup lable={window.__('Domain Name')}>
          <input value={domain_name||''} onChange={this.handleChange('domain_name')}/>          
        </FormGroup>
        <div className="tip-err">
          {this.validator.message('domain_name', domain_name, 'required&&min:1&&max:32&&password','',{
          default: window.__('Domain Name Field Required!'),    
          min: window.__('Domain Name At Least 1 Characters!'),
          max: window.__('Domain Name At Most 32 Characters!'),
          password: window.__('Only Supports ASCII Code!')
        })}</div>
          
        <FormGroup lable={window.__('User Name')}>
          <input value={usrname||''} onChange={this.handleChange('usrname')}/> 
        </FormGroup>
        <div className="tip-err">
        {this.validator.message('usrname', usrname, 'required&&min:1&&max:32&&password','',{
          default: window.__('User Name Field Required!'),    
          min: window.__('User Name At Least 1 Characters!'),
          max: window.__('User Name At Most 32 Characters!'),
          password: window.__('Only Supports ASCII Code!')
        })}</div>

        <FormPassword lable={window.__('Password')}
        value={pwd||''} 
        onChange={this.handleChange('pwd')}> 
        </FormPassword>        
        <div className="tip-err">
        {this.validator.message('pwd', pwd, 'required&&min:1&&max:32&&password','',{
          default: window.__('Password Field Required!'),    
          min: window.__('Password At Least 1 Characters!'),
          max: window.__('Password At Most 32 Characters!'),
          password: window.__('Only Supports ASCII Code!')
        })}</div>   
        
        
        <FormGroup lable={window.__("DDNS Status")}>
          <span>{window.__(ddns_state===0?"DDNS Bind Failed":
        ddns_state===1?"DDNS Bind Success":"DDNS Bind Failed")}</span>
        </FormGroup>
        <FormGroup lable={window.__("DDNS Information")}>
        <span>{window.__('Binding IP is')}{ddns_state===1?ddns_addr:"0.0.0.0"}</span>
        </FormGroup>
        
        <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>
          </>:null}

        <div style={{height:68}}/>
      </div>
    );
  }
}


  