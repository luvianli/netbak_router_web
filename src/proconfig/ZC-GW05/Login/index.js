import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {actionCreater } from '../../store';
import useWinSize from '@/screens/common/useWinSize';
import {HYID} from '@/share';
import JsEncrypt from 'jsencrypt';
import {message} from 'antd';
import md5 from "md5";

import Login from './Login/index';

const jse = new JsEncrypt();
jse.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDppUIZsbdDZlC61T4HiHhGvISt
2UW8Sx2DE7v65X2RqEZa9Pybhj0XbjFcWz0DwTsaXtijKL8zTmeGw2VkWcNAEZra
PWmm3LeaWO/F0gGJMMRT0MW1m0Wf04/vb0AcQEDCkNW0Ou7wBV57O0RK1LAEmZpf
LUaG8bYgtcMzdcur+wIDAQAB
-----END PUBLIC KEY-----`);
/*加密
let password1 = jse.encrypt('admin');
 *解密
let decrypted = jse.decrypt(password1);
*/

function LoginApp(props){

  const winSize = useWinSize();
  let winHight = winSize.height - 90;//头部和尾部的高度，有什么减去什么

  useEffect(() => {
      winHight = winSize.height - 90;   //头部和尾部的高度，有什么减去什么
      /* 这里是兼容没有登陆页时直接跳到快速设置页（SX 根本不可能没有登陆页（为空时密码默认为admin））
      if(Number(localStorage.getItem("status")) === 2000){      
        window.location.hash="#/wizard";
      }*/
  },[winSize.height])
  
  const clickLogin = function(password){
      if(password==''){
        message.error(window.__("Please Enter Your Password"))
        return
      }
      props.setLogin({
        hy_username:'admin',
        // hy_userpwd:jse.encrypt(password),
        hy_userpwd:md5(password),
        HYID:HYID.do_login_auth
      },props.isFirst);
  }
  
  const onInputKeyUp = function(events,password){
    //解决火狐浏览器不支持event事件的问题
    let e = events || window.event,
        char_code = e.charCode || e.keyCode;
    if (char_code === 13) {
      clickLogin(password);
    }
  }
  
  return(
    <div>
      <Login 
        winHight={winHight}
        clickLogin = {clickLogin}
        onInputKeyUp= {onInputKeyUp}
      />
    </div>
  )
  
}

const mapState = (state)=>({
  language:state.getIn(['common','language']),
  isFirst:state.getIn(['common','isFirst']),
})
const mapDispatch = (dispatch) =>({
  setLogin(data,isFirst){
      dispatch(actionCreater.setLogin(data,isFirst))
  }
})

export default connect(mapState,mapDispatch)(LoginApp)

