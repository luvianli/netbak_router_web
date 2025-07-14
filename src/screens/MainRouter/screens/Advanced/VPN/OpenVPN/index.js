import React, { Component } from 'react';
import { FormGroup, FormButton, PageText, Progress, FormPassword, FormRadioCheck, Upload } from '@/screens/components';
import { axios, HYID, posturl, deepCopy, ipToNumber, deepCompare, handleRedir } from '@/share';
import { message, Radio, Switch } from 'antd';
import ReactValidator from '@/share/validator/index.js';
/**PPTP Server 地址段不能跟L2TP Server地址段一样
 * Server Address可以写IP和域名
 * Server Address 与 PPTP Server 地址段不能冲突
*/
export default class LAN extends Component {
  state = {
    result: {},
    result_src: {},
    showProgress: false,
    locktime: 0,
    set_system_upgrade:`${HYID.set_system_upgrade}1`,
    uploadStatus:false
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount() {
    this.getData();
  }

  getData = () => {
    axios.post({
      data: {
        HYID: HYID.get_openvpn_config
      },
      url: posturl
    }).then((res) => {
      if (res.errcode === 2000) {
        console.log(res)
        this.setState({
          result: deepCopy(res.huayi_r),
          result_src: deepCopy(res.huayi_r)
        })
      }
    })
  };
  setData = (values) => {
    axios.post({
      data: {
        HYID: HYID.set_openvpn_config,
        ...values,
      },
      url: posturl
    }).then((res) => {
      if (res.errcode === 2000) {
        if (res.progresstime !== 0) {
          this.setState({
            showProgress: res.progresstime !== 0,
            locktime: res.progresstime,
            redir: res.reconnection,
            redir_ip: res.reconnection_addr || '',
          })
        } else {
          message.success(window.__('Success'))
          this.getData()
        }
      }
    })
  }

  handleChange = name => event => {
    let result = deepCopy(this.state.result);
    let value = event.target.value;
    result[name] = value;
    this.setState({ result });
  };

  handleSwitch = name => checked => {
    let result = deepCopy(this.state.result);
    // let { host_name, usr, pwd, port } = this.state.result_src;
    // if (!checked && name === 'enable') {
    //   result.host_name = host_name;
    //   result.usr = usr;
    //   result.pwd = pwd;
    //   result.port = port;
    // }
    result[name] = checked;
    this.setState({ result });
  }
  handleSave = () => {
    const { result, uploadStatus } = this.state;
    console.log(uploadStatus)
    /**关闭状态 */
    if (!result.enable) {
      let values = { enable: result.enable };
      this.setData(values);
      return ;
    }
    //文件上传
    if ( result.enable && result.option === 1 ) {
      if(uploadStatus===true){
        let values = { enable: result.enable,option: result.option };
        this.setData(values);
      }else{
        message.warning(window.__('Please Upload The Configuration File!'))
      }
      return ;
    }
    //表单上传
    let validArr = ['host_name', 'usr', 'pwd', 'port'];
    if (this.validator.someValid(validArr)) {
      /**数据不能与原来的相同 */
      // if (deepCompare(result, result_src)) {
      //   message.success(window.__('Data Up to Date'))
      //   return false;
      // }
      // else { 
        this.setData(result) 
      // };
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  setUploadStatus=(values)=>{
    this.setState({uploadStatus:values.uploadStatus})
  }
  handleRedirect = () => {
    handleRedir(this.state.redir, this.state.redir_ip)
    this.setState({
      showProgress: false
    })
  }
  render() {
    const { enable, host_name, usr, pwd, port, status, option } = this.state.result;
    return (
      <div>

        <PageText
          title={window.__('OpenVPN Client')}
          msg={window.__('')} />

        <FormGroup lable={window.__('OpenVPN Client Setting')}>
          <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={enable} onChange={this.handleSwitch('enable')} />
        </FormGroup>
        <FormGroup lable={window.__("Connection Status")}>
            <span style={{fontSize:14}}>
                {status === 1 ?  window.__('Connect Success') :
                  status === 0 ? window.__('Connect Fail') : window.__('Disconnected')}
            </span>
            </FormGroup>
        {enable &&<>
          <FormRadioCheck lable={window.__('Collocation Method')}>
            <Radio.Group onChange={this.handleChange('option')} value={option}>
              <Radio value={0}>{window.__('Form Configuration')}</Radio>
              <Radio value={1}>{window.__('Upload File')}</Radio>
            </Radio.Group>
          </FormRadioCheck>
          {option===0 ?
            <div>
              <FormGroup lable={window.__('Host Name')}>
                <input value={host_name || ''} onChange={this.handleChange('host_name')} />
                <div className="tip-err">
                  {this.validator.message('host_name', host_name, 'houtais&&ascii&&max:32', '', {
                    default: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                    max: window.__('Host Name At Most 32 Characters!'),
                    ascii: window.__('Only Supports ASCII Code!'),
                  })}</div>
              </FormGroup>

              <FormGroup lable={window.__('User Name')}>
                <input value={usr || ''} onChange={this.handleChange('usr')} />
              </FormGroup>
              <div className="tip-err">
                {this.validator.message('usr', usr, 'required&&max:32&&password&&special', '', {
                  default: window.__('User Name Field Required!'),
                  max: window.__('User Name At Most 32 Characters!'),
                  special: window.__('User Name') + '  ' + window.__('Cannot Be Entered  \' \" \\ #'),
                  password: window.__('Only Supports ASCII Code!')
                })}</div>

              <FormPassword lable={window.__('Password')}
                value={pwd || ''}
                onChange={this.handleChange('pwd')}>
              </FormPassword>
              <div className="tip-err">
                {this.validator.message('pwd', pwd, 'required&&max:32&&password&&special', '', {
                  default: window.__('Password Field Required!'),
                  max: window.__('Password At Most 32 Characters!'),
                  special: window.__('Password') + '  ' + window.__('Cannot Be Entered  \' \" \\ #'),
                  password: window.__('Only Supports ASCII Code!')
                })}</div>

              <FormGroup lable={window.__('Port')}>
                <input value={port || ''} onChange={this.handleChange('port')} />
                <div className="tip-err">
                  {this.validator.message('port', port, 'required&&range:80-65535', '', {
                    default: window.__('Port Field Required!'),
                    range: window.__('Port Range Is 80-65535!'),
                  })}</div>
              </FormGroup>
            </div>
          :
          <>
            <Upload 
              title={'Configure File'}
              fileurl={HYID.upload_openvpn_file}
              max_size = {1*1024*1024}
              max_size_tip = {"1M"}
              UploadText={'Upload'}
              message={window.__("Configuring...Please Do Not Shut Down The Device,Completed After ")}
              setUploadStatus={this.setUploadStatus}
              setFresh={true}
            />
            <Upload 
              title={'Authentication File'}
              fileurl={HYID.openvpn_certify}
              max_size = {1*1024*1024}
              max_size_tip = {"1M"}
              UploadText={'Upload'}
              message={window.__("Configuring...Please Do Not Shut Down The Device,Completed After ")}
              setFileName={true}
              setFresh={true}
            />
            <div className='tip'>{window.__('The key path is "/path/to/", please synchronize the authentication path of the configuration file with the key path.')}</div>
          </>
          }
        </>}
        <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>
        <div style={{ height: 88 }}></div>
        <Progress
          showProgress={this.state.showProgress}
          locktime={this.state.locktime}
          handleRedirect={this.handleRedirect}
          message='Configuring...Please Do Not Shut Down The Device,Completed After ' />

      </div>
    );
  }
}
