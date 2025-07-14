import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from '@/share/axios';
import {Progress} from '@/screens/components';
import { message } from 'antd';
import {handleRedir} from '@/share/redirect';
import './index.less'
import {connect} from 'react-redux'
import {actionCreater } from '@/proconfig/store'

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
    uploadStatus: false,
  }
  
  componentDidMount() {
    console.log('Upload组件已加载', this.props);
  }
  
  componentDidUpdate(prevProps, prevState) {
    console.log('Upload组件已更新', {
      prevProps,
      currentProps: this.props,
      prevState,
      currentState: this.state
    });
  }
  
  handleSendFiled=()=>{
    console.log('开始上传文件');
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
    let fileurl = this.props.fileurl;
    if(this.props.setFileName){
      fileurl = fileurl + formData.get('userfile').name
    }
    console.log('开始发送请求', fileurl);
    axios.post({
        data:formData,
        url:fileurl
    }).then((res)=>{
      console.log('上传请求返回', res);
      this.setState({clickUploadbtn:false})
      if(res.errcode === 2000){
        console.log('上传成功，设置进度条', res.progresstime);
        const currentFileName = this.state.filename;
        
        this.setState({
          files:[],
          redir:res.reconnection,
          redir_ip:res.reconnection_addr,
          showProgress:res.progresstime!==0,
          locktime:res.progresstime,
          uploadStatus: true,
        },()=>{
          console.log('上传状态已更新', this.state);
          if(this.props.setUploadStatus){
            console.log('调用父组件setUploadStatus');
            this.props.setUploadStatus({uploadStatus:this.state.uploadStatus})
          }
        })   
        let file = document.getElementById('file');
        file.value = '';
      }/*else if(res.errcode === 4008){    
        message.error(window.__('Please Select The Correct Configuration File!'))
      }*/
    })
  }
  checkinfo=(obj)=>{
    console.log('文件选择变化', obj.target.files);
    if(obj.target.files.length>0){
      /**这里取出的是单个文件，不适用于多个文件 */
      this.setState({
        files:obj.target.files[0],
        size:obj.target.files[0].size,
        filename:obj.target.files[0].name,
        // 重置上传状态，以便可以重新上传
        uploadStatus: false
      }, () => {
        console.log('文件信息已更新', this.state);
        // 如果父组件需要知道上传状态变化
        if(this.props.setUploadStatus){
          this.props.setUploadStatus({uploadStatus:this.state.uploadStatus})
        }
      })
    }
  }
  
handleCheck=event=>{
    this.setState({
      configflags:event.target.checked?1:0
    })
}

handleRedirect=()=>{
  console.log('进度条完成，调用handleRedirect');
  console.log('重定向信息:', this.state.redir, this.state.redir_ip);
  handleRedir(this.state.redir, this.state.redir_ip, true);
  this.setState({
    showProgress:false,
  }, () => {
    console.log('进度条已隐藏');
  })
}
  render() {
    console.log(this.props.FormData)
    console.log(this.props.fileurl)
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
const mapState = (state)=>({
  canFresh:state.getIn(['common','canFresh']),
})

const mapDispatch = (dispatch) =>({
  setFresh(args){
      dispatch(actionCreater.setFresh(args))
  },
})

export default connect(mapState,mapDispatch)(Upload)
