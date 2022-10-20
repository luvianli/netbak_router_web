import {fromJS} from 'immutable'
import * as ACTIONTYPE from './actionType';

const defaultState = fromJS({
    loginStatus:false,
    title:'',
    language:'en',
    support_language:{        
        en:'en',
        cn:'cn',
        es:'es',
        pt:'pt',
    },
    opmode:1,//默认非路由模式，解决菜单闪的问题
    prdy: 0,
    company_copyright: '',
    isFirst: -1,
    canFresh: true,//为了解决短信输入中，页面刷新问题
    isHome: false,//为了解决首页不显示内容边框的问题
})

export default (state = defaultState , action)=>{
    const { type, payload } = action;
    switch(type){
        case ACTIONTYPE.ACTION_SET_LOGIN_STATUS:
            return state.set('loginStatus',payload)
        case ACTIONTYPE.ACTION_SET_LANG:
            return state.set('language',payload)
        case ACTIONTYPE.ACTION_SET_SUPPORT_LANG:
            return state.set('support_language',payload)
        case ACTIONTYPE.ACTION_SET_TITLE:
            return state.set('title',payload)
        case ACTIONTYPE.ACTION_SET_OPMODE:
            return state.set('opmode',payload)
        case ACTIONTYPE.ACTION_SET_PRDY:
            return state.set('prdy',payload)
        case ACTIONTYPE.ACTION_SET_COMPANY_COPYRIGHT:
            return state.set('company_copyright',payload)
        case ACTIONTYPE.ACTION_SET_FIRST_BOOT:
            return state.set('isFirst',payload)
        case ACTIONTYPE.ACTION_SET_FRESH:
            return state.set('canFresh',payload)
        case ACTIONTYPE.ACTION_SET_ISHOME:
            return state.set('isHome',payload)
        default:
            return state;
    }
};
