import React,{ useState } from 'react';
import { Icon } from 'antd';
import './index.less';

export function FormGroup(props) {
  return(
    <div className='form-label-input'>        
      <div className='form-lable'>{props.lable}</div>
        {props.children}
        {props.type==='password'?
        <Icon className='password-eye' type="eye-invisible" />:null
        }
    </div>
  )
}

export function FormButton(props) {
  return(
    <div className='form-label-input'>
      <div className='form-lable'></div>
      <button className='form-button' {...props}></button>
    </div>
  )
}
export function ClickButton(props) {
  return(
    <div className='form-label-input click-btn'>
      <div className='form-mobile-btn'></div>
      <button className='form-button' {...props}></button>
    </div>
  )
}

export function FormPassword(props) {
  const [visble,setVisble] = useState(false);
  return(
    <div className='form-label-input'>        
      <div className='form-lable'>{props.lable}</div>
        <input className='form-input' type={visble?'text':'password'} {...props}/>
        <Icon className='password-eye' type={visble?"eye":"eye-invisible"} 
          onClick={() => {setVisble(!visble)}}/>
        <div className='tip'>{props.tip}</div>
    </div>
  )
}
export  function FormLabel(props){
  return(
  <div className='form-label-input'>
    <div className='tip'>{props.children}</div>
  </div>
  )
}

export function FormRadioCheck(props) {
  return(
    <div className='form-lable-radio'>        
      <label className='form-lable'>{props.lable}</label>
      <div className="form-radio">{props.children}</div>
    </div>
  )
}
/**
 * 使用例子
      <div>
        <FormGroup lable={'Input'}>
          <input/>
          <div className='tip'>建议数字字母</div>
          <div className='tip-err'>你的输入格式不对</div>
        </FormGroup>

        <FormPassword lable={'Input type=password'}>
        </FormPassword>
        
        <FormGroup lable={'Switch--antd'}>
          <Switch/>
        </FormGroup>
        
        <FormGroup lable={'Select--antd'}>
          <Select/>
        </FormGroup>
        <FormButton>Save</FormButton>
      </div>
      
      <input className='login-input'/>
      <button className='login-button'>Login</button>
 */