import React from 'react'
import { connect } from 'react-redux';
import axios from '@/share/axios';
import {actionCreater } from '@/screens/Login/store';
import {clearCookie} from '@/share/cookies';
import {HYID,posturl} from '@/share/HYID';
import { Icon } from 'antd';
import './common.less'

function Logout(props){    
    const handleLogout = function(){
            
        axios.post({
            data:{
                HYID:HYID.do_huayi_logout,
            },
            url:posturl
        })
        .then((res)=>{
            if(res.errcode === 2000){
                /**清除cookies */   
                props.setLoginStatus(false)
                clearCookie('PSW') 
                localStorage.setItem("status", 4001);
                window.location.reload();
            }
        })
    }
    return(
    <>
        <div className="common-icon-pc">
        <Icon title={window.__('Logout')} onClick={handleLogout} type="logout" />
        </div>

        <div className="common-icon-mobile" onClick={handleLogout}>
            <Icon title={window.__('Logout')} type="logout" />
            <span style={{marginLeft:'5px'}}>{window.__('Logout')}</span>
        </div>
    </>   
    )
}

const mapState = (state)=>({
    loginStatus:state.getIn(['login','loginStatus']),
    language:state.getIn(['common','language']),
})

const mapDispatch = (dispatch) =>({
    setLoginStatus(args){
        dispatch(actionCreater.setLoginStatus(args))
    }
})
export default connect(mapState,mapDispatch)(Logout)