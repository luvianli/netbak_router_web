import React, { Component } from 'react'
import logo_img from '@/logo.png'
import { Select,Icon } from 'antd'
import Logout from '@/screens/common/Logout';
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
  }
  
  handleChange=(value)=>{    
    this.props.setLanguage(value);
  }
  render(){
    const {language,noLanguage,nobar} = this.props;
    return(  
    <header className='header3'>
        <div  className="logo-img">
          {this.props.logo&&<img src={logo_img} alt='logo'/>}
          
        </div>
        <div className="bar-right">
          {noLanguage===true?null:
            <Select value={language} className='language' onChange={this.handleChange}>
              {renderLanguage(['cn','en'])}
            </Select>
          }
          {noLanguage!==true && nobar!==true?
            <div className="bar"></div>
          :null}

          {this.props.nobar===true?null:
            <div className='bar-icon'>
              <Logout/>
            </div>
          }
        </div>
        

    </header>
  )}
}
  


const mapState = (state)=>({
  loginStatus:state.getIn(['common','loginStatus']),
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

