import React from 'react';
import { Header, FormGroup, Progress, FormPassword, FormRadioCheck, Modal } from '@/screens/components';
import { Card, Button, Icon, Divider, Select, Switch, message, Radio, Checkbox } from 'antd'
import { axios, HYID, posturl, handleRedir, deepCopy } from '@/share';
import ReactValidator from '@/share/validator/index.js';
// import logo_img from '@/logo.png';
import './index.less'

const { Option } = Select;
export default class Quick extends React.Component {
  state = {
    loading: false,
    proto: 'dhcp',
    speed: 1000,
    wanmsg: {
      host_name: ""
    },
    wan_type: "",
    ssid_config: {
    },
    showProgress: false,
    locktime: 0,
    first_boot: 0,
    wanmsg_src: {},
    values: {}
  }

  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount() {
    this.getData()
  }

  getData = () => {
    axios.post({
      url: posturl,
      data: {
        HYID: HYID.get_quick_setting_config
      }
    }).then((res) => {
      if (res.errcode === 2000) {
        if (res.huayi_r.first_boot === 0) {
          window.location.hash = "#/Home"
        }
        let wanmsg = {}
        wanmsg = {
          wan_type: res.huayi_r.wan_type,
          proto: res.huayi_r.proto,
          usr: res.huayi_r.usr,
          pwd: res.huayi_r.pwd,
          ac: res.huayi_r.ac,
          service: res.huayi_r.service,
          host_name: res.huayi_r.host_name,
          auth_type: res.huayi_r.auth_type,
          apn_name: res.huayi_r.apn_name,
          apn_usr: res.huayi_r.apn_usr,
          apn_pwd: res.huayi_r.apn_pwd,
          use_apn: res.huayi_r.use_apn,
          proto_4g: res.huayi_r.proto_4g,
          detect_ip: res.huayi_r.detect_ip,
          detect_time: res.huayi_r.detect_time
        }
        this.setState({
          ssid_config: res.huayi_r.ssid_config,
          speed: res.huayi_r.speed,
          first_boot: res.huayi_r.first_boot,
          wanmsg,
          wanmsg_src: wanmsg,
          result_src: deepCopy(res.huayi_r)
        })
      }
    })
  }

  setQuickSettingConfig = (values, ssid_config) => {
    axios.post({
      url: posturl,
      data: {
        HYID: HYID.set_quick_setting_config,
        ...values,
        ...ssid_config,
      }
    }).then((res) => {
      if (res.errcode == 2000) {
        this.setState({
          showProgress: res.progresstime != 0,
          locktime: res.progresstime,
          redir: res.reconnection,
          redir_ip: res.reconnection_addr || '',
        })
      }
    })
  }

  handleRedirect = () => {
    handleRedir(this.state.redir, this.state.redir_ip)
    this.setState({
      showProgress: false,
    })
  }
  setWanmsg = (wanmsg) => {
    this.setState({ wanmsg })
  }
  handleFinish = () => {
    this.setQuickSettingConfig(this.state.values)
  }

  setFirstData = (values) => {
    this.setState({ values })
  }

  render() {
    return (
      <div className="wizard">
        <div><Header
        // logo={logo_img}
        /></div>
        <div className="wizard-content">
          <h1>{window.__("Network Quick Setting")}</h1>
          <Card bordered={false}>
            <div>
              <QuickNetSetting
                speed={this.state.speed}
                loading={this.state.loading}
                wanmsg={this.state.wanmsg}
                wanmsg_src={this.state.wanmsg_src}
                setWanmsg={this.setWanmsg}
                setFirstData={this.setFirstData}
                handleFinish={this.handleFinish}
              />

            </div>
            <Progress
              showProgress={this.state.showProgress}
              locktime={this.state.locktime}
              handleRedirect={this.handleRedirect}
              message='Configuring...Please Do Not Shut Down The Device,Completed After ' />
          </Card>
        </div>
      </div>
    )
  }
}

class QuickNetSetting extends React.Component {
  state = {
    speed: this.props.speed,
    loading: this.props.loading,
    wanmsg: this.props.wanmsg,
    wanmsg_src: this.props.wanmsg_src,
    selectList: this.props.selectList
  }

