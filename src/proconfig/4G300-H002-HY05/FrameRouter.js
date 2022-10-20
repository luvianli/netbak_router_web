import React,{ useEffect } from 'react'
import {HashRouter , Route , Switch , Redirect} from 'react-router-dom';

import sLogin from './login'
import NoLogin from '@/screens/common/noLogin'
import Signal from '@/screens/common/signal'
import Frame from './layout/Frame';
import Wizard from '@/screens/4G300-H002-HY05/Wizard';
import Routes from './Router'

import '@/iconfont/iconfont.css'

import { connect } from 'react-redux';
import {actionCreater } from '../store';

function FrameRouter(props) {  
  useEffect(()=>{    
    props.getTitle();
  },[])

  
  useEffect(()=>{
    props.getLanguage();
  },[])
  
  useEffect(()=>{
    if(window.location.hash==='#/abc'){
      window.location.hash="#/abc";
    }else if(Number(localStorage.getItem("status")) === 4001){      
      window.location.hash="#/Login";
    }
  },[])
  
const lang = require(`@/share/lang/${props.language}/lang.js`);
window.__ =lang.__;

  return (
    <div>
      <HashRouter>
        <Switch>
          <Route path="/wizard" render={() =>
            <Route  path="/wizard"  component={Wizard} />
          }
          />
          <Route path="/no_login" component={NoLogin} />
          <Route path="/abc" component={Signal} />

          <Route exact path="/login" component={sLogin} />          
          <Route path="/" render={()=>              
            <Frame>              
              <Routes/>
            </Frame>
          }/>
        </Switch>
      </HashRouter>
    </div>
  );
}


const mapState = (state)=>({
  language:state.getIn(['common','language']),
  
})

const mapDispatch = (dispatch) =>({  
  getTitle(args){
    dispatch(actionCreater.getTitle(args))
  },
  getLanguage(args){
      dispatch(actionCreater.getLanguage(args))
  }
})


export default connect(mapState,mapDispatch)(FrameRouter)
