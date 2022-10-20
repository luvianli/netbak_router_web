import {axios ,posturl} from '@/share';
import {getCookie,setCookie,clearCookie} from '@/share/cookies';

import * as ACTIONTYPE from './actionType';

export function setLoginStatus(loginStatus) {
  return {
      type: ACTIONTYPE.ACTION_SET_LOGIN_STATUS,
      payload: loginStatus,
  };
}

export function setFirstBoot(firstBoot) {
  return {
      type: ACTIONTYPE.ACTION_SET_FIRST_BOOT,
      payload: firstBoot,
  };
}

export function setLogin(data,isFirst) {
  return (dispatch, getState) => {
    axios.post({
      data:data,
      url:posturl
    })
    //.then(res => res.json())
    .then(res => {
      if(res.errcode === 2000){  
        // const cookie_value = getCookie('SESSION_ID');
        // setCookie('SESSION_ID',cookie_value)

        const pwd = getCookie('PSW');
        setCookie('PSW',pwd)

        dispatch(setLoginStatus(true));  

        localStorage.setItem("status", 2000);

        if(isFirst === 1){          
          window.location.hash="#/wiazrd"
        }else{          
          window.location.hash="#/Home"
        }
      }else if(res.errcode === 4000){
        console.error('password not correct')
        dispatch(setLoginStatus(false));
      }
    });
  };
}
