import React,{Component} from 'react';
import {FormGroup,FormButton,PageText} from '@/screens/components';
import TIME_ZONE from '@/share/timeZone';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import {message,Button,Select,Switch} from 'antd';
import ReactValidator from '@/share/validator/index.js';
import moment from 'moment';
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

    this.interval=setInterval(()=>{
      this.handleSysTime((this.state.time_day+1));
    },1000)
  }
  
  getData = () => {
    axios.post({
      data:{
        HYID:HYID.get_ntp_config
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        let [ntp_server1,ntp_server2,ntp_server3]=['','','']
        let ntp_server_arr = res.huayi_r.ntp_server_arr;
        [ntp_server1,ntp_server2,ntp_server3] = [...ntp_server_arr]
        this.setState({     
          result:deepCopy(res.huayi_r),
          result_src:deepCopy(res.huayi_r),
          time_day:res.huayi_r.time_day,
          show_time: moment(new Date(res.huayi_r.time_day*1000)).format('YYYY-MM-DD HH:mm:ss'),
          ntp_server1:ntp_server1||'',
          ntp_server2:ntp_server2||'',
          ntp_server3:ntp_server3||''
        })
      }
    })
  };  
  
  setData = (ntp_server_arr) => {
    const {ntp_admin,time_zone}=this.state.result
    let values = {ntp_server_arr,ntp_admin,time_zone}
    axios.post({
      data:{
        HYID:HYID.set_ntp_config,
        ...values
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        message.success(window.__('Success'));
        this.getData();
      }
    })
  };
  handleSysTime=(time_day)=>{
    this.setState({
      time_day,
      show_time: moment(new Date(time_day*1000)).format('YYYY-MM-DD HH:mm:ss')
    })
  }
 handleLocalTime=()=>{
  let browser_time_chuo = (new Date()).getTime();
  //接收的是时间戳，要发送时间格式
  let browser_time = moment(browser_time_chuo).format("YYYY-MM-DD HH:mm:ss");
  axios.post({
    data:{
      HYID:HYID.use_browser_time,
      current_time:browser_time
    },
    url:posturl
  }).then((res)=>{
      if(res.errcode === 2000){
        //将新的时间戳赋给系统时间，让它继续定时
        this.handleSysTime(browser_time_chuo/1000); 
        message.success(window.__('Success'));
      }
    })
  }

  handleChange = name => event => {
    this.setState({ [name] : event.target.value });
  };
  
  handleSelectSwitch= name => value =>{    
    let result = deepCopy(this.state.result);
    result[name] = value;
    this.setState({ result });
  }
  handleSave=()=>{
    const {result,result_src} = this.state;
    const {ntp_server1,ntp_server2,ntp_server3} = this.state;
    let ntp_server_arr = [ntp_server1,ntp_server2,ntp_server3]    
    if(result.ntp_admin===false){   
      if(result.ntp_admin===result_src.ntp_admin&&
        result.time_zone===result_src.time_zone){
        message.success(window.__('Data Up to Date'))
        return false
      }
      this.setData(this.state.result_src.ntp_server_arr)
      return;
    }
    if( this.validator.allValid()){
      if((result.ntp_admin===result_src.ntp_admin&&
          (JSON.stringify(ntp_server_arr) === JSON.stringify(this.state.result_src.ntp_server_arr)&&
          result.time_zone===result_src.time_zone))){
          message.success(window.__('Data Up to Date'))
        return false
      }else{        
        this.setData(ntp_server_arr)
      }
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  
  /**渲染select timezone 节点 */
  renderOptionTime=()=>{    
    return TIME_ZONE.map((item,index)=>{
      return (<Option value={item.value} key={item.value}> {item.label}</Option>)
    })
  }

  render(){    
    const {result:{ntp_admin,time_zone},show_time,
    ntp_server1,ntp_server2,ntp_server3} = this.state;
    return (
      <div>
        <PageText 
          title={window.__('NTP Setting')}
          msg={window.__('You can configure the parameters of system time.')}/>

      <FormGroup lable={window.__('Time of Day')}>          
          <input value={show_time||''} readOnly/>
      </FormGroup>

      <FormGroup>
        <Button type="primary"  onClick={this.handleLocalTime}>{window.__('Use Browser Time')} </Button>
      </FormGroup>
      
      <FormGroup lable={window.__('Time Zone')}>
              <Select 
                onChange={this.handleSelectSwitch('time_zone')}
                value={time_zone||'CST-8'}
              >
                {this.renderOptionTime()}
              </Select>
        <div className='tip'>{window.__('Select A Correct Local Time Zone.')}</div>
      </FormGroup>


      <FormGroup lable={window.__('Enable NTP Synchronization')}>
        <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={ntp_admin||false} onChange={this.handleSelectSwitch('ntp_admin')}/>
      
      </FormGroup>
      {ntp_admin===true?<>
      <FormGroup lable={window.__('NTP Server')+1}>
          <input value={ntp_server1||''} onChange={this.handleChange('ntp_server1')}/>
      </FormGroup>

      <FormGroup lable={window.__('NTP Server')+2}>
          <input value={ntp_server2||''} onChange={this.handleChange('ntp_server2')}/>
      </FormGroup>

      <FormGroup lable={window.__('NTP Server')+3}>
          <input value={ntp_server3||''} onChange={this.handleChange('ntp_server3')}/>
      </FormGroup>
        </>:null}
      <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>
      <div style={{height:30}}></div>
      </div>
    );
  }
}


  