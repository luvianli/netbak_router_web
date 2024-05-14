import React, { Component } from 'react';
import { FormGroup, FormButton, PageText, Progress, FormPassword, FormRadioCheck, Modal } from '@/screens/components';
import { axios, HYID, posturl, smsurl, sms_HYID, deepCopy, handleRedir } from '@/share';
import { message, Icon, Select, Checkbox, Radio } from 'antd';
import ReactValidator from '@/share/validator/index.js';

const { Option } = Select;

export default class WANPrior extends Component {
  state = {
    result: {
      dns_arr: [],
    },
    result_src: {},
    showProgress: false,
    locktime: 0,
    loadingVisble: false,
    mobileChange: 0,
    mobileValue: {},
    selectList: [],
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount() {
    this.getData();
    this.getCurrentUserInfo();
  }

  getData = () => {
    axios.post({
      data: {
        HYID: sms_HYID.cgi_get_wan_or_wan4g_config
      },
      url: smsurl
    }).then((res) => {
      if (res.errcode === 2000) {
        let result = deepCopy(res.huayi_r)
        result.mac_addr = res.huayi_r.def_mac_addr.toUpperCase()
        result.def_mac_addr = res.huayi_r.def_mac_addr.toUpperCase()
        this.setState({
          result: deepCopy(result),
          result_src: deepCopy(result)
        })
      }
    })
  };
  setEthWanConfig = (values) => {
    axios.post({
      data: {
        HYID: sms_HYID.cgi_set_wan_or_wan4g_config,
        ...values,
      },
      url: smsurl
    }).then((res) => {
      if (res.errcode === 2000) {
        this.setState({
          //result_src:deepCopy(this.state.result),
          redir: res.reconnection,
          redir_ip: res.reconnection_addr,
          showProgress: res.progresstime !== 0,
          locktime: res.progresstime
        })
      }
    })
  }
  //获取克隆本机MAC地址
  getCurrentUserInfo = () => {
    axios.post({
      data: {
        HYID: HYID.get_current_user_info
      },
      url: posturl
    }).then((res) => {
      if (res.errcode === 2000) {
        this.setState({
          usr_mac: res.huayi_r.usr_mac
        })
      }
    })
  };
  handleRedirect = () => {
    handleRedir(this.state.redir, this.state.redir_ip)
    this.getData();
    this.setState({
      showProgress: false
    })
  }

  handleSetData = () => {
    let result = deepCopy(this.state.result);
    let result_src = deepCopy(this.state.result_src);
    let values = {}
    if (this.state.mobileChange === 1) {
      return;
    }
    if (this.state.mobileChange === 2 && (result.wan_mode === result_src.wan_mode)) {
      message.success(window.__('Data Up to Date'))
      return;
    }
    values = {
      wan_mode: "mobile",
      ...this.state.mobileValue
    }
    this.setEthWanConfig(values)
  }
  handleSelect = name => value => {
    let result = deepCopy(this.state.result);
    if (name === 'wan_mode') {
      result.proto = 'dhcp';
    }
    result[name] = value;
    this.setState({ result });
    this.validator.hideMessages();
  }
  handleChange = name => event => {
    let result = deepCopy(this.state.result);
    let value = event.target.value;
    result[name] = value;
    if (name === 'dns0') {
      result.dns_arr[0] = value;
    }
    if (name === 'dns1') {
      result.dns_arr[1] = value;
    }
    if (name === 'mac_addr') {
      result.mac_addr = value.toUpperCase();
    }
    this.setState({ result });
  };
  mobileData = async () => {
    let mobileChange = 0;//0是正常，1是格式错误，2是数据未修改
    let mobileValue = {}
    let result = deepCopy(this.state.result);
    let result_src = deepCopy(this.state.result_src)
    let range = 0
    if (result.band < 9) {
      range = 10008
    } else {
      range = 34041
    }
    if (result.use_apn === 0) {//自动
      if (this.validator.someValid(['mhostname', 'mcc_mtu', 'mmac_addr'])) {
        //   result_src.hostname,result.hostname,
        //   result_src.cc_mtu,result.cc_mtu,
        //   result_src.mac_addr.toUpperCase(),result.mac_addr.toUpperCase())
        if (result_src.band === result.band &&
          result_src.use_apn === result.use_apn &&
          result_src.hostname === result.hostname &&
          result_src.cc_mtu === result.cc_mtu &&
          result_src.mac_addr.toUpperCase() === result.mac_addr.toUpperCase()) {
          mobileChange = 2;
        }
        mobileValue = {
          band: result.band,
          use_apn: 0,
          hostname: result.hostname,
          cc_mtu: result.cc_mtu,
          mac_addr: result.mac_addr,
          proto: "dhcp",
          range
        }
      } else {
        mobileChange = 1;
        this.validator.showMessages();
        this.forceUpdate();
      }
    }
    if (result.use_apn === 1) {//手动
      if (this.validator.someValid(['apn_name', 'apn_usr', 'apn_pwd'])) {
        if (result_src.band === result.band &&
          result_src.use_apn === result.use_apn &&
          result_src.apn_name === result.apn_name &&
          result_src.apn_usr === result.apn_usr &&
          result_src.apn_pwd === result.apn_pwd &&
          result_src.auth_type === result.auth_type) {
          mobileChange = 2;
        }
        mobileValue = {
          band: result.band,
          use_apn: result.use_apn,
          apn_name: result.apn_name,
          apn_usr: result.apn_usr,
          apn_pwd: result.apn_pwd,
          auth_type: result.auth_type,
          proto: "dhcp",
          range
        }
      } else {
        mobileChange = 1;
        this.validator.showMessages();
        this.forceUpdate();
      }
    }
    this.setState({ mobileChange: mobileChange, mobileValue: mobileValue })
  }
  handleSave = () => {
    this.mobileData().then(() => {
      this.handleSetData()
    })
  }
  changeCloneMac = (event) => {
    let { result } = this.state;
    if (event.target.checked === true) {
      result.mac_addr = this.state.usr_mac.toUpperCase();
    } else {
      result.mac_addr = result.def_mac_addr;
    }
    this.setState({ result })
  }
  renderBand = () => {
    let band = [0, 1, 3, 5, 8, 34, 38, 39, 40, 41]
    return band.map((i, index) => {
      if (i === 0) {
        return <Option value={i} key={index}>{window.__('AUTO')}</Option>
      } else {
        return <Option value={i} key={index}>{i}</Option>
      }
    })
  }
  render() {
    const { result: { wan_mode, hostname, mac_addr, cc_mtu, auth_type, apn_name, band,
      apn_usr, apn_pwd, use_apn }, usr_mac } = this.state;
    return (
      <div ref='mainWizard'>
        <div style={{ height: 20 }}></div>
        <PageText
          title={window.__('WAN Setting')}
          msg={window.__('You can configure the parameters of multiple Internet Access Modes.')}
          showHelp={true}
          helpmsg={window.__("The Access Point Name (APN) is the name for the settings your device reads to set up a connection to the gateway between your carrier's cellular network and the public Internet. Most of the time, your device already has these settings in the system files, and can fill in the APN information automatically when it connects. If the APN can't connect to the Internet automatically, you can change the APN manually.")}
        />
        <FormGroup lable={window.__('Internet Type')}>
          <Select value={'mobile'} onChange={this.handleSelect('wan_mode')} disabled={true}>
            <Option value={'mobile'}>{window.__('4G')}</Option>
          </Select>
        </FormGroup>
        <div style={{ height: 20 }}></div>
        <FormGroup lable={window.__('Band')}>
          <Select value={band} onChange={this.handleSelect('band')}>
            {this.renderBand()}
          </Select>
        </FormGroup>
        {wan_mode === 'mobile' && <>
          <FormGroup lable={window.__('Dialing 4G')}>
            <Select value={use_apn || 0} onChange={this.handleSelect('use_apn')}>
              <Option value={0}>{window.__('Automatic')}</Option>
              <Option value={1}>{window.__('Manual')}</Option>
            </Select>
          </FormGroup>
          {use_apn === 0 ? <>
            {wan_mode === 'mobile' && <>
              <FormGroup lable={window.__('Internet Access Mode')}>
                <Select disabled value={'dhcp'} onChange={this.handleSelect('proto_4g')}>
                  <Option value={'static'}>{window.__('STATIC')}</Option>
                  <Option value={'dhcp'}>{window.__('DHCP')}</Option>
                  <Option value={'pppoe'}>{window.__('PPPOE')}</Option>
                </Select>
              </FormGroup>
              <FormGroup lable={window.__('Host Name')}>
                <input value={hostname || ''} onChange={this.handleChange('hostname')} />
              </FormGroup>
              <div className="tip-err">
                {this.validator.message('mhostname', hostname, 'houtais&&ascii&&max:32', '', {
                  default: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                  max: window.__('Host Name At Most 32 Characters!'),
                  ascii: window.__('Only Supports ASCII Code!'),
                })}</div>

              <FormGroup lable={window.__('MTU')}>
                <input value={cc_mtu || ''} onChange={this.handleChange('cc_mtu')} />
                <div className="tip-err">
                  {this.validator.message('mcc_mtu', cc_mtu, 'required&&range:576-1500', '', {
                    default: window.__('MTU Field Required!'),
                    range: window.__('MTU Range Is 576-1500!')
                  })}</div>
              </FormGroup>
              <FormGroup lable={window.__('MAC Address')}>
                <input value={mac_addr || ''} onChange={this.handleChange('mac_addr')} />
                <div className="tip-err">
                  {this.validator.message('mmac_addr', mac_addr, 'required&&mac', '', {
                    default: window.__('MAC Address Field Required!'),
                    mac: window.__('Valid Format Is XX:XX:XX:XX:XX:XX!')
                  })}</div>
              </FormGroup>
              {mac_addr && usr_mac && <FormRadioCheck>
                <Checkbox checked={mac_addr.toUpperCase() === usr_mac.toUpperCase()} onChange={this.changeCloneMac}>
                  {window.__('Clone MAC Address')}
                </Checkbox>
              </FormRadioCheck>}
            </>}
          </> : <>
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
        </>}
        <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>
        <Progress
          showProgress={this.state.showProgress}
          locktime={this.state.locktime}
          handleRedirect={this.handleRedirect}
          message='Configuring...Please Do Not Shut Down The Device,Completed After ' />

        <div style={{ height: 48 }}></div>
      </div>
    );
  }
} 