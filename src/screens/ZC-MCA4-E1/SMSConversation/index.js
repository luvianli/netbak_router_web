import React,{Component} from 'react';
import {PageText,Modal} from '@/screens/components';
import {axios,smsurl,sms_HYID,deepCopy} from '@/share';
import ReactValidator from '@/share/validator/index.js';
import {message,Spin,Icon,Checkbox} from 'antd';
import unread_img from '@/img/unread.png'
import './sms.less'

//const SMSLENGTH = 126;
const EN_LEN = 126;
const CN_LEN = 70;

export default class WIFIBase extends Component {
  state={
    loadingVisble:false,
    //remain:SMSLENGTH,
    show_remain:false,
    textinput:'commont',
    huayi_sms:[],
    sms_session:[],
    showalllist:true,
    shownewsms:false,
    checkAll:false,
    checkAllnot:true,//会话一个都没选
    sendNumber:'',
    noSelect:true,
    numberErr:false,
    sim_state:0,//0表示SIM卡异常  1表示SIM卡正常  2表示SIM卡锁住

  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  /*
  createNewsms=(e)=>{
    let str = e.target.value;
    let length = 0;
    for(let i=0;i<str.length;i++){          
      //if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) { 
      if (str.charCodeAt(i)>127 ) { 
        if(str.length>70){return false;}
        // 全角    
        length = 70;
        this.setState({
          num:70-str.length,
          length:70,
          textinput:70-str.length<0?'super':'commont'
        })
        break;  
      } else{  
          if(str.length>=70 && str.charCodeAt(i)>127 ){
            return false;
          }else{
            if(str.length>140){return false;}
            this.setState({
              num:140-str.length,
              length:140,
              textinput:140-str.length<0?'super':'commont'
            })
          }
      } 
    }
    if(str.length===0){      
      this.setState({num:140})
    }
    this.setState({message_content:e.target.value})
  }
*/

/*一个判断中英文混合的函数
  createNewsms=(e)=>{
    let str = e.target.value;
    var len=this.getLength(str);
    if (len > SMSLENGTH) {
      while(this.getLength(str=str.substr(0,str.length-1))>SMSLENGTH){};
      e.target.value=str;
      this.setState({
        remain: SMSLENGTH-this.getLength(str),
      }) 
    }
    this.setState({message_content:e.target.value})
  }
  getLength=(e)=>{//获取字符串的字节长度 
    let str=String(e);
    let len
    let chineselen = (str.match(/[^\x00-\xff]/g) ||"").length
    len = str.length+chineselen*2
    this.setState({remain: SMSLENGTH-len})
    return len;//加上匹配到的全角字符长度 
  }
*/

/**不含中文：长度126； 含中文：长度70 ；
 * 不含中文时，超70字符后不能再填中文*/
createNewsms=(e)=>{  
  var regC = /[^ -~]+/g;
  var regE = /\D+/g;
  let str = e.target.value;
  let chineselen = (str.match(/[^\x00-\xff]/g) ||"").length;
  if (regC.test(str)){
    this.setState({textMax: 70})
  }else{
    this.setState({textMax: 126})
  }
  if(str.length <= CN_LEN){
      this.setState({
        message_content:e.target.value,
        remain:CN_LEN - str.length,
        show_remain:CN_LEN - str.length <= 10 && chineselen > 0
      })
  }
  if(str.length >= CN_LEN && chineselen == 0 && str.length <= EN_LEN){
    this.setState({
      message_content:e.target.value,
      remain:EN_LEN - str.length,
      show_remain:EN_LEN - str.length <= 10
    })
  }
}


  createNewsmsNumber=(e)=>{    
    this.setState({
      sendNumber:e.target.value,
    },function(){
        if(this.validator.someValid(['sendNumber'])){
          this.setState({test:'blue',numberErr:false})
        }else {
          this.setState({test:'red',numberErr:true})
        }
      })
  }
  componentDidMount(){
    this.getData();
    /**定时获取数据 */
    this.intervalId = setInterval(() => {
      this.getData();
    }, 10000);
  }
  componentWillUnmount(){
    clearInterval(this.intervalId)
  }
  /**获取总的短信列表 */
  getData = () => {
    axios.post({
      data:{
        HYID:sms_HYID.get_breaf_sms_info
      },
      url:smsurl
    }).then((res)=>{
      if(res.errcode===2000){
        let huayi_sms = deepCopy(res.huayi_r.huayi_sms);
        huayi_sms.map((item,index)=>{
          item.checked = false;
          return item;
        })
        this.setState({     
          huayi_sms:huayi_sms,
          checkAll:false,
          checkAllnot:true,
        })
      }
    })
  };  
  /**获取单个号码的短信列表 */
  openSms = (phone_num) => {
    axios.post({
      data:{
        HYID:sms_HYID.get_sms_session_by_number,
        phone_num:phone_num
      },
      url:smsurl
    }).then((res)=>{
      if(res.errcode===2000){
        let sms_session = deepCopy(res.huayi_r.sms_session);
        sms_session.map((item,index)=>{
          item.checked = false;
          return item;
        })
        this.setState({    
          noSelect:true,
          sendNumber:phone_num,
          showonelist:true, 
          showalllist:false,shownewsms:false,
          sms_session:sms_session,
        })
      }
    })
  };  
  
  sendSmsMessages = (type) => {
    let sendNumber = this.state.sendNumber;
    if(this.state.numberErr===true || !this.state.sendNumber){
      message.error(window.__('Please Enter The Correct Contact!'));
      return;
    }
    if(!this.state.message_content){
      message.error(window.__('Input Information Field Required!'));
      return;
    }
    
    if(type==='more'){
      let arr = this.state.sendNumber.split(';')
      let newarr = [],errflag=false;
      arr.forEach((item,index)=>{
        if(item.length>0){
          newarr.push(item)
        }
        if(item.length>16){
          errflag = true;
        }
      })
      if(newarr.length===0||errflag){
        message.error(window.__('Please Enter The Correct Contact!'));
        return;
      }else{
        sendNumber = newarr.join(';')
      }
    }
    //开始转圈
    this.setState({loadingVisble:true,nomsg:true})
    axios.post({
      data:{
        HYID:sms_HYID.send_sms_messages,
        phone_num:sendNumber,
        message_content:this.state.message_content
      },
      url:smsurl
    }).then((res)=>{
      if(res.errcode===2000){
        //关闭转圈并且显示成功失败条数
        /*this.setState({
          nomsg:false,
          //send_count:res.huayi_r.send_count,
          //success_count:res.huayi_r.success_count,
          //fail_count:res.huayi_r.fail_count,
          //sim_state:res.huayi_r.sim_state,
        })*/
        if(res.huayi_r.sim_state === 0){
          this.setState({            
            nomsg:false,
            model_text:window.__("SIM Abnormal")
          })
        }else if(res.huayi_r.sim_state === 2){
          this.setState({            
            nomsg:false,
            model_text:window.__("SIM Locked")
          })
        }else if(res.huayi_r.sim_state === 1){
          if(res.huayi_r.success_count > 0){
            this.setState({            
              nomsg:false,
              model_text:window.__("Send Success")
            })
          }else{
            this.setState({            
              nomsg:false,
              model_text:window.__("Send Failed")
            })
          }
        }

        setTimeout(() => {
          this.setState({
            loadingVisble:false
          })
          return;
        }, 1200);

        if(type==='one'){
          //重新get phone_num信息
          this.openSms(this.state.sendNumber)
        }
        else if(type==='more'){
          //退出到总会话列表
          this.showCreateSms('showalllist')
        }
        this.setState({    
          //remain:SMSLENGTH, 
          show_remain:false,
          message_content:'',
          sendNumber:'',
          //textinput:'commont'
        })
      }
    })
  };  
  /**总会话列表选择 */
  changeSelect=(e,index)=>{
    let huayi_sms = this.state.huayi_sms;
    huayi_sms[index].checked = e.target.checked;    
    let checkAll = huayi_sms.every((item,index)=>{
      return item.checked===true
    })
    let checkAllnot = huayi_sms.every((item,index)=>{
      return item.checked===false
    })
    this.setState({
      huayi_sms,checkAll,checkAllnot
    })
  }
  
  /**总会话列表全选择 */
  changeSelectAll=(e,index)=>{
    let huayi_sms = this.state.huayi_sms;
    huayi_sms.map((item,index)=>{
      item.checked=e.target.checked
    })
    this.setState({
      huayi_sms,
      checkAll:e.target.checked,
      checkAllnot:!e.target.checked
    })
  }
  /**删除短信会话（总号码列表） */
  handleDeleteBreafSms=()=>{
    if(this.state.checkAllnot===true){return false;}
    let huayi_sms = this.state.huayi_sms;
    let arr = [];
    huayi_sms.forEach((item,index)=>{
      if(item.checked===true){
        arr.push(item.message_id)
      }
    })
    let str = arr.join(';')
    this.deleteBreafSms(str)
  }
  deleteBreafSms=(str)=>{
    axios.post({
      data:{
        HYID:sms_HYID.delete_sms_session_by_sid,
        message_id:str
      },
      url:smsurl
    }).then((res)=>{
      if(res.errcode===2000){
        message.success(window.__('Success'))
        this.getData();
      }
    })
  }
  
  /**单个号码列表选择 */
  onenumberSeleck=(index)=>{
    let sms_session = this.state.sms_session;
    sms_session[index].checked = !(sms_session[index].checked);    
    let noSelect = sms_session.every((item,index)=>{
      return item.checked===false
    })
    this.setState({
      sms_session,noSelect
    })
  }
  
  /**删除单个号码会话中选择的会话 */
  handleOneNumberSms=()=>{
    let sms_session = this.state.sms_session;
    let arr = [];
    if(this.state.noSelect===true){return false;}
    sms_session.forEach((item,index)=>{
      if(item.checked===true){
        arr.push(item.c_message_sid)
      }
    })
    let str = arr.join(';')
    this.deleteOneNumberSms(str)
  }
  
  deleteOneNumberSms=(str)=>{
    axios.post({
      data:{
        HYID:sms_HYID.delete_sms_by_cid,
        c_message_sid:str,
        phone_num:this.state.sendNumber
      },
      url:smsurl
    }).then((res)=>{
      if(res.errcode===2000){
        message.success(window.__('Success'))
        this.openSms(this.state.sendNumber);
      }
    })
  }
  renderAllnumber=(huayi_sms)=>{
    if(!huayi_sms) return;
    return huayi_sms.map((item,index)=>{
      return (
        <tr key={index}>
            <td onClick={()=>this.openSms(item.phone_num)}>
              {item.messages_unread>0?<img src={unread_img} alt={'unread'} className="unread"/>:<div className="read"></div>}
              {item.phone_num}</td>
            <td onClick={()=>this.openSms(item.phone_num)}><div className="text-over">{item.message_content}</div></td>
            <td onClick={()=>this.openSms(item.phone_num)}>{item.final_time}</td>
            <td ><Checkbox onChange={(e)=>this.changeSelect(e,index)} checked={item.checked}/></td>
        </tr>
      )
    })
  }
  renderOneNumber=(sms_session)=>{
    if(!sms_session) return;
    return sms_session.map((item,index)=>{
      return (
        <div key={index}>
          <div className='sms-date'><span>{item.receive_time}</span></div>
          {
            item.sms_src==="0"?
            <div className='sms-receive' onClick={()=>this.onenumberSeleck(index)}>
            <Checkbox className={this.state.noSelect===true?'hide':'showbox'} 
            checked={item.checked}/><span>{item.message_content}</span>
            </div>:
            <div className='sms-send' onClick={()=>this.onenumberSeleck(index)}>
            <span>{item.message_content}</span>
            <Checkbox checked={item.checked}
             className={this.state.noSelect===true?'hide':'showbox'}/>
            </div>
          }
        </div>
      )
    })
  }
  showCreateSms=(name)=>{
    switch(name){
      case 'shownewsms':
        this.setState({
          showalllist:false,
          shownewsms:true,
          showonelist:false,
          numberErr:false,
          test:'blue',
          sendNumber:'',
          message_content:'',/*remain:SMSLENGTH*/})
        break;
      case 'showalllist':
          this.getData();
          this.setState({
            showalllist:true,
            shownewsms:false,
            showonelist:false,
            numberErr:false,
            test:'blue',
            sendNumber:'',
            message_content:'',/*remain:SMSLENGTH*/})
        break;
      default:
        break;
    }
  }

  render(){
    /*let style={
      border:this.state.remain>this.state.length?'1Px solid red':''
    }*/
    return (
      <div>
        <PageText 
          title={window.__('SMS Conversation')}
          msg={window.__('You can create, delete SMS messages, delete contacts here. These messages are stored on your router. When has new message, the message icon will flash.')}
          showHelp={true}
          helpmsg={window.__('The Number At Most 16 Digits!')}/>
          <div style={{height:33}}></div>
          {/**总短信列表-------------------------------------------------- */}
          <div className={this.state.showalllist===true?'sms show':'hide'}>
	          <div className="head">  
              <div><Icon type="delete" onClick={this.handleDeleteBreafSms} className={this.state.checkAllnot?'disabled':''}/>
                <Icon type="plus" onClick={()=>this.showCreateSms('shownewsms')}/></div>
            </div>  
            <div className="content">
            <table>
                <thead>
                  <tr><td style={{paddingLeft: 25}}>{window.__('Contact')}</td><td>{window.__('Information')}</td><td>{window.__('Date')}</td>
                  <td> <Checkbox onChange={this.changeSelectAll} checked={this.state.checkAll}/></td></tr>
                </thead>
                <tbody>
                  {this.renderAllnumber(this.state.huayi_sms)}                  
                </tbody>
            </table>
            </div>
            <div className="foot"></div>  
          </div>
          
          {/**单个号码的短信列表-------------------------------------------------- */}
          <div className={this.state.showonelist===true?'sms-sigal show':'hide'}>
	          <div className="head">  
              <div>
                <Icon type="arrow-left"  onClick={()=>this.showCreateSms('showalllist')}/>
                <input disabled value={this.state.sendNumber}/>
                {/*<Icon type="share-alt" />*/}
                <Icon type="delete" onClick={this.handleOneNumberSms} className={this.state.noSelect?'disabled':''}/>
              </div>
            </div>  
            <div className="content">
              {this.renderOneNumber(this.state.sms_session)}
            </div>            
            <div className="foot">
              <div className='foot-head'>
                {this.state.show_remain?window.__('Inputable:')+this.state.remain:""} 
                <Icon type="arrow-right" onClick={()=>this.sendSmsMessages('one')} />
              </div>
              <div className='foot-content'><textarea className={this.state.textinput} maxLength={this.state.textMax} onChange={this.createNewsms} value={this.state.message_content}/></div>
            </div>  
          </div>
          
          
          {/**创建新的短信-------------------------------------------------- */}
          <div className={this.state.shownewsms===true?'sms-sigal show':'hide'}>
	          <div className="head">  
              <div>
                <Icon type="arrow-left"  onClick={()=>this.showCreateSms('showalllist')}/>
                <input className={this.state.test} value={this.state.sendNumber}  onChange={this.createNewsmsNumber} placeholder={window.__('Contact Format')}/>
              </div>
            {this.validator.message('sendNumber', this.state.sendNumber, 'smsnumber&&max:16','')}
              
            </div>  
            <div className="content" style={{height:213}}>
            </div>
            <div className="foot">
              <div className='foot-head'>
                {this.state.show_remain?window.__('Inputable:')+this.state.remain:""}  
                <Icon type="arrow-right" onClick={()=>this.sendSmsMessages('more')} />
              </div>
              <div className='foot-content'><textarea className={this.state.textinput} maxLength={this.state.textMax} onChange={this.createNewsms} value={this.state.message_content}/></div>
            </div>  
          </div>
          
          <div style={{height:33}}></div>

          
        <Modal
          style={{width:450,height:200,marginTop:100}}
          visible={this.state.loadingVisble}
          >          
          <div style={{marginTop:60,fontSize:15,textAlign:'center'}}>
            {this.state.nomsg?<><Spin/><span style={{paddingLeft:10}}>{window.__('Loadding...')}</span> </>
            :this.state.model_text//this.state.success_count>0?window.__('Send Success'):window.__('Send Failed')
            }
          </div>
        </Modal>
      </div>
    );
  }
}


  
