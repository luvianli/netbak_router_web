import React,{Component} from 'react';
import {FormGroup,FormButton,PageText,Progress} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy,handleRedir} from '@/share';
import {message} from 'antd';
import ReactValidator from '@/share/validator/index.js';

export default class LAN extends Component {
  state={
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
  
  getData = () => {
    axios.post({
      data:{
        HYID:HYID.get_lan_config
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
  setData=()=>{    
    const {result} = this.state;
    axios.post({
      data:{
        HYID:HYID.set_lan_config,
        ...result,
      },
      url:posturl
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
  
  handleSave=()=>{    
    if(this.validator.allValid()){
      const {result,result_src} = this.state;
      if(result.ip_addr===result_src.ip_addr&&
        result.subnet_mask===result_src.subnet_mask){
          message.success(window.__('Data Up to Date'));
          return;
        }
      this.setData()
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
  
  handleRedirect=()=>{
    handleRedir(this.state.redir,this.state.redir_ip)
    this.setState({
      showProgress:false,
    })
  }
  render(){
    const {result:{ip_addr,subnet_mask}} = this.state;
    return (
      <div>

          <FormGroup lable={window.__('IP Address')}>
              <input value={ip_addr||''} onChange={this.handleChange('ip_addr')}/>
              <div className="tip-err">
              {this.validator.message('ip_addr', ip_addr, 'required&&ip','',{
                default: window.__('IP Address Field Required!'),
                ip: window.__('IP Address Format Invalid!'),})}</div>  
          </FormGroup>

          <FormGroup lable={window.__('Subnet Mask')}>
              <input value={subnet_mask||''} onChange={this.handleChange('subnet_mask')}/>
              <div className='tip' >{window.__('Note: Changing The Subnet Mask Will Affect The Range Of The DHCP Address Pool!')}</div>
              <div className="tip-err">
              {this.validator.message('subnet_mask', subnet_mask, 'required&&netmask','',{
                default: window.__('Subnet Mask Field Required!'),
                netmask: window.__('Subnet Mask Format Invalid!')})}</div>  
          </FormGroup>

          <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>
        
          <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Configuring...Please Do Not Shut Down The Device,Completed After '/>

      </div>
    );
  }
}


  