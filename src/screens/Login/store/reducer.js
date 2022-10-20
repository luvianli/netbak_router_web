import {fromJS} from 'immutable'
import * as ACTIONTYPE from './actionType';

const defaultState = fromJS({
    loginStatus:false,
    firstBoot:null
})

export default (state = defaultState , action)=>{
    const { type, payload } = action;
    switch(type){
        case ACTIONTYPE.ACTION_SET_LOGIN_STATUS:
            return state.set('loginStatus',payload)
        case ACTIONTYPE.ACTION_SET_FIRST_BOOT:
            return state.set('firstBoot',payload)
        default:
            return state;
    }
};
