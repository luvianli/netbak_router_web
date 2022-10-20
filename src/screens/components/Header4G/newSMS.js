import React,{Component} from 'react';
import {axios, smsurl, sms_HYID} from '@/share';
import noMsg from '@/img/sms_blue.png'
import newMsg from '@/img/sms_new_blue.gif'
import '../Header/index.less';
import {connect} from 'react-redux'
import {actionCreater } from '@/proconfig/store'

class NewSMS extends Component {
  state={
    messages_unread: 0
  }
  componentDidMount(){
    this.getNewMsg();
    this.interval=setInterval(()=>{
      if(this.props.canFresh){
        this.getNewMsg();
      }
    },1000*5)
  }
  getNewMsg = () => {
      axios.post({
        data:{
          HYID:sms_HYID.get_new_sms_state,
        },
        url:smsurl
      }).then((res)=>{
        if(res.errcode === 2000){
          this.setState({messages_unread: res.huayi_r.messages_unread})
        }
      })   
  }
  componentWillUnmount(){
    clearInterval(this.interval)
  }
  
  changeHash=(hash) =>{
    window.location.hash=hash;
    window.location.reload();
  }
  render(){
    const { messages_unread } = this.state
    return (
      <>
        {messages_unread>0?
          <img src={newMsg} title={window.__('SMS')} className="newMsg" onClick={()=>this.changeHash('SMS/Conversation')} alt="New News Unread"/> 
        :
          <img src={noMsg} title={window.__('SMS')} className="newMsg" onClick={()=>this.changeHash('SMS/Conversation')} alt="No news"/>
        }
      </>
    );
  }
}

const mapState = (state)=>({
  canFresh:state.getIn(['common','canFresh']),
})

export default connect(mapState,null)(NewSMS) 