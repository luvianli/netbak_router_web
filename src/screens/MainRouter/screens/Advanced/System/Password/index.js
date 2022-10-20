import React,{Component} from 'react';
import {FormButton,FormPassword,PageText} from '@/screens/components';
import {axios,HYID ,posturl,logout} from '@/share';
import {message} from 'antd';
import ReactValidator from '@/share/validator/index.js';

import JsEncrypt from 'jsencrypt';
import md5 from "md5";

const jse = new JsEncrypt();
jse.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDppUIZsbdDZlC61T4HiHhGvISt
2UW8Sx2DE7v65X2RqEZa9Pybhj0XbjFcWz0DwTsaXtijKL8zTmeGw2VkWcNAEZra
PWmm3LeaWO/F0gGJMMRT0MW1m0Wf04/vb0AcQEDCkNW0Ou7wBV57O0RK1LAEmZpf
LUaG8bYgtcMzdcur+wIDAQAB
-----END PUBLIC KEY-----`);

export default class InternetConnection extends Component {
  state={
    hy_prepwd:'',
    hy_newpwd:'',
    confirmpassword:'',
    prdy: ''
  }
  componentWillMount() {
    this.validator = new ReactValidator();
    this.getData()
  }

  getData=()=>{
    axios.post({
      data:{
        HYID:HYID.get_passwd_state,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({
          prdy:parseInt(res.huayi_r.randomname)
        })
      }
    })
  }
  setData=()=>{
    const {hy_prepwd,hy_newpwd,confirmpassword} = this.state
    // const values = {hy_prepwd,hy_newpwd,confirmpassword}
    let values
    if(this.state.prdy>1594) {
      values = {
        // hy_prepwd:jse.encrypt(hy_prepwd),
        // hy_newpwd:jse.encrypt(hy_newpwd)
        hy_prepwd:md5(hy_prepwd),
        hy_newpwd:md5(hy_newpwd)
      }
    }else{
      values = {
        // hy_newpwd:jse.encrypt(hy_newpwd)
        hy_newpwd:md5(hy_newpwd)
      } 
    }
    axios.post({
      data:{
        HYID:HYID.change_admin_password,
        ...values
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        //redirect to login
        logout()
      }
    })
  }
  validPassword=()=>{
    const {hy_prepwd,hy_newpwd,confirmpassword} = this.state;
    if( this.validator.allValid()){
      if(hy_prepwd === hy_newpwd){ 
        message.warning(window.__('New Password Cannot Be The Same As The Original Password!'))
        return false
      }
      if(hy_newpwd !== confirmpassword){ 
        message.error(window.__('New Password Is Diffrent From Confirmation Password!'))
        return false
      }
      this.setData()
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }

  }
  
  handleChange = name => event => {
    this.setState({ [name] : event.target.value });
  };
  render(){
    const {hy_prepwd,hy_newpwd,confirmpassword,prdy} = this.state;
    return (
      <div>
        <PageText 
          title={window.__('Admin Setting')}
          msg={window.__('You can change the administration password.')}/>

        {prdy>1594?
        <div>
          <FormPassword lable={window.__('Original Password')}
          value ={hy_prepwd||""}
          onChange={this.handleChange('hy_prepwd')}>
        </FormPassword>
          <div className="tip-err">
          {this.validator.message('hy_prepwd', hy_prepwd, 'required&&min:5&&max:32&&password','',{
            default: window.__('Original Password Field Required!'),    
            min: window.__('Original Password At Least 5 Characters!'),
            max: window.__('Original Password At Most 32 Characters!'),
            password: window.__('Only Supports ASCII Code!')
          })}</div> 

        </div>:null  
        } 
  

        <FormPassword lable={window.__('New Password')} 
          //tip={window.__('Password Tip')}          
          value ={hy_newpwd||""}
          onChange={this.handleChange('hy_newpwd')}>
        </FormPassword>
          <div className="tip-err">
          {this.validator.message('hy_newpwd', hy_newpwd, 'required&&min:5&&max:32&&password','',{
            default: window.__('New Password Field Required!'),    
            min: window.__('New Password At Least 5 Characters!'),
            max: window.__('New Password At Most 32 Characters!'),
            password: window.__('Only Supports ASCII Code!')
          })}</div>   
          
        <FormPassword lable={window.__('Confirm Password')}        
          value ={confirmpassword||""}
          onChange={this.handleChange('confirmpassword')}>
        </FormPassword>
          <div className="tip-err">
          {this.validator.message('confirmpassword', confirmpassword, 'required&&min:5&&max:32&&password','',{
            default: window.__('Confirm Password Field Required!'),    
            min: window.__('Confirm Password At Least 5 Characters!'),
            max: window.__('Confirm Password At Most 32 Characters!'),
            password: window.__('Only Supports ASCII Code!')
          })}</div>   
        
        <FormButton onClick={this.validPassword}>{window.__('Apply')}</FormButton>
      </div>
    );
  }
}


  