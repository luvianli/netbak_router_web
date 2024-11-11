import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from '@/share/axios';
import {Progress} from '@/screens/components';
import { message } from 'antd';
import {handleRedir} from '@/share/redirect';
import './index.less'

//import './index.css'
//const MAXSIZE = 8*1024*1024;

class Upload extends Component {
  state={
    files:'',
    configflags:1,
    filename:'',    
    showProgress:false,
    locktime:0,
    clickUploadbtn:false,
  }
  handleSendFiled=()=>{
    if(!this.state.files || this.state.files.length<1){ 
      message.warning(window.__('Please Select The File To Upload!'))
      return
    }
    
    if(this.props.max_size!==0){
      if(this.state.size > this.props.max_size){ 
        message.error(window.__('File At Most ')+this.props.max_size_tip+'!')
        return
      }
    }
    this.setState({clickUploadbtn:true})

    var formData = new FormData();
    formData.append("userfile", this.state.files);
    axios.post({
        data:formData,
        url:this.props.fileurl
    }).then((res)=>{
      this.setState({clickUploadbtn:false})
      if(res.errcode === 2000){    
        this.setState({
          files:[],
          filename:'',
          redir:res.reconnection,
          redir_ip:res.reconnection_addr,
          showProgress:res.progresstime!==0,
          locktime:res.progresstime,
        })   
        let file = document.getElementById('file');
        file.value = '';
      }/*else if(res.errcode === 4008){    
        message.error(window.__('Please Select The Correct Configuration File!'))
      }*/
    })
  }
  checkinfo=(obj)=>{
    if(obj.target.files.length>0){
      /**这里取出的是单个文件，不适用于多个文件 */
      this.setState({
        files:obj.target.files[0],
        size:obj.target.files[0].size,
        filename:obj.target.files[0].name
      })
    }
}
  
handleCheck=event=>{
    this.setState({
      configflags:event.target.checked?1:0
    })
}

handleRedirect=()=>{
  // handleRedir(this.state.redir,this.state.redir_ip)
  window.location.reload()
  this.setState({
    showProgress:false,
  })
}
  render() {
    return (
      <div>
      <div className='input-file'>        
        <div className='file-lable'><span>{window.__(this.props.title)}</span></div>
        <div className='file'>  
        <div className="uploader cs-gray">
        <input type="text" className="filename" value={this.state.filename} readOnly/>
        <button type='button' className='button_up'>{window.__('Select')}</button>  
        <input type="file" className="f1" id="file" multiple={false}  size="30" onChange={this.checkinfo}/></div>
        <div className="uploader cs-gray">
        <button type='button' disabled={this.state.clickUploadbtn}  className="button_sumit"  id='upgrade' onClick={this.handleSendFiled}>{window.__(this.props.UploadText||'Upgrade')}</button></div>
        </div>
      </div>

      <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect}
            message={this.props.message}/>
      </div>
    );
  }
}

Upload.propTypes = {
  fileurl: PropTypes.string.isRequired,
  UploadText:PropTypes.string,
  title:PropTypes.string,
  max_size:PropTypes.number,
  max_size_tip:PropTypes.string,
  message:PropTypes.string
};
Upload.defaultProps = {
  max_size:0,
  max_size_tip:'',
  title:'',
};
export default Upload;