  componentWillMount() {
    this.validator = new ReactValidator();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.speed !== this.props.speed ||
      nextProps.loading !== this.props.loading ||
      nextProps.wanmsg !== this.props.wanmsg ||
      nextProps.wanmsg_src !== this.props.wanmsg_src) {
      this.setState({
        speed: nextProps.speed,
        loading: nextProps.loading,
        wanmsg: nextProps.wanmsg,
        wanmsg_src: nextProps.wanmsg_src
      })
    }
  }

  handleChange = name => event => {
    let wanmsg = deepCopy(this.state.wanmsg)
    let value = event.target.value;
    if (name === "wan_type") {
      wanmsg[name] = value
    } else {
      wanmsg[name] = value
    }
    this.setState({ wanmsg });
    this.props.setWanmsg(wanmsg)
  };
  handleSelect = name => value => {
    let wanmsg = deepCopy(this.state.wanmsg)
    wanmsg[name] = value;
    this.setState({ wanmsg });
    this.props.setWanmsg(wanmsg)
    this.validator.hideMessages();
  }
  mobileData = async () => {
    let mobileChange = 0;//0是正常，1是格式错误，2是数据未修改
    let mobileValue = {}
    let wanmsg = deepCopy(this.state.wanmsg);
    if (wanmsg.use_apn === 0) {//自动
      if (this.validator.someValid(['mhostname'])) {
        mobileValue = {
          use_apn: 0,
          host_name: wanmsg.host_name,
          proto: "dhcp"
        }
      } else {
        mobileChange = 1;
        this.validator.showMessages();
        this.forceUpdate();
      }
    }
    if (wanmsg.use_apn === 1) {//手动
      if (this.validator.someValid(['apn_name', 'apn_usr', 'apn_pwd'])) {
        mobileValue = {
          use_apn: wanmsg.use_apn,
          apn_name: wanmsg.apn_name,
          apn_usr: wanmsg.apn_usr,
          apn_pwd: wanmsg.apn_pwd,
          auth_type: wanmsg.auth_type,
          proto: "dhcp"
        }
      } else {
        mobileChange = 1;
        this.validator.showMessages();
        this.forceUpdate();
      }
    }
    this.setState({ mobileChange: mobileChange, mobileValue: mobileValue })
  }
  handleSetData = () => {
    let values = {}
    if (this.state.mobileChange === 1) {
      return;
    }
    values = {
      wan_type: "mobile",
      ...this.state.mobileValue
    }
    this.props.setFirstData(values)
    this.props.handleFinish()
  }

  handleFinish = () => {
    this.mobileData().then(() => {
      this.handleSetData()
    })
  }
  handleToHome = () => {
    axios.post({
      url: posturl,
      data: {
        HYID: HYID.set_first_boot,
        first_boot: 0,
      }
    }).then((res) => {
    })
    window.location.hash = "#/Home"
  }

  handleChildEvent = (ref) => {
    this.childRef = ref
  }

  render() {
    const { speed, loading, wanmsg, wanmsg: { detect_ip, wan_type, auth_type, apn_name,
      apn_usr, apn_pwd, use_apn, detect_time } } = this.state
    return (
      <div>
        <div className="wrapper" ref="wizard">

          <FormGroup lable={window.__('Internet Type')}>
            <Select value={wan_type || ''} onChange={this.handleSelect('wan_type')} disabled={true}>
              <Option value={'mobile'}>{window.__('4G')}</Option>
            </Select>
          </FormGroup>
          <div style={{ height: 20 }}></div>
          <FormGroup lable={window.__('Dialing 4G')}>
            <Select value={use_apn || 0} onChange={this.handleSelect('use_apn')}>
              <Option value={0}>{window.__('Automatic')}</Option>
              <Option value={1}>{window.__('Manual')}</Option>
            </Select>
          </FormGroup>
          {use_apn === 0 ?
            <FormGroup lable={window.__('Internet Access Mode')}>
              <Select disabled value={'dhcp'} onChange={this.handleSelect('proto_4g')}>
                <Option value={'static'}>{window.__('STATIC')}</Option>
                <Option value={'dhcp'}>{window.__('DHCP')}</Option>
                <Option value={'pppoe'}>{window.__('PPPOE')}</Option>
              </Select>
            </FormGroup>
            : <>
              <FormGroup lable={window.__('APN Name')}>
                <input value={apn_name || ''}
                  onChange={this.handleChange('apn_name')} />
                <div className="tip-err">
                  {this.validator.message('apn_name', apn_name, 'required&&apnname&&max:64', '', {
                    default: window.__('APN Name Field Required!'),
                    apnname: window.__('Can\'t Contain The Following: \" & \' < > ` \\'),
                    max: window.__('APN Name At Most 64 Characters!'),
                  })}</div>
              </FormGroup>

              <FormGroup lable={window.__('User Name')}>
                <input value={apn_usr || ''}
                  onChange={this.handleChange('apn_usr')} />
                <div className="tip-err">
                  {this.validator.message('apn_usr', apn_usr, 'apnusername&&max:32', '', {
                    default: window.__('Limited To English Letters And Characters, Numbers,But Not Contain The Following: \" & \' < > ` \\'),
                    max: window.__('User Name At Most 32 Characters!'),
                  })}</div>
              </FormGroup>
              <FormPassword lable={window.__('Password')}
                value={apn_pwd || ""}
                onChange={this.handleChange('apn_pwd')}>
              </FormPassword>
              <div className="tip-err">
                {this.validator.message('apn_pwd', apn_pwd, 'apnusername&&max:32', '', {
                  default: window.__('Limited To English Letters And Characters, Numbers,But Not Contain The Following: \" & \' < > ` \\'),
                  max: window.__('Password At Most 32 Characters!'),
                })}</div>

              <FormGroup lable={window.__('Authentication')}>
                <Select value={auth_type || '0'}
                  onChange={this.handleSelect('auth_type')}>
                  <Option value="0">NONE</Option>
                  <Option value="1">PAP</Option>
                  <Option value="2">CHAP</Option>
                </Select>
              </FormGroup>
            </>}

          <div style={{ textAlign: "center" }}>
            <Button style={{ marginRight: 20, marginTop: 20, marginBottom: 60 }}
              type="primary"
              onClick={this.handleToHome}>{window.__("Skip")}</Button>
            <Button
              type="primary"
              onClick={this.handleFinish}>{window.__("Complete")}</Button>
            {/* <Button
              type="primary"
              onClick={this.handleNextStep}>{window.__("Next")}<Icon type="right" /></Button> */}
          </div>
        </div>
      </div>
    )
  }
}