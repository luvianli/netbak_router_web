import React,{Component} from 'react';
import {FormGroup,FormButton,PageText,Progress,FormPassword} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy,handleRedir} from '@/share';
import {message,Icon,Select,Spin} from 'antd';
import ReactValidator from '@/share/validator/index.js';
import {connect} from 'react-redux'
const { Option } = Select;

class Proto extends Component {
  state={
    result:{dns_arr:[]},
    result_src:{},
    showProgress:false,
    locktime:0,
    opmode:this.props.opmode,
    wan_proto :this.props.wan_proto,
    loadingVisble:false,
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount(){
    // this.getData();
    this.getStaticData()
  }
  
  handleLoading=(enabled)=>{
    this.setState({
      loadingVisble:enabled
    })
  }
  getData = () => {
    axios.post({
      data:{
        // HYID:HYID.get_quick_setting_config
        HYID:HYID.get_gateway_mode_config
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        let result = deepCopy(res.huayi_r);
        if(res.huayi_r.wan_proto===0){//静态
          result.proto='static';
          result.dns_arr = result.dns_arr?result.dns_arr:new Array(2);
        }else if(res.huayi_r.wan_proto===1){//PPPOE
          result.proto='pppoe';
          result.dns_arr = result.dns_arr?result.dns_arr:new Array(2);
        }else if(res.huayi_r.wan_proto===2){//DHCP
          result.proto='dhcp'
          result.dns_arr = result.dns_arr?result.dns_arr:new Array(2);
        }
        this.setState({     
          link:res.huayi_r.link,
          wan_proto:res.huayi_r.wan_proto,
          result:deepCopy(result),
          result_src:deepCopy(result)
        })
      }
    })
  }; 
  getStaticData = () => {
    axios.post({
      data:{
        HYID:HYID.get_wan_modeinfo
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        let staticData={
          proto: res.huayi_r.proto,
          ip_addr: res.huayi_r.ip_addr,
          subnet_mask: res.huayi_r.subnet_mask,
          gateway: res.huayi_r.gateway,
          dns_arr: res.huayi_r.dns_arr?res.huayi_r.dns_arr:new Array(2),
          usr: res.huayi_r.usr,
          pwd: res.huayi_r.pwd,
          ac: res.huayi_r.ac,
          service: res.huayi_r.service,
          host_name: res.huayi_r.host_name,
        }
        let result = this.state.result
        result = {...result,...staticData}
        this.setState({
          result,
          result_src: result
          // result_src:deepCopy(result)
        })
      }
    })
  }; 
  setData=(values)=>{    
    axios.post({
      data:{
        HYID:HYID.set_sysmode_D3,
        sysmode:0,
        ...values,
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
        if(res.progresstime === 0){
          this.props.setOpmode(this.props.opmode)
        }
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
    if(name==='proto') {
        this.validator.hideMessages();
    }
    /*if(name==='macaddr'){      
      result.macaddr=value.toUpperCase();
    }*/
    this.setState({ result });
  };
  handleSelect= name => value =>{    
    let result = deepCopy(this.state.result);
    result[name] = value;
    this.setState({ result });
    this.validator.hideMessages();
  }
  handleRedirect=()=>{
    handleRedir(this.state.redir,this.state.redir_ip)
    this.setState({
      showProgress:false,
    })
    if(this.state.redir_ip === ''){
      this.props.setOpmode(this.props.opmode)
    }
  }
  
  handleSave=()=>{
    let result = deepCopy(this.state.result);
    let result_src = deepCopy(this.state.result_src);
    let values = {}
    if(result.proto === 'dhcp'){
        if( this.validator.someValid(['host_name'/*,'macaddr','cc_mtu'*/]) ){
            if(this.props.src_opmode===0&&result_src.proto === result.proto&&
                result_src.host_name === result.host_name){
                message.success(window.__('Data Up to Date'))     
                return;
            }
            values = {
                proto : 'dhcp',
                host_name :result.host_name,
                //cc_mtu:result.cc_mtu,
                //macaddr:result.macaddr.toUpperCase(),
            }
            this.setData(values)            
        } else {
            this.validator.showMessages();
            this.forceUpdate();
          }
    }else if(result.proto === 'static'){
        if( this.validator.someValid(['ip_addr','subnet_mask','gateway','dns0','dns1',/*'macaddr','cc_mtu'*/]) ){
          if(result.dns_arr[0]===result.dns_arr[1]){
            
            message.error(window.__('DNS1 Can Not Same As DNS2!'))     
            return;
          } 
          if(this.props.src_opmode===0&&result_src.proto === result.proto&&
                result_src.ip_addr === result.ip_addr&&
                result_src.subnet_mask === result.subnet_mask&&
                result_src.gateway === result.gateway&&
                result_src.dns_arr[0]=== result.dns_arr[0]&&
                result_src.dns_arr[1]=== result.dns_arr[1]){
                  message.success(window.__('Data Up to Date'))     
                    return;
            }
            values = {
                //wan_type:result.wan_type,
                proto : 'static',
                ip_addr :result.ip_addr,
                subnet_mask :result.subnet_mask,
                gateway :result.gateway,
                dns_arr :result.dns_arr,
                /*macaddr:result.macaddr,
                cc_mtu:result.cc_mtu,*/
            }
            this.setData(values)
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }else if(result.proto === 'pppoe'){
        if( this.validator.someValid(['usr','pwd','service',/*'ac','ppp_mtu','macaddr'*/]) ){
            if(this.props.src_opmode===0&&result_src.proto === result.proto&&
                result_src.usr === result.usr&&
                result_src.pwd === result.pwd&&
                result_src.service === result.service&&
                result_src.ac === result.ac){
                message.success(window.__('Data Up to Date'))     
                return;
            }
            values = {
                proto : 'pppoe',
                usr :result.usr,
                pwd :result.pwd,
                ac :result.ac || '',
                service :result.service || '',
                /*ppp_mtu:result.ppp_mtu,
                ac :result.ac,
                macaddr:result.macaddr,*/
            }
            this.setData(values)
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }
  }

  doWanProtoDetect=()=>{
    this.handleLoading(true);
    axios.post({
        data:{
          HYID:HYID.do_wan_proto_detect,
        },
        url:posturl
      }).then((res)=>{
          if(res.errcode === 2000){   
              this.handleLoading(false);
              /**注意， 这里是浅拷贝，不用setState也改变了原promsg的值 */
              let result = this.state.result
              if(res.huayi_r.wan_proto===0){
                result.proto='static'
              }else if(res.huayi_r.wan_proto===1){
                result.proto='pppoe'
              }else if(res.huayi_r.wan_proto===2){
                result.proto='dhcp'
              }
              
              this.setState({
                link:res.huayi_r.link,
                wan_proto:res.huayi_r.wan_proto,
              })
        } 
    })
}
  render(){
    const {loadingVisble,link,wan_proto,result:{proto,ip_addr,subnet_mask,gateway,dns_arr,usr,pwd,ac,
      service,host_name,macaddr,def_macaddr,ppp_mtu,cc_mtu}} = this.state;

    return (
      <div>
        
          <FormGroup lable={window.__('Internet Access Mode')}>
            <Select value={proto ||''} onChange={this.handleSelect('proto')}>
              <Option value={'static'}>{window.__('STATIC')}</Option>
              <Option value={'dhcp'}>{window.__('DHCP')}</Option>
              <Option value={'pppoe'}>{window.__('PPPOE')}</Option>
            </Select>
          </FormGroup>
          
    {/* <div className='tip'>      
    {link===0?window.__('Cable Unplugged'):
        `${window.__('Propose Mode:')}${wan_proto===0?'STATIC':
        wan_proto===1?'PPPOE':
        wan_proto===2?'DHCP':
        wan_proto===3?'WISP':'STATIC' }`
    }
    </div>
    
          {loadingVisble===true?
            <div className="scan-loading">
              <button disabled={link===0} className="scanbtn_wiz" onClick={this.doWanProtoDetect}>{window.__('Redetect')}</button>
              <Spin/>
            <div className="overlay"></div>
            </div>
            :
            <button disabled={link===0} className="scanbtn_wiz" onClick={this.doWanProtoDetect}>{window.__('Redetect')}</button>
          } */}
          {
            proto==='dhcp'?<>            
              <FormGroup lable={window.__('Host Name')}>
                  <input value={host_name||''} onChange={this.handleChange('host_name')}/>
              </FormGroup>
              <div className="tip-err">
              {this.validator.message('host_name', host_name, 'houtais&&ascii&&max:32','',{            
                  default: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                  max: window.__('Host Name At Most 32 Characters!'),
                  ascii:window.__('Only Supports ASCII Code!'),
              })}</div>   

              {/*<FormGroup lable={window.__('MTU')}>
                  <input disabled={internet_type!==1} value={cc_mtu||''} onChange={this.handleChange('cc_mtu')}/>
                  <div className="tip-err">
                  {this.validator.message('cc_mtu', cc_mtu, 'required&&range:576-1500','',{
                      default: window.__('Range')+'576-1500',})}</div>  
                  </FormGroup>*/}
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
                  <input value={dns_arr.length>0?dns_arr[0]:''} onChange={this.handleChange('dns0')}/>
                  <div className="tip-err">
                  {this.validator.message('dns0', dns_arr[0], 'required&&ip','',{
                  default: window.__('DNS1 Field Required!'),
                  ip: window.__('DNS1 Format Invalid!'),
                })}</div>  
              </FormGroup>

              <FormGroup lable={window.__('DNS2')}>
                  <input value={dns_arr.length>1?dns_arr[1]:''} onChange={this.handleChange('dns1')}/>
                  <div className="tip-err">
                  {this.validator.message('dns1', dns_arr[1]||'', 'ip','',{
                    default: window.__('DNS2 Field Required!'),
                    ip: window.__('DNS2 Format Invalid!'),})}</div>  
              </FormGroup>

              {/*<FormGroup lable={window.__('MTU')}>
                  <input disabled={internet_type!==1} value={cc_mtu||''} onChange={this.handleChange('cc_mtu')}/>
                  <div className="tip-err">
                  {this.validator.message('cc_mtu', cc_mtu, 'required&&range:576-1500','',{
                    default: window.__('MTU Field Required!'),
                    range: window.__('MTU Range Is 576-1500!')}</div>  
                  </FormGroup>*/}
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
              {this.validator.message('pwd', pwd, 'required&&max:128&&min:1&&ascii','',{            
                 default: window.__('Password Field Required!'),           
                //  houtais: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                 ascii: window.__('Only Supports ASCII Code!'),
                 min: window.__('Password At Least 1 Character!'),
                 max: window.__('Password At Most 128 Characters!'),  })}</div>                

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

              {/*<FormGroup lable={window.__('AC')}>
                  <input disabled={internet_type!==1} value={ac||''} placeholder={window.__("AUTO Leave Blank To Auto Detect")}
                   onChange={this.handleChange('ac')}/>
              </FormGroup>
              <div className="tip-err">
              {this.validator.message('ac', ac, 'houtais','',{            
                  default: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),})}</div>   

              <FormGroup lable={window.__('MTU')}>
                  <input disabled={internet_type!==1} value={ppp_mtu||''} onChange={this.handleChange('ppp_mtu')}/>
                  <div className="tip-err">
                  {this.validator.message('ppp_mtu', ppp_mtu, 'required&&range:576-1492','',{
                      default: window.__('MTU Field Required!'),
                      range: window.__('MTU Range Is 576-1492!')}</div>  
                  </FormGroup>*/}
            </>:null
          }
{/*
          <FormGroup lable={window.__('MAC Address')}>
              <input value={macaddr||''}  disabled={macaddr===def_macaddr || internet_type!==1} onChange={this.handleChange('macaddr')}/>
              <div className='tip' style={{marginTop:10}}>
                <label><Checkbox  disabled={internet_type!==1} checked={macaddr!==def_macaddr} onChange={this.changeCloneMac}/>
                  <span style={{marginLeft:10}}>{window.__('Clone MAC Address')}</span>
                </label></div>
              <div className="tip-err">
              {this.validator.message('macaddr', macaddr, 'required&&mac','',{
                default: window.__('MAC Address Field Required!'),
                  mac: window.__('Valid Format Is XX:XX:XX:XX:XX:XX!')})}</div>  
          </FormGroup>
              */}
    
          <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>
        
          <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Configuring...Please Do Not Shut Down The Device,Completed After '/>

        <div className='leave_blank'></div>
      </div>
    );
  }
}


  
//为了获取opmode
const mapState = (state)=>({
  language:state.getIn(['common','language']),
  opmode:state.getIn(['common','opmode']),
})

export default connect(mapState,null)(Proto)

