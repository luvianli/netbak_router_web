import React,{Component} from 'react';
import {FormGroup,FormButton,PageText,FormRadioCheck} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import { Select,message,Checkbox,Statistic,Input ,Form } from 'antd';
import moment from 'moment';
import ReactValidator from '@/share/validator/index.js';
/**模式为1的时候 ：使用rectime，转换为时分
 * 模式为2时，使用weeks，hour，minute，全选时weeks=255,非全选时相加
 * remaining：剩余重启时间
 * time_day：系统时间
 */
const Option = Select.Option;
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
        result:{sche_mode:0},
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
      this.handleSysTime((this.state.time_day+1));
    },1000)
  }
  
  handleSysTime=(time_day)=>{
    this.setState({
      time_day,
      show_time: moment(new Date(time_day*1000)).format('YYYY-MM-DD HH:mm:ss')
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
        HYID:HYID.get_sche_reboot_config,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({
          result:deepCopy(res.huayi_r),
          result_src:deepCopy(res.huayi_r),
          time_day:res.huayi_r.time_day,          
          mode1_hour:Math.floor(res.huayi_r.rectime/3600),
          mode1_minute:Math.floor((res.huayi_r.rectime- (Math.floor(res.huayi_r.rectime/3600))*3600)/60),   
          remaining_time_tick:Date.now() + 1000 *res.huayi_r.remaining,
          show_time:moment(new Date(res.huayi_r.time_day*1000)).format('YYYY-MM-DD HH:mm:ss'),
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
        HYID:HYID.set_sche_reboot_config,
        ...values
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){        
        message.success(window.__('Success'));
        this.getData();
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
    values.sche_mode = result.sche_mode;
    if(result.sche_mode===0){
      if(result.sche_mode===result_src.sche_mode){        
        message.success(window.__('Data Up to Date'))
        return false
      }
      this.setData(values);
      return;
    }else if(result.sche_mode===1){
      if( this.validator.someValid(['mode1_hour','mode1_minute']) ){
        let {mode1_hour,mode1_minute} = this.state;
        values.rectime = mode1_hour*3600 + mode1_minute*60;
        if(values.rectime<10*60){          
          message.error(window.__("Can't Be Less Than 10 Minutes!"));
          return;
        }
        if(result.sche_mode ===result_src.sche_mode&&
          result_src.rectime===values.rectime){      
          message.success(window.__('Data Up to Date'))
          return false
        }
        this.setData(values);          
      } else {
        this.validator.showMessages();
        this.forceUpdate();
      }
    }else if(result.sche_mode===2){
      if(this.state.weeks===0){        
        message.error(window.__('Select A Specific Week!'));
        return;
      }
      if(result.sche_mode ===result_src.sche_mode&&
        result.weeks===this.state.weeks&&
        result.hour===result_src.hour&&
        result.minute === result_src.minute){            
          message.success(window.__('Data Up to Date'))
          return false
        }
      if( this.validator.someValid(['hour','minute']) ){
        values.weeks=this.state.weeks;
        values.hour=Number(result.hour);
        values.minute=Number(result.minute);
        values.rectime=result.hour*3600 + result.minute*60;
        this.setData(values);
      } else {
        this.validator.showMessages();
        this.forceUpdate();
    }
    }

  }
  render(){    
    const {result:{sche_mode,hour,minute,remaining},
      mode1_hour,mode1_minute,remaining_time_tick,show_time,
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
          title={window.__('Schedule Reboot')}
          msg={window.__('You can make a  schedule for system reboot.')}/>
          
          <FormGroup lable={window.__('Mode')}>
            <Select
              defaultValue={0}
              value={sche_mode}
              onChange={this.handleSelect('sche_mode')}>
              <Option value={0}>{window.__('Disable')}</Option>
              <Option value={1}>{window.__('Remain Time')}</Option>
              <Option value={2}>{window.__('Specified Time')}</Option>
            </Select>
          </FormGroup>
          {
            sche_mode===1?
            <FormGroup lable={window.__('Set Remain Time(hour:min)')} >
            <div className="form-time">
                <input value={mode1_hour} onChange={this.handleChangeState('mode1_hour')}/>:
                
                <input value={mode1_minute} onChange={this.handleChangeState('mode1_minute')}/>
                
            </div>
                <div className="tip-err">
                {this.validator.message('mode1_hour', mode1_hour, 'required&&range:0-23','',{
                  default: window.__('Hour Field Required!'),
                  range: window.__('Hour Range Is 0-23!'),
                })}</div> 

                <div className="tip-err">
                {this.validator.message('mode1_minute', mode1_minute, 'required&&range:0-59','',{
                  default: window.__('Minute Field Required!'),
                  range: window.__('Minute Range Is 0-59!'),
                })}</div> 
              </FormGroup>
            :sche_mode===2?            
            <div>

            <FormRadioCheck lable={window.__('Specified Day')} >
                <Checkbox onChange={this.onCheckAllChange} checked={checkAll}>
                    {window.__('All')}
                </Checkbox>
            </FormRadioCheck>

            <FormRadioCheck>
                <CheckboxGroup 
                 options={plainOptions} value={checkedList}  onChange={this.onCheckChange} />
            </FormRadioCheck>
            
              <FormGroup lable={window.__('Set Clock(hour:min)')} >
                <div className="form-time">
                <input value={hour} onChange={this.handleChange('hour')}/>:
                
                <input value={minute} onChange={this.handleChange('minute')}/>
                </div>
                <div className="tip-err">
                {this.validator.message('hour', hour, 'required&&range:0-23','',{
                  default: window.__('Hour Field Required!'),
                  range: window.__('Hour Range Is 0-23!'),
                })}</div> 
                
                <div className="tip-err">
                {this.validator.message('minute', minute, 'required&&range:0-59','',{
                  default: window.__('Minute Field Required!'),
                  range: window.__('Minute Range Is 0-59!'),
                })}</div> 
              </FormGroup>
            </div>:null          
            }
            {sche_mode!==0?<>
              <FormGroup lable={window.__('Time of Day')}>
                <Input  value={show_time} readOnly/>
              </FormGroup>
              {
                remaining!==0?
              <FormGroup lable={window.__('Time Remaining')} >
                <div className='tip'>
                  <Countdown valueStyle={{marginTop:-35}} value={remaining_time_tick} format={window.__("D [day] H [hour] m [min] s [sec]")}/>
                </div>
              </FormGroup>:null
              }
            </>:null
            }
            <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>
      </div>
    );
  }
}


  