import React, { useEffect } from 'react';
import {NavLink} from 'react-router-dom'
import useWinSize from '@/screens/common/useWinSize';
import BackButton from './back.png'
import './index.less';

export default function Content(props){
  
  const winSize = useWinSize();
  let winHight = winSize.height - 56;

  useEffect(() => {
      winHight = winSize.height - 56;   
  },[winSize.height])
  
  return(
    <div className={`base-content ${props.className}`}
         style={{minHeight:winHight}}
    >
      <div className="nav">
        <NavLink className='back-btn' to={props.goback || '/index'}><img src={BackButton}></img></NavLink>
        <label className='title'>{props.title}</label>
      </div>
      
      <div className="content">
        {
          props.children
        }
      </div>
    </div>

  )

}

