import React, { Component } from 'react';
import { FormGroup, FormButton, PageText, Progress, FormPassword, FormRadioCheck } from '@/screens/components';
import { axios, HYID, posturl, smsurl, sms_HYID, deepCopy, handleRedir } from '@/share';
import { message, Select, Checkbox } from 'antd';
import ReactValidator from '@/share/validator/index.js';
import { connect } from 'react-redux'
import { actionCreater } from '@/proconfig/store'

const { Option } = Select;

class WANPrior extends Component {
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
    wiredChange: 0,
    wiredValue: {},
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
        HYID: sms_HYID.get_wan_config
      },
      url: smsurl
    }).then((res) => {
      if (res.errcode === 2000) {
        this.setState({
          result: deepCopy(res.huayi_r),
          result_src: deepCopy(res.huayi_r)
        })
      }
    })
  };
  setEthWanConfig = (values) => {

    axios.post({
      data: {
        HYID: sms_HYID.set_eth_wan_config,
        ...values,
      },
      url: smsurl
    }).then((res) => {
      if (res.errcode === 2000) {
        if (res.progresstime !== 0) {
          this.props.setFresh(false)
        }
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
      showProgress: false,
    }, () => { this.props.setFresh(true) })
  }

  handleSetData = () => {
    let result = deepCopy(this.state.result);
    let result_src = deepCopy(this.state.result_src);
    let values = {}
    if (result.wan_mode === "wired") {
      if (this.state.wiredChange === 1) {
        return;
      }
      if (this.state.wiredChange === 2 && (result.wan_mode === result_src.wan_mode)) {
        message.success(window.__('Data Up to Date'))
        return false;
      }
      values = {
        wan_mode: "wired",
        ...this.state.wiredValue,
      }
      this.setEthWanConfig(values)
    } else if (result.wan_mode === "mobile") {
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
    } else {
      if (this.state.wiredChange === 1 || this.state.mobileChange === 1) {
        return;
      }
      if (this.state.wiredChange === 2 && this.state.mobileChange === 2 && (result.wan_mode === result_src.wan_mode && result.detect_ip === result_src.detect_ip)) {
        message.success(window.__('Data Up to Date'))
        return;
      }
      values = {
        wan_mode: "prior",
        detect_ip: this.state.result.detect_ip,
        ...this.state.mobileValue,
        ...this.state.wiredValue,
      }
      this.setEthWanConfig(values)
    }
  }
  handleSelect = name => value => {
    let result = deepCopy(this.state.result);
    if (name === 'wan_mode') {
      if (value === 'mobile') {
        result.proto = 'dhcp';
      }
      else if (value === 'wired' || 'prior') {
        result.proto = this.state.result_src.proto;
      }
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
    console.log(result);
    if (result.wan_mode === "mobile") {//4g
      if (result.use_apn === 0) {//自动
        if (this.validator.someValid(['mhostname', 'mcc_mtu', 'mmac_addr'])) {
          if (result_src.use_apn === result.use_apn &&
            result_src.hostname === result.hostname &&
            result_src.cc_mtu === result.cc_mtu &&
            result_src.mac_addr.toUpperCase() === result.mac_addr.toUpperCase()&&result_src.band === result.band) {
            mobileChange = 2;
          }
          mobileValue = {
            use_apn: 0,
            hostname: result.hostname,
            cc_mtu: result.cc_mtu,
            mac_addr: result.mac_addr,
            proto: "dhcp",
            band:result.band
          }
        } else {
          mobileChange = 1;
          this.validator.showMessages();
          this.forceUpdate();
        }
      }
    }
    if (result.wan_mode === "prior") {//有线优先下的4g
      if (result.use_apn === 0) {//自动
        if (result_src.use_apn === result.use_apn) {
          mobileChange = 2;
        }
        mobileValue = {
          use_apn: 0,
          hostname: result_src.hostname,
          cc_mtu: result_src.cc_mtu,
          proto_4g: "dhcp"
        }
      }
    }
    if (result.wan_mode === "prior" || result.wan_mode === "mobile") {
      if (result.use_apn === 1) {//手动
        if (this.validator.someValid(['apn_name', 'apn_usr', 'apn_pwd'])) {
          if (result_src.use_apn === result.use_apn &&
            result_src.apn_name === result.apn_name &&
            result_src.apn_usr === result.apn_usr &&
            result_src.apn_pwd === result.apn_pwd &&
            result_src.auth_type === result.auth_type) {
            mobileChange = 2;
          }
          mobileValue = {
            use_apn: result.use_apn,
            apn_name: result.apn_name,
            apn_usr: result.apn_usr,
            apn_pwd: result.apn_pwd,
            auth_type: result.auth_type,
            proto: "dhcp"
          }
        } else {
          mobileChange = 1;
          this.validator.showMessages();
          this.forceUpdate();
        }
      }
    }
    this.setState({ mobileChange: mobileChange, mobileValue: mobileValue })
  }
  wiredData = async () => {
    let wiredChange = 0;//0是正常，1是格式错误，2是数据未修改
    let wiredValue = {}
    let result = deepCopy(this.state.result);
    let result_src = deepCopy(this.state.result_src);
    if (result.proto === 'dhcp') {
      if (this.validator.someValid(['hostname', 'mac_addr', 'cc_mtu'])) {
        if (result_src.proto === result.proto &&
          result_src.hostname === result.hostname &&
          result_src.mac_addr.toUpperCase() === result.mac_addr.toUpperCase() &&
          result_src.cc_mtu === result.cc_mtu) {
          wiredChange = 2
          this.setState({ wiredChange, wiredValue })
        }
        wiredValue = {
          proto: 'dhcp',
          cc_mtu: result.cc_mtu,
          hostname: result.hostname,
          mac_addr: result.mac_addr.toUpperCase(),
        }
      } else {
        wiredChange = 1
        this.validator.showMessages();
        this.forceUpdate();
      }
    } else if (result.proto === 'static') {
      if (this.validator.someValid(['ip_addr', 'subnet_mask', 'gateway', 'dns0', 'dns1', 'mac_addr', 'cc_mtu'])) {
        if (result.dns_arr[0] === result.dns_arr[1]) {

          message.error(window.__('DNS1 Can Not Same As DNS2!'))
          wiredChange = 1
          this.setState({ wiredChange, wiredValue })
        } else if (result_src.proto === result.proto &&
          result_src.ip_addr === result.ip_addr &&
          result_src.subnet_mask === result.subnet_mask &&
          result_src.gateway === result.gateway &&
          String(result_src.dns_arr) === String(result.dns_arr) &&
          result_src.mac_addr.toUpperCase() === result.mac_addr.toUpperCase() &&
          result_src.cc_mtu === result.cc_mtu) {
          wiredChange = 2
        }
        wiredValue = {
          proto: 'static',
          ip_addr: result.ip_addr,
          subnet_mask: result.subnet_mask,
          gateway: result.gateway,
          dns_arr: result.dns_arr,
          mac_addr: result.mac_addr,
          cc_mtu: result.cc_mtu,
        }
      } else {
        wiredChange = 1
        this.validator.showMessages();
        this.forceUpdate();
      }
    } else if (result.proto === 'pppoe') {
      if (this.validator.someValid(['usr', 'pwd', 'ac', 'service', 'ppp_mtu', 'mac_addr'])) {
        if (result_src.proto === result.proto &&
          result_src.usr === result.usr &&
          result_src.pwd === result.pwd &&
          result_src.service === result.service &&
          result_src.ppp_mtu === result.ppp_mtu &&
          result_src.ac === result.ac &&
          result_src.mac_addr.toUpperCase() === result.mac_addr.toUpperCase()) {
          wiredChange = 2
        }
        wiredValue = {
          proto: 'pppoe',
          ppp_mtu: result.ppp_mtu,
          ac: result.ac,
          service: result.service,
          mac_addr: result.mac_addr.toUpperCase(),
          usr: result.usr,
          pwd: result.pwd,
        }
      } else {
        wiredChange = 1
        this.validator.showMessages();
        this.forceUpdate();
      }
    }
    this.setState({ wiredChange, wiredValue })
  }
  handleSave = () => {
    let result = deepCopy(this.state.result);
    if (result.wan_mode === "wired") {
      this.wiredData()
        .then(() => {
          this.handleSetData()
        })
    } else if (result.wan_mode === "mobile") {
      this.mobileData().then(() => {
        this.handleSetData()
      })
    } else {
      this.mobileData()
      this.wiredData().then(() => {
        this.handleSetData()
      })
    }
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
      }
      else {
        return <Option value={i} key={index}>{i}</Option>
      }
    })
  }
  render() {
    const { result: { wan_mode, def_mac_addr, proto, ip_addr, subnet_mask, gateway, dns_arr,
      usr, pwd, ac, service, hostname, mac_addr, ppp_mtu, cc_mtu, auth_type, apn_name,
      apn_usr, apn_pwd, use_apn, proto_4g, detect_ip ,band} } = this.state;

    return (
      <div>
        <div style={{ height: 20 }}></div>
        <PageText
          title={window.__('WAN Setting')}
          msg={window.__('You can configure the parameters of multiple Internet Access Modes.')}
          showHelp={true}
          helpmsg={window.__("The Access Point Name (APN) is the name for the settings your device reads to set up a connection to the gateway between your carrier's cellular network and the public Internet. Most of the time, your device already has these settings in the system files, and can fill in the APN information automatically when it connects. If the APN can't connect to the Internet automatically, you can change the APN manually.")}
        />

        <FormGroup lable={window.__('Internet Type')}>
          <Select value={wan_mode || ''} onChange={this.handleSelect('wan_mode')}>
            <Option value={'prior'}>{window.__('Wired priority')}</Option>
            <Option value={'wired'}>{window.__('Wired')}</Option>
            <Option value={'mobile'}>{window.__('4G')}</Option>
          </Select>
        </FormGroup>
        {wan_mode === 'prior' && <>
          <FormGroup lable={window.__('Detect External Network Address')}>
            <input value={detect_ip || ''} onChange={this.handleChange('detect_ip')} />
            <div className="tip-err">
              {this.validator.message('detect_ip', detect_ip, 'required&&url&&max:63&&houtais', '', {
                default: window.__('IP Or Domain Field Required!'),
                houtais: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                url: window.__('IP Or Domain Format Invalid,Valid Format Is xxx.yyy.zzz(such as baidu.com,www.baidu.com)!'),
                max: window.__('IP or Domain Name At Most 63 Characters!')
              })}</div>
          </FormGroup>
          {/* <FormGroup lable={window.__('Detection Interval(s)')}>
              <input value={detect_time} onChange={this.handleChange('detect_time')}/>                
                <div className="tip-err">
                {this.validator.message('detect_time', detect_time, 'required&&number','',{
                  default: window.__('Second Field Required!'),
                  number:  window.__('Second Field Required!'),
                })}</div>  
            </FormGroup> */}
        </>}
        <div style={{ height: 20 }}></div>
                <FormGroup lable={window.__('Band')}>
                  <Select value={band} onChange={this.handleSelect('band')}>
                    {this.renderBand()}
                  </Select>
                </FormGroup>
        {wan_mode !== 'mobile' && <>
          {wan_mode === 'prior' && <div style={{ fontSize: 22 }}>{window.__('Wired')}</div>}
          <FormGroup lable={window.__('Internet Access Mode')}>
            <Select value={proto || ''} onChange={this.handleSelect('proto')}>
              <Option value={'static'}>{window.__('STATIC')}</Option>
              <Option value={'dhcp'}>{window.__('DHCP')}</Option>
              <Option value={'pppoe'}>{window.__('PPPOE')}</Option>
            </Select>
          </FormGroup>
          {
            proto === 'dhcp' ? <>
              <FormGroup lable={window.__('Host Name')}>
                <input value={hostname || ''} onChange={this.handleChange('hostname')} />
              </FormGroup>
              <div className="tip-err">
                {this.validator.message('hostname', hostname, 'houtais&&ascii&&max:32', '', {
                  default: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                  max: window.__('Host Name At Most 32 Characters!'),
                  ascii: window.__('Only Supports ASCII Code!'),
                })}</div>

              <FormGroup lable={window.__('MTU')}>
                <input value={cc_mtu || ''} onChange={this.handleChange('cc_mtu')} />
                <div className="tip-err">
                  {this.validator.message('cc_mtu', cc_mtu, 'required&&range:576-1500', '', {
                    default: window.__('MTU Field Required!'),
                    range: window.__('MTU Range Is 576-1500!')
                  })}</div>
              </FormGroup>
            </> :
              proto === 'static' ? <>
                <FormGroup lable={window.__('IP Address')}>
                  <input value={ip_addr || ''} onChange={this.handleChange('ip_addr')} />
                  <div className="tip-err">
                    {this.validator.message('ip_addr', ip_addr, 'required&&ip', '', {
                      default: window.__('IP Address Field Required!'),
                      ip: window.__('IP Address Format Invalid!'),
                    })}</div>
                </FormGroup>

                <FormGroup lable={window.__('Subnet Mask')}>
                  <input value={subnet_mask || ''} onChange={this.handleChange('subnet_mask')} />
                  <div className="tip-err">
                    {this.validator.message('subnet_mask', subnet_mask, 'required&&netmask', '', {
                      default: window.__('Subnet Mask Field Required!'),
                      netmask: window.__('Subnet Mask Format Invalid!'),
                    })}</div>
                </FormGroup>

                <FormGroup lable={window.__('Default Gateway')}>
                  <input value={gateway || ''} onChange={this.handleChange('gateway')} />
                  <div className="tip-err">
                    {this.validator.message('gateway', gateway, 'required&&ip', '', {
                      default: window.__('Default Gateway Field Required!'),
                      ip: window.__('Default Gateway Format Invalid!')
                    })}</div>
                </FormGroup>

                <FormGroup lable={window.__('DNS1')}>
                  <input value={dns_arr[0] || ''} onChange={this.handleChange('dns0')} />
                  <div className="tip-err">
                    {this.validator.message('dns0', dns_arr[0], 'required&&ip', '', {
                      default: window.__('DNS1 Field Required!'),
                      ip: window.__('DNS1 Format Invalid!'),
                    })}</div>
                </FormGroup>

                <FormGroup lable={window.__('DNS2')}>
                  <input value={dns_arr[1] || ''} onChange={this.handleChange('dns1')} />
                  <div className="tip-err">
                    {this.validator.message('dns1', dns_arr[1] || '', 'ip', '', {
                      default: window.__('DNS2 Field Required!'),
                      ip: window.__('DNS2 Format Invalid!'),
                    })}</div>
                </FormGroup>

                <FormGroup lable={window.__('MTU')}>
                  <input value={cc_mtu || ''} onChange={this.handleChange('cc_mtu')} />
                  <div className="tip-err">
                    {this.validator.message('cc_mtu', cc_mtu, 'required&&range:576-1500', '', {
                      default: window.__('MTU Field Required!'),
                      range: window.__('MTU Range Is 576-1500!')
                    })}</div>
                </FormGroup>
              </> :
                proto === 'pppoe' ? <>
                  <FormGroup lable={window.__('Account')}>
                    <input value={usr || ''} onChange={this.handleChange('usr')} />
                  </FormGroup>
                  <div className="tip-err">
                    {this.validator.message('usr', usr, 'required&&max:128&&min:1&&ascii&&houtais', '', {
                      default: window.__('Account Field Required!'),
                      houtais: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                      ascii: window.__('Only Supports ASCII Code!'),
                      min: window.__('Account At Least 1 Character!'),
                      max: window.__('Account At Most 128 Characters!'),
                    })}</div>

                  <FormPassword lable={window.__('Password')}
                    value={pwd || ''} onChange={this.handleChange('pwd')}>
                  </FormPassword>
                  <div className="tip-err">
                    {this.validator.message('pwd', pwd, 'required&&max:128&&min:1&&ascii&&houtais', '', {
                      default: window.__('Password Field Required!'),
                      houtais: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                      ascii: window.__('Only Supports ASCII Code!'),
                      min: window.__('Password At Least 1 Character!'),
                      max: window.__('Password At Most 128 Characters!'),
                    })}</div>

                  <FormGroup lable={window.__('AC')}>
                    <input value={ac || ''} placeholder={window.__("AUTO Leave Blank To Auto Detect")}
                      onChange={this.handleChange('ac')} />
                  </FormGroup>
                  <div className="tip-err">
                    {this.validator.message('ac', ac, 'max:32&&houtais', '', {
                      default: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                      max: window.__('AC At Most 32 Characters!'),
                    })}</div>

                  <FormGroup lable={window.__('Service Name')}>
                    <input value={service || ''} placeholder={window.__("AUTO Leave Blank To Auto Detect")}
                      onChange={this.handleChange('service')} />
                  </FormGroup>
                  <div className="tip-err">
                    {this.validator.message('service', service, 'max:32&&houtais', '', {
                      default: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                      max: window.__('Server At Most 32 Characters!'),
                    })}</div>

                  <FormGroup lable={window.__('MTU')}>
                    <input value={ppp_mtu || ''} onChange={this.handleChange('ppp_mtu')} />
                    <div className="tip-err">
                      {this.validator.message('ppp_mtu', ppp_mtu, 'required&&range:576-1492', '', {
                        default: window.__('MTU Field Required!'),
                        range: window.__('MTU Range Is 576-1492!')
                      })}</div>
                  </FormGroup></> : null}
          <FormGroup lable={window.__('MAC Address')}>
            <input value={mac_addr || ''} onChange={this.handleChange('mac_addr')} />
            <div className="tip-err">
              {this.validator.message('mac_addr', mac_addr, 'required&&mac', '', {
                default: window.__('MAC Address Field Required!'),
                mac: window.__('Valid Format Is XX:XX:XX:XX:XX:XX!')
              })}</div>
          </FormGroup>

          <FormRadioCheck>
            <Checkbox checked={mac_addr !== def_mac_addr} onChange={this.changeCloneMac}>
              {window.__('Clone MAC Address')}
            </Checkbox>
          </FormRadioCheck>
        </>}
        {(wan_mode === 'prior' || wan_mode === 'mobile') && <>
          {wan_mode === 'prior' && <>
            <div style={{ height: 20 }}></div>
            <div style={{ fontSize: 22 }}>{window.__('4G')}</div>
          </>}
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

              <FormRadioCheck>
                <Checkbox checked={mac_addr !== def_mac_addr} onChange={this.changeCloneMac}>
                  {window.__('Clone MAC Address')}
                </Checkbox>
              </FormRadioCheck>
            </>}
          </> : <>
            <FormGroup lable={window.__('APN Name')}>
              <input value={apn_name || ''}
                // disabled={wan_mode==='wired'}
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
                // disabled={wan_mode==='wired'}
                onChange={this.handleChange('apn_usr')} />
              <div className="tip-err">
                {this.validator.message('apn_usr', apn_usr, 'apnusername&&max:32', '', {
                  default: window.__('Limited To English Letters And Characters, Numbers,But Not Contain The Following: \" & \' < > ` \\'),
                  max: window.__('User Name At Most 32 Characters!'),
                })}</div>
            </FormGroup>
            <FormPassword lable={window.__('Password')}
              // disabled={wan_mode==='wired'}      
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
                // disabled={wan_mode==='wired'}
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
const mapState = (state) => ({
  canFresh: state.getIn(['common', 'canFresh']),
})

const mapDispatch = (dispatch) => ({
  setFresh(args) {
    dispatch(actionCreater.setFresh(args))
  },
})

export default connect(mapState, mapDispatch)(WANPrior)