import React,{Component} from 'react';
import {FormGroup,FormButton,PageText,FormRadioCheck,FormPassword,Progress} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy,ipToNumber,deepCompare,handleRedir} from '@/share';
import {message,Select,Checkbox,Switch} from 'antd';
import ReactValidator from '@/share/validator/index.js';
const { Option } = Select;
/**PPTP Server 地址段不能跟L2TP Server地址段一样
 * Server Address可以写IP和域名
 * Server Address 与 PPTP Server 地址段不能冲突
 * xl2tp_enable为客户端开关，xl2tpd_enable为服务端开关：l2tp的服务器和客服端不能同时打开
*/
export default class LAN extends Component {
  state={
    result:{},
    result_src:{},
    showProgress: false,
    locktime: 0,
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
        HYID:HYID.get_xl2tpd_server_config
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
          let min=576,max=1492;
        if(res.huayi_r.proto=='dhcp'){
            this.setState({min:576,max:1492})
        }else if(res.huayi_r.proto=='pppoe'){
            this.setState({min:576,max:1436})
        }else if(res.huayi_r.proto=='static'){
            this.setState({min:576,max:1492})
        }
        this.setState({
            min,
            max,
            result:deepCopy(res.huayi_r),
            result_src:deepCopy(res.huayi_r)
        })
      }
    })
  };  
  setData=(values)=>{    
    axios.post({
      data:{
        HYID:HYID.set_xl2tpd_server_config,
        ...values,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        if(res.progresstime!= 0){
          this.setState({
            showProgress: res.progresstime!= 0,
            locktime: res.progresstime,
            redir:res.reconnection,
            redir_ip:res.reconnection_addr||'', 
          })
        }else{
          message.success(window.__('Success'))
          this.getData()
        }
      }
    })
  }
  
  handleChange = name => event => {
    let result = deepCopy(this.state.result);
    let value = event.target.value;
    result[name] = value;
    this.setState({ result });
  };
  
  handleSelect= name => value =>{    
    let result = deepCopy(this.state.result);
    result[name] = value;
    this.setState({ result });
  }
  
  handleSwitch= name => checked =>{
    let result = deepCopy(this.state.result);
    let {primary_dns,secondary_dns,ipsec_key,xl2tp_enable} = this.state.result_src;
    if(!checked && name==='dns_enable'){
        result.primary_dns = primary_dns;
        result.secondary_dns = secondary_dns;
    }
    if(!checked && name==='ipsec_enable'){
        result.ipsec_key = ipsec_key;
    }
    /**l2tp的服务器和客服端不能同时打开 */
    if(checked && xl2tp_enable && name==='xl2tpd_enable'){
      message.error(window.__("L2TP Work In Client Mode, Service Temporarily Unavailable!"))
      return false;
    }
    result[name] = checked;
    this.setState({ result });
  }
  
  setAdvanced = (e) => {
    if(!e.target.checked){
        if(this.validator.someValid(['mtu','mru'])){
            this.setState({
                checked_enable: e.target.checked
            })
        }else{
            this.validator.showMessages();
            this.forceUpdate();
        }
    }else{            
        this.setState({
            checked_enable: e.target.checked
        })
    }
  }
  handleSave=()=>{
    const {result,result_src} = this.state;
    /**关闭状态 */
    let validArr = ['xl2tpd_start_addr','xl2tpd_end_addr','server_addr'];
    if(this.state.result.ipsec_enable){
      validArr = validArr.concat(['ipsec_key']);
    }
    if(this.state.checked_enable){
      validArr = validArr.concat(['mtu','mru']);
      if(this.state.result.dns_enable){
        validArr = validArr.concat(['primary_dns','secondary_dns']);
      }
    } 
    /**校验并发送数据 */
    if(this.validator.someValid(validArr)){
      if(!result.xl2tpd_enable){
          let values = deepCopy(result_src);
          values.xl2tpd_enable = false;
          this.setData(values);
          return false;
      }
      /**数据不能与原来的相同 */
      if(deepCompare(result,result_src)){
          message.success(window.__('Data Up to Date'))
          return false;
      }
      /**起始IP不能大于结束IP */
      if(ipToNumber(result.xl2tpd_start_addr) > ipToNumber(result.xl2tpd_end_addr)){
          message.error(window.__("Start IP Cannot Be Greater Than End IP!"))
          return false;
      }
      /**PPTP Server 地址段不能跟L2TP Server地址段冲突*/
      if((ipToNumber(result.xl2tpd_start_addr) <= ipToNumber(result.pptpd_end_addr)&&
      ipToNumber(result.xl2tpd_start_addr) >= ipToNumber(result.pptpd_start_addr))||
      (ipToNumber(result.xl2tpd_end_addr) >= ipToNumber(result.pptpd_start_addr)&&
      ipToNumber(result.xl2tpd_end_addr) <= ipToNumber(result.pptpd_end_addr))){
          message.error(window.__("IP Ranage Conflict!"))
          return false;
      }
      /* Server Address 与 PPTP Server 不能在同一地址段 只判断C类*/
      if(((ipToNumber(result.server_addr) & ipToNumber('255.255.255.0') ) == 
      (ipToNumber(result.xl2tpd_start_addr) & ipToNumber('255.255.255.0'))) ||
      ((ipToNumber(result.server_addr) & ipToNumber('255.255.255.0') ) == 
      (ipToNumber(result.xl2tpd_end_addr) & ipToNumber('255.255.255.0')))){
          message.error(window.__("Remote Address And Server Address Cannot Be In The Same Network Segment!"))
          return false;
      }
      else{this.setData(result)};
    }else{
        this.validator.showMessages();
        this.forceUpdate();
    }
  }
  handleRedirect=()=>{
    handleRedir(this.state.redir,this.state.redir_ip)      
    this.setState({
      showProgress:false
    })
    window.location.reload()
  }

  render(){
    const {xl2tpd_enable,xl2tpd_start_addr,xl2tpd_end_addr,server_addr,ipsec_enable,ipsec_key,
        dns_enable,primary_dns,secondary_dns,mtu,mru} = this.state.result;
    const {min,max} = this.state;
    return (
      <div>
          
        <PageText 
          title={window.__('L2TP Server')}
          msg={window.__('')}/>
                       
        <FormGroup lable={window.__('L2TP Server Setting')}>
            <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={xl2tpd_enable} onChange={this.handleSwitch('xl2tpd_enable')}/>
        </FormGroup>
        
        <div style={{display:xl2tpd_enable?"block":"none"}}>
            <FormGroup lable={window.__('Start IP')}>
                <input value={xl2tpd_start_addr||''} onChange={this.handleChange('xl2tpd_start_addr')}/>
                <div className="tip-err">
                {this.validator.message('xl2tpd_start_addr', xl2tpd_start_addr, 'required&&ip','',{
                    default: window.__('Start IP Field Required!'),
                    ip: window.__('Start IP Format Invalid!'),})}</div>  
            </FormGroup>

            <FormGroup lable={window.__('End IP')}>
                <input value={xl2tpd_end_addr||''} onChange={this.handleChange('xl2tpd_end_addr')}/>
                <div className="tip-err">
                {this.validator.message('xl2tpd_end_addr', xl2tpd_end_addr, 'required&&ip','',{
                    default: window.__('End IP Field Required!'),
                    ip: window.__('End IP Format Invalid!'),})}</div>  
            </FormGroup>
            
            <FormGroup lable={window.__('Server Address')}>
                <input value={server_addr||''} onChange={this.handleChange('server_addr')}/>
                <div className="tip-err">
                {this.validator.message('server_addr', server_addr, 'required&&ip','',{
                    default: window.__('Server Address Field Required!'),
                    ip: window.__('Server Address Format Invalid!')
                    // ascii: window.__('Only Supports ASCII Code!'),
                    // max: window.__('Server Address At Most 63 Characters!')
                    })}</div>  
            </FormGroup>


            <FormGroup lable={window.__('IPsec')}>
              <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
              checked={ipsec_enable} onChange={this.handleSwitch('ipsec_enable')}/>
            </FormGroup>
          
            <div style={{display:ipsec_enable?"block":"none"}}>
            <FormPassword lable={window.__('Pre-Shared Key')}
              value ={ipsec_key||""}
              onChange={this.handleChange('ipsec_key')}>
            </FormPassword>             
            <div className="tip-err">
              {this.validator.message('ipsec_key', ipsec_key, 'required&&min:8&&max:63&&password','',{
                default: window.__('Pre-Shared Key Field Required!'), 
                min: window.__('Pre-Shared Key At Least 8 Characters!'),
                max: window.__('Pre-Shared Key At Most 63 Characters!'),
                password: window.__('Only Supports ASCII Code!')})}</div>
            </div>
            
            <FormRadioCheck>
            <Checkbox checked={this.state.checked_enable} onChange={this.setAdvanced}>
                {window.__('Advance')}
            </Checkbox>
            </FormRadioCheck>

            <div style={{display:this.state.checked_enable?"block":"none"}}>
            <FormGroup lable={window.__('DNS Server Setting')}>
                <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
                checked={dns_enable} onChange={this.handleSwitch('dns_enable')}/>
            </FormGroup>

            <div style={{display:dns_enable?"block":"none"}}>
            <FormGroup lable={window.__('Primary DNS')}>
                <input value={primary_dns||''} onChange={this.handleChange('primary_dns')}/>
                <div className="tip-err">
                {this.validator.message('primary_dns', primary_dns, 'required&&ip','',{
                default: window.__('Primary DNS Field Required!'),
                ip: window.__('Primary DNS Format Invalid!'),
                })}</div>  
            </FormGroup>

            <FormGroup lable={window.__('Secondary DNS')}>
                <input value={secondary_dns||''} onChange={this.handleChange('secondary_dns')}/>
                <div className="tip-err">
                {this.validator.message('secondary_dns', secondary_dns||'', 'ip','',{
                    default: window.__('Secondary DNS Field Required!'),
                    ip: window.__('Secondary DNS Format Invalid!'),})}</div>  
            </FormGroup>
            </div>
            <FormGroup lable={window.__('MTU')}>
                <input value={mtu||''} onChange={this.handleChange('mtu')}/>
                <div className="tip-err">
                {this.validator.message('mtu', mtu, `required&&range:${min}-${max}`,'',{
                default: window.__('MTU Field Required!'),
                range: window.__('MTU Range is ')+min+'-'+max+'!'})}</div>  
            </FormGroup>

            <FormGroup lable={window.__('MRU')}>
                <input value={mru||''} onChange={this.handleChange('mru')}/>
                <div className="tip-err">
                {this.validator.message('mru', mru, `required&&range:${min}-${max}`,'',{
                default: window.__('MRU Field Required!'),
                range: window.__('MRU Range is ')+min+'-'+max+'!'})}</div>  
            </FormGroup>
            </div>
        </div>
    
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


  