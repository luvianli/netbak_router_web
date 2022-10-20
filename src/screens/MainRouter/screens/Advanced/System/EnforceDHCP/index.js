import React,{Component} from 'react';
import {FormGroup,FormButton,PageText,Progress} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy,handleRedir} from '@/share';
import {message,Switch} from 'antd';
import ReactValidator from '@/share/validator/index.js';

export default class EnforceDHCP extends Component {
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
        HYID:HYID.get_force_fix_dhcp
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
        HYID:HYID.set_force_fix_dhcp,
        ...result,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({
          redir: res.reconnection,
          redir_ip: res.reconnection_addr,
          showProgress: res.progresstime !== 0,
          locktime: res.progresstime
        })
      }
    })
  }
  
  handleSave=()=>{
    const {result,result_src} = this.state;
    if(result.fix_dhcp_admin===result_src.fix_dhcp_admin){
        message.success(window.__('Data Up to Date'));
        return;
      }
    this.setData()
  }
  handleSwitch= name => checked =>{
    let result = deepCopy(this.state.result);
    result[name] = checked;
    this.setState({ result });
  }
  handleRedirect=()=>{
    handleRedir(this.state.redir,this.state.redir_ip)
    this.setState({
      showProgress:false,
    })
    message.success(window.__('Success'))
    this.getData()
  }
  render(){
    const {result:{fix_dhcp_admin}} = this.state;
    return (
      <div>
        <PageText 
          title={window.__('Enforce DHCP')}/>

        <FormGroup  lable={window.__('Enforce DHCP Enable')}>     
          <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
          checked={fix_dhcp_admin}  onChange={this.handleSwitch("fix_dhcp_admin")}/>
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


  