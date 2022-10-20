import React,{Component} from 'react';
import {FormGroup,FormButton,PageText,FormRadioCheck} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import { message,Checkbox,Statistic,Input  } from 'antd';
import moment from 'moment';
import ReactValidator from '@/share/validator/index.js';
/**模式为1的时候 ：使用rectime，转换为时分
 * 模式为2时，使用weeks，hour，minute，全选时weeks=255,非全选时相加
 * remaining_time：剩余重启时间
 * time_of_day：系统时间
 */
const CheckboxGroup = Checkbox.Group;
const Countdown = Statistic.Countdown;

export default class ScheReboot extends Component {
  constructor(props){
      super(props)      
            
      this.plainOptions = [
        { label: window.__('Mon.'), value: 2 },
        { label: window.__('Tue.'), value: 4 },
        { label: window.__('Wed.'), value: 8 },
        { label: window.__('Thu.'), value: 16 },
        { label: window.__('Fri.'), value: 32 },
        { label: window.__('Sat.'), value: 64 },
        { label: window.__('Sun.'), value: 1 },
      ];
      this.state={
        result:{},
        result_src:{},
        checkedList:[]
      }  
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount(){
    this.getData();
    this.interval=setInterval(()=>{
      this.handleSysTime((this.state.time_of_day+1));
    },1000)
  }
  
  handleSysTime=(time_of_day)=>{
    this.setState({
      time_of_day,
      show_time: moment(new Date(time_of_day*1000)).format('YYYY-MM-DD HH:mm:ss')
    })
  }
  
  changeCheckList = (weeks) => {
    let checkedList=[];
    if(weeks === 255){     
        checkedList = [1,2,4,8,16,32,64];
    }else if(weeks === 0){         
      checkedList=[];
    }else{
        let weeksTo2 =weeks.toString(2).split(''); 
        let wlen = weeksTo2.length;
        let i=wlen-1,j=0;
        for(i=wlen-1;i>=0;i--){
            if(weeksTo2[i]==='1'){
              checkedList.push(Math.pow(2,j));
            }
            j++;
        }
    }
    return checkedList
}
  getData=()=>{    
    axios.post({
      data:{
        HYID:HYID.get_wifi_sche_config,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({
          result:deepCopy(res.huayi_r),
          result_src:deepCopy(res.huayi_r),
          time_of_day:res.huayi_r.time_of_day,          
          mode1_hour:Math.floor(res.huayi_r.rectime/3600),
          mode1_minute:Math.floor((res.huayi_r.rectime- (Math.floor(res.huayi_r.rectime/3600))*3600)/60),   
          remaining_time_tick:Date.now() + 1000 *res.huayi_r.remaining_time,
          show_time:moment(new Date(res.huayi_r.time_of_day*1000)).format('YYYY-MM-DD HH:mm:ss'),
          checkedList:this.changeCheckList(res.huayi_r.weeks),
          weeks:res.huayi_r.weeks,
          checkAll:res.huayi_r.weeks===255?true:false,
        })
      }
    })
  }
  
  setData=(values)=>{    
    axios.post({
      data:{
        HYID:HYID.set_wifi_sche_config,
        ...values
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){        
        message.success(window.__('Success'));
        window.location.reload();
      }
    })
  }
  
  onCheckChange=(checkedList)=>{ 
    let weeks = 0;
    checkedList.map((item,index)=>{
      weeks = weeks+item;
      /**看下weeks全选上的值是多少，然后给赋值为255 */
      if(weeks===127) weeks=255;
    })
    let checkAll= (checkedList.length === this.plainOptions.length);
    this.setState({
      weeks,
      checkAll,
      checkedList
    })
  }
  onCheckAllChange=(e)=>{
    let weeks = e.target.checked ?255:0;
    let plainOptions_value = this.plainOptions.map((item,index)=>{
      return item.value
    })
    let  checkedList= e.target.checked ? plainOptions_value : [];
    let  checkAll= e.target.checked;
    this.setState({
      weeks,
      checkedList,
      checkAll
    })
  }
  
  handleChangeState = name => event => {
    this.setState({ [name]:event.target.value });
  };
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
  
  handleCheck=event=>{
    this.setState({
      configflags:event.target.checked?1:0
    })
  }
  handleSave=()=>{
    const {result,result_src} = deepCopy(this.state);
    let values = {};
      if(result.enabled === result_src.enabled&&
        result.weeks===this.state.weeks&&
        Number(result.start_hour) === Number(result_src.start_hour) &&
        Number(result.start_minute) === Number(result_src.start_minute) &&        
        Number(result.end_hour) === Number(result_src.end_hour) &&
        Number(result.end_minute) === Number(result_src.end_minute) ){            
          message.success(window.__('Data Up to Date'))
          return false
      }
      
      if(result.enabled && this.state.weeks===0){        
        message.error(window.__('Select A Specific Week!'));
        return;
      }
      
      // if(result.enabled && (Number(result.start_hour) > Number(result.end_hour))){
      //   message.error(window.__('Start Time Is Earlier Than End Time!'));
      //   return false;
      // }
      if(result.enabled && (Number(result.start_hour) === Number(result.end_hour)&&
        Number(result.start_minute) === Number(result.end_minute))){
            message.error(window.__('Start Time And End Time Cannot Be The Same!'));
            return false;            
      }
      if( this.validator.allValid() ){
        values.enabled=result.enabled;
        values.weeks=this.state.weeks;
        values.start_hour=Number(result.start_hour);
        values.start_minute=Number(result.start_minute);
        values.end_hour=Number(result.end_hour);
        values.end_minute=Number(result.end_minute);
        this.setData(values);
      } else {
        this.validator.showMessages();
        this.forceUpdate();
    }
    

  }
  onChangeCheck =  e => {      
    let result = deepCopy(this.state.result);
    result.enabled = e.target.checked;
    this.setState({ result });
  }
  render(){    
    const {result:{enabled,start_hour,start_minute,end_hour,end_minute},
      remaining_time_tick,show_time,
      checkedList,checkAll
     } = this.state;
     const plainOptions = [
       { label: window.__('Mon.'), value: 2 },
       { label: window.__('Tue.'), value: 4 },
       { label: window.__('Wed.'), value: 8 },
       { label: window.__('Thu.'), value: 16 },
       { label: window.__('Fri.'), value: 32 },
       { label: window.__('Sat.'), value: 64 },
       { label: window.__('Sun.'), value: 1 },
     ];
    return (
      <div>
            <PageText 
            title={window.__('Wireless Schedule')}/>
            
            <FormRadioCheck lable={window.__('Wireless Schedule')}>
            <Checkbox
                onChange={this.onChangeCheck} 
                value={enabled} 
                checked={enabled}>
                    {window.__('Enable')}
            </Checkbox>
            </FormRadioCheck>
{enabled?<>
            <FormRadioCheck lable={window.__('Specified Day')} >
                <Checkbox onChange={this.onCheckAllChange} checked={checkAll}>
                    {window.__('All')}
                </Checkbox>
            </FormRadioCheck>

            <FormRadioCheck >
                <CheckboxGroup 
                    options={plainOptions} value={checkedList}  onChange={this.onCheckChange} />
            </FormRadioCheck>

            <FormGroup lable={window.__('Radio off at(xx:xx~yy:yy)')} >
            <input style={{width: 50,textAlign:'center',padding:0}} value={start_hour} onChange={this.handleChange('start_hour')}/>:
            <input style={{width: 50,textAlign:'center',padding:0}} value={start_minute} onChange={this.handleChange('start_minute')}/>~
            <input style={{width: 50,textAlign:'center',padding:0}} value={end_hour} onChange={this.handleChange('end_hour')}/>:
            <input style={{width: 50,textAlign:'center',padding:0}} value={end_minute} onChange={this.handleChange('end_minute')}/>
            <div className="tip-err">
            {this.validator.message('start_hour', start_hour, 'required&&range:0-23','',{
              default: window.__('Hour Field Required!'),
              range: window.__('Hour Range Is 0-23!'),
            })}</div> 

            <div className="tip-err">
            {this.validator.message('start_minute', start_minute, 'required&&range:0-59','',{
              default: window.__('Minute Field Required!'),
              range: window.__('Minute Range Is 0-59!'),
            })}</div> 

            <div className="tip-err">
            {this.validator.message('end_hour', end_hour, 'required&&range:0-23','',{
              default: window.__('Hour Field Required!'),
              range: window.__('Hour Range Is 0-23!'),
            })}</div> 
            
            <div className="tip-err">
            {this.validator.message('end_minute', end_minute, 'required&&range:0-59','',{
              default: window.__('Minute Field Required!'),
              range: window.__('Minute Range Is 0-59!'),
            })}</div> 
            </FormGroup>

            <FormGroup lable={window.__('Time of Day')}>
            <Input  value={show_time} readOnly/>
            </FormGroup>

            <FormGroup lable={window.__('Time Remaining')} >
            <div className='tip'>
                <Countdown valueStyle={{marginTop:-35}} value={remaining_time_tick} format={window.__("D [day] H [hour] m [min] s [sec]")}/>
            </div>
            </FormGroup>
          </>
  :null}
            <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>
      </div>
    );
  }
}


  