import React, { Component } from 'react'
import logo_img from '@/logo.png'
import { Select,Icon } from 'antd'
import {Progress,Modal} from '@/screens/components';
import {axios ,posturl,logout,handleRedir} from '@/share';
import {Spin} from 'antd';
import Reboot from '@/screens/common/Reboot';
import Logout from '@/screens/common/Logout';
import Mode from '@/screens/common/Mode';
import './index.less';
import {connect} from 'react-redux'
import {actionCreater } from '@/proconfig/store'

const { Option } = Select;
const local_support_language = {
  "cn":"简体中文", 
  "en":"English"
}

function renderLanguage (support_language){
  if(support_language===undefined) return;
  return support_language.map((item,index)=>{
    return(
      <Option key={index} value={item}>{local_support_language[item]}</Option>
    )
  })
}

class Header extends Component {
  state={
    showProgress:false,
    locktime:0,
    visible:false
  }
  
  handleChange=(value)=>{    
    this.props.setLanguage(value);
    this.setState({visible:true})
    setTimeout(() => {
      this.setState({visible:false})
    }, 3000);
  }
  handleRedirect=()=>{
    handleRedir(this.state.redir,this.state.redir_ip)
    this.setState({
      showProgress:false,
    })
  }
  render(){
    const {language,support_language,title} = this.props;
    return(  
    <header className='header header-bg'>
        <div className='header-content'>
          <div className='left'>
            <img src={logo_img} alt='logo'/>
            <span className="iconfont icon-caidan" onClick={this.props.handleNavIcon}></span>
          </div>
          <div className='bar-right'>
            <div>
            <Select value={language} className='language' onChange={this.handleChange}>
              {renderLanguage(['cn','en'])}
            </Select>
            {this.props.nobar===true?null:
            <div className='bar-icon'>
               
              <Logout/>
              <Reboot />
              {/* <Mode/> */}
            </div>}
            </div>
          </div>
        </div>
        
        <Modal
          style={{width:450,height:180,marginTop:20}}
          visible={this.state.visible}
          >          
          <div style={{marginTop:40,fontSize:15,textAlign:'center'}}>
            <Spin/><span style={{paddingLeft:10}}>{window.__('Loadding...')}</span> 
          </div>
        </Modal>

        <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Upgrading...Please Do Not Shut Down The Device,Completed After '/>

    </header>
  )}
}
  


const mapState = (state)=>({
  loginStatus:state.getIn(['login','loginStatus']),
  title:state.getIn(['common','title']),
  language:state.getIn(['common','language']),
  support_language:state.getIn(['common','support_language']),
})

const mapDispatch = (dispatch) =>({
  setLanguage(args){
      dispatch(actionCreater.setLanguage(args))
  },
})

export default connect(mapState,mapDispatch)(Header)

