import {fromJS} from 'immutable'
import * as ACTIONTYPE from './actionType';
//import * as actionCreater from './actionCreater'

const defaultState = fromJS({
    enable2g:1,
    enable5g:1
})

export default (state = defaultState , action)=>{
    switch(action.type){
        case ACTIONTYPE.ENABLE2G:
        return state.merge({
            enable2g:action.enable2g,
        })
        case ACTIONTYPE.ENABLE5G:
        return state.merge({
            enable5g:action.enable5g,
        })
        default:
            return state;
    }
}