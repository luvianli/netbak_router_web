import React,{Component} from 'react';
import {FormGroup,FormButton,PageText} from '@/screens/components';
import {axios,HYID ,posturl} from '@/share';
import {Input,Spin} from 'antd';
import ReactValidator from '@/share/validator/index.js';
const { TextArea } = Input;

export default class WIFIBase extends Component {
  state={
    result:{},
    result_src:{},
    stopping:false,    
		//ping_detct:	0,//检测状态：0 未检测，1 正在检测 ，2 检测完成
		action_result:	""
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  
  componentDidMount(){
    this.getData()
  }
  componentWillUnmount(){
    clearInterval(this.timeInterval);
  }
  /**这是取结果的，里面置有定时器 */
  getData=()=>{    
    axios.post({
      data:{
        HYID:HYID.get_ping_detect_result
      },
      url:posturl
    }).then((res)=>{
        if(res.errcode === 2000){       
          if(res.huayi_r.ping_detct===1){        
            clearInterval(this.timeInterval);
            this.setState({        
              stopping:true,
              action_content:res.huayi_r.action_content
            })          
            this.timeInterval = setInterval(() => {
              this.getData()          
              this.setState({
                action_content:res.huayi_r.action_content
              })          
            }, 3000);
          }
          else if(res.huayi_r.ping_detct===2 ||res.huayi_r.ping_detct===0){
            clearInterval(this.timeInterval);
            this.setState({
              action_content:res.huayi_r.action_content,          
              stopping:false
            })
          }           
        }
    })
  }

  setStartPing=(values)=>{
    this.setState({
      stopping:true,
      action_content:	""
    })
    axios.post({
      data:{
        HYID:HYID.do_ping_detect,
        ...values,
      },
      url:posturl
    }).then((res)=>{          
        setTimeout(() => {
          this.getData()
        }, 3000);
    })      
  }

  setStopPing=()=>{
    this.setState({
      stopping:false
    })
    axios.post({
      data:{
        HYID:HYID.stop_ping_detect,
      },
      url:posturl
    }).then((res)=>{      
      clearInterval(this.timeInterval);
    })
  }
  
  handleChange = name => event => {
    this.setState({ 
      [name]:event.target.value
     });
  };
  
  handleTest=()=>{    
    if(this.validator.allValid()){
      const {dest_host_addr , start_host_addr,ping_num}=this.state;
      let values = {dest_host_addr , start_host_addr,ping_num};
      this.setStartPing(values);      
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  render(){  
    const {dest_host_addr , start_host_addr,ping_num,stopping}=this.state;
    return (
      <div>
        <PageText 
          title={window.__('Ping Detect')}/>

        <FormGroup lable={window.__('IP or Domain Name')}>
          <input value={dest_host_addr||''} onChange={this.handleChange('dest_host_addr')}/>    
          <div className="tip-err">
          {this.validator.message('dest_host_addr', dest_host_addr, 'required&&url&&max:63&&houtais','',{
            default:window.__('IP Or Domain Field Required!'),
            houtais:window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
            url: window.__('IP Or Domain Format Invalid,Valid Format Is xxx.yyy.zzz(such as baidu.com,www.baidu.com)!'),
            max: window.__('IP or Domain Name At Most 63 Characters!')
          })}</div>     
        </FormGroup>

        <FormGroup lable={window.__('Source IP Address')}>
          <input value={start_host_addr||''} onChange={this.handleChange('start_host_addr')}/> 
          <div className="tip-err">
          {this.validator.message('start_host_addr', start_host_addr, 'required&&max:63','',{
            default: window.__('Source IP Address Field Required!'),
            max: window.__('Source IP Address At Most 63 Characters!'),
          })}</div>   
        </FormGroup>

        <FormGroup lable={window.__('Ping Count')}>
          <input value={ping_num||''} onChange={this.handleChange('ping_num')}/> 
        <div className="tip-err">
        {this.validator.message('ping_num', ping_num, 'required&&range:1-100','',{
          default: window.__('Ping Count Field Required!'),
          range: window.__('Ping Count Range Is 1-100!'),
        })}</div>   
        </FormGroup>

        {stopping===false?
        <FormButton onClick={this.handleTest}>{window.__('Start Detect')}</FormButton>
        :<FormButton  style={{background:'#ff0000',color:'#fff'}} onClick={this.setStopPing}>{window.__('Stop Detect')}
         <Spin style={{marginLeft:10,color:'#fff'}}/></FormButton>
        }
        <div style={{height:30}}></div>
        <TextArea 
          style={{width:750}}
          //placeholder="本文本框显示ping检测结果！"
          value = {this.state.action_content}
          autoSize ={{ minRows: 12, maxRows: 22 }} 
        />
      </div>
    );
  }
}


  
