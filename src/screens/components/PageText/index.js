import React,{ useState } from 'react'
import {Icon} from 'antd'
import './index.less'

export function PageText(props) {
  const [visble,setVisble] = useState(false);
  
  return (
    <div className='maintitlewithhelp'>
      <h3>{props.title}</h3>
      <div className='help_text'>{props.msg}</div>
      {props.showHelp?
      <>
      <div className='page-help' onClick={() => {setVisble(!visble)}}>
        <Icon type="question-circle" />
        <div className='page_help_title'>{window.__('Help')}</div>
      </div>
      {visble?<div className='help_text'>{props.helpmsg}</div>:null}
      </>:null}
    </div>
  );
}


export function PageText2(props) {
  const [visble,setVisble] = useState(false);
  
  return (
    <div className='maintitlewithhelp2'>
      <h4>{props.title}</h4>
      <div className='help_text'>{props.msg}</div>
      {props.showHelp?
      <>
      <div className='page-help' onClick={() => {setVisble(!visble)}}>
        <Icon type="question-circle" />
        <div className='page_help_title'>{window.__('Help')}</div>
      </div>
      {visble?<div className='help_text'>{props.helpmsg}</div>:null}
      </>:null}
    </div>
  );
}


  
  