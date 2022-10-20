import {combineReducers} from 'redux-immutable';
import {reducer as loginReducer} from '@/screens/Login/store';
import {reducer as wirelessReducer} from '../screens/WIFI/store';
import {reducer as commonReducer} from '@/proconfig/store';

const reducer = combineReducers({
    login:loginReducer,
    wirelessBase:wirelessReducer,
    common:commonReducer,
})

export default reducer;