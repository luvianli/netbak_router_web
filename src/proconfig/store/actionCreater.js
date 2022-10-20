
import axios from '@/share/axios';
import {posturl,HYID} from '@/share/HYID';
import {getCookie,setCookie,clearCookie} from '@/share/cookies';

import * as ACTIONTYPE from './actionType';

export function setLoginStatus(loginStatus) {
  return {
      type: ACTIONTYPE.ACTION_SET_LOGIN_STATUS,
      payload: loginStatus,
  };
}

export function setLang(lang) {
  return {
      type: ACTIONTYPE.ACTION_SET_LANG,
      payload: lang,
  };
}

export function setSupportLang(support_language) {
  return {
      type: ACTIONTYPE.ACTION_SET_SUPPORT_LANG,
      payload: support_language,
  };
}


export function setTitle(title) {
  return {
      type: ACTIONTYPE.ACTION_SET_TITLE,
      payload: title,
  };
}
export function setOpmode(opmode) {
  return {
      type: ACTIONTYPE.ACTION_SET_OPMODE,
      payload: opmode,
  };
}

export function setPrdy(prdy){
  return{
      type: ACTIONTYPE.ACTION_SET_PRDY,
      payload: prdy,
  }
}

export function setCompanyCopyright(company_copyright){
  return{
      type: ACTIONTYPE.ACTION_SET_COMPANY_COPYRIGHT,
      payload: company_copyright,
  }
}

export function getTitle() {
  return (dispatch, getState) => {
    axios.post({
      data:{
        HYID:HYID.get_pre_login_config,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode === 2000){        
        dispatch(setTitle(res.huayi_r.company_name));
        dispatch(setPrdy(res.huayi_r.randomname))
        dispatch(setCompanyCopyright(res.huayi_r.company_info))
        dispatch(setOpmode(res.huayi_r.sysmode));
        dispatch(setFirstBoot(res.huayi_r.first_boot));
        document.title = res.huayi_r.company_name;
        
        if(res.huayi_r.first_boot === 1){
          if(res.huayi_r.need_authorized=== 0){ 
            localStorage.setItem("status", 2000);         
            window.location.hash="#/wizard";
          }
          else if(res.huayi_r.need_authorized=== 1){          
            window.location.hash="#/Login";
          }
        }
      }
    })
  }
}

export function getLanguage() {
  return (dispatch, getState) => {

    axios.post({
      data:{
        HYID:HYID.get_language_config,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode === 2000){   
        dispatch(setSupportLang(res.huayi_r.support_language));
        dispatch(setLang(res.huayi_r.current_language));

        /*localStorage.setItem("language",res.huayi_r.language);
        window.language = res.huayi_r.language;
        window.support_language = res.huayi_r.support_language;
        this.setState({
          language:res.huayi_r.language,
          support_language:res.huayi_r.support_language
        })
        if(LANG !== res.huayi_r.language && 
          res.huayi_r.support_language[LANG]){
          window.location.reload();
        }*/
      }
    })
  }
}


export function setLanguage(language) {
  return (dispatch, getState) => {
    axios.post({
      data:{
        HYID:HYID.set_language_config,
        current_language:language
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode === 2000){   
        setTimeout(() => {
          dispatch(setLang(language));
        }, 3000);
      }
    })
  }
}


export function setFirstBoot(isFirst){
  return{
      type: ACTIONTYPE.ACTION_SET_FIRST_BOOT,
      payload: isFirst,
  }
}

export function setFresh(canFresh){
  return{
      type: ACTIONTYPE.ACTION_SET_FRESH,
      payload: canFresh,
  }
}

export function setIsHome(isHome){
  return{
      type: ACTIONTYPE.ACTION_SET_ISHOME,
      payload: isHome,
  }
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
        // const cookie_value = getCookie('PSW');
        setCookie('PSW',data.hy_userpwd)

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
