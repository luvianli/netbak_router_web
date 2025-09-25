import React, { Component } from 'react';
import { FormGroup, PageText, FormButton, FormRadioCheck, FormPassword, Progress } from '@/screens/components';
import { axios, HYID, posturl, deepCopy, handleRedir } from '@/share';
import ReactValidator from '@/share/validator/index.js';
import { message, Switch, Select, Checkbox, Radio, Input } from 'antd';
import { connect } from 'react-redux'
import { actionCreater } from './store'
const { Option } = Select;

class Base2G extends Component {
  state = {
    result: {
      hwmode: "1",
      wifi_admin: 1,
      band_steering: 0,
      encryp: 0
    },
    simple: this.props.simple || false,
    showProgress: false,
    locktime: 0,
  }

  componentWillMount() {
    this.validator = new ReactValidator();
  }
  componentDidMount() {
    this.getData()
  }
  getData = () => {
    axios.post({
      data: {
        HYID: HYID.get_wireless_basic_config,
        wifi_radio: this.props.radio_id
      },
      url: posturl
    }).then((res) => {
      if (res.errcode === 2000) {
        this.setState({
          result: deepCopy(res.huayi_r),
          result_src: deepCopy(res.huayi_r),
        })
        this.props.sendWirelessEnable(this.props.radio_id, res.huayi_r.wifi_admin)
      }
    })
  }
  setData = (values) => {
    axios.post({
      data: {
        HYID: HYID.set_wireless_basic_config,
        wifi_radio: this.props.radio_id,
        ...values
      },
      url: posturl
    }).then((res) => {
      if (res.errcode === 2000) {
        if (res.progresstime !== 0) {
          this.setState({
            showProgress: res.progresstime !== 0,
            locktime: res.progresstime,
          })
        }
        else {
          message.success(window.__('Success'))
          this.props.sendWirelessEnable(this.props.radio_id, values.wifi_admin)
          this.getData()
        }
      }
    })
  }
  handleRedirect = () => {
    this.setState({
      showProgress: false,
      locktime: 0
    })
    this.props.sendWirelessEnable(this.props.radio_id, this.state.result.wifi_admin)
    this.getData()
  }
  handleSave = () => {
    const { wifi_admin, noforward, band_steering, hwmode, band, channel, hidden,
      tx_power, ssid, max_num, encryp, key } = this.state.result
    const { result } = this.state
    let result_src = this.state.result_src
    let validarr = ['ssid', 'max_num'];
    if(result.auth_mode){
      if(result.auth_mode === "WPA-Enterprise" ||result.auth_mode === "WPA2-Enterprise" || result.auth_mode === "WPAWPA2-Enterprise"){
        // Enterprise mode validation
        validarr.push('auth_server', 'auth_port', 'auth_secret')
      } else if(result.auth_mode!=="disable"){
        validarr.push('key')
      }
    }else if (encryp !== 0) {
      validarr.push('key')
    }
    if (wifi_admin === 0) {
      if (result_src.wifi_admin === wifi_admin) {
        message.success(window.__('Data Up to Date'))
        return;
      } else {
        let value = result_src;
        value.wifi_admin = 0;
        this.setData(value)
        return;
      }
    }
    if (this.validator.someValid(validarr)) {
      if(result.auth_mode){
        if(result.auth_mode==="disable"){
          if (result_src.ssid === ssid &&
            result_src.max_num === max_num&&
            result_src.hwmode === hwmode&&
            result_src.wifi_admin === wifi_admin&&
            result_src.noforward === noforward&&
            result_src.band_steering === band_steering&&
            result_src.band === band&&
            result_src.channel === channel&&
            result_src.tx_power === tx_power&&
            result_src.hidden === hidden&&
            result_src.auth_mode === result.auth_mode) {
            message.success(window.__('Data Up to Date'))
            return;
          }else{
            let values = {
              wifi_admin, noforward, band_steering, hwmode, band, channel, hidden,
              tx_power, ssid, max_num, auth_mode:result.auth_mode, cipher_mode:result_src.cipher_mode, key: result_src.key
            }
            this.setData(values)
          }
        }else{
          // Check if it's Enterprise mode
          if(result.auth_mode === "WPA-Enterprise" ||result.auth_mode === "WPA2-Enterprise" || result.auth_mode === "WPAWPA2-Enterprise"){
            if (result_src.ssid === ssid &&
              result_src.max_num === max_num&&
              result_src.hwmode === hwmode&&
              result_src.wifi_admin === wifi_admin&&
              result_src.noforward === noforward&&
              result_src.band_steering === band_steering&&
              result_src.band === band&&
              result_src.channel === channel&&
              result_src.tx_power === tx_power&&
              result_src.hidden === hidden&&
              result_src.auth_mode === result.auth_mode &&
              result_src.cipher_mode === result.cipher_mode &&
              result_src.auth_server === result.auth_server &&
              result_src.auth_port === result.auth_port &&
              result_src.auth_secret === result.auth_secret) {
              message.success(window.__('Data Up to Date'))
              return;
            }else {
              let values = {
                wifi_admin, noforward, band_steering, hwmode, band, channel, hidden,
                tx_power, ssid, max_num, auth_mode:result.auth_mode, cipher_mode:result.cipher_mode,
                auth_server: result.auth_server, auth_port: result.auth_port, auth_secret: result.auth_secret
              }
              this.setData(values)
            }
          } else {
            // Non-Enterprise modes
            if (result_src.ssid === ssid &&
              result_src.max_num === max_num&&
              result_src.hwmode === hwmode&&
              result_src.wifi_admin === wifi_admin&&
              result_src.noforward === noforward&&
              result_src.band_steering === band_steering&&
              result_src.band === band&&
              result_src.channel === channel&&
              result_src.tx_power === tx_power&&
              result_src.hidden === hidden&&
              result_src.auth_mode === result.auth_mode &&
              result_src.cipher_mode === result.cipher_mode &&
              result_src.key === key) {
              message.success(window.__('Data Up to Date'))
              return;
            }else {
              let values = {
                wifi_admin, noforward, band_steering, hwmode, band, channel, hidden,
                tx_power, ssid, max_num, auth_mode:result.auth_mode, cipher_mode:result.cipher_mode, key
              }
              this.setData(values)
            }
          }
        }
      }else{
        if(encryp===0){
          if (result_src.ssid === ssid &&
            result_src.max_num === max_num &&
            result_src.hwmode === hwmode &&
            result_src.wifi_admin === wifi_admin &&
            result_src.noforward === noforward &&
            result_src.band_steering === band_steering &&
            result_src.band === band &&
            result_src.channel === channel &&
            result_src.tx_power === tx_power &&
            result_src.hidden === hidden &&
            result_src.encryp === encryp) {
            message.success(window.__('Data Up to Date'))
            return;
          }else{
            let values = {
              wifi_admin, noforward, band_steering, hwmode, band, channel, hidden,
              tx_power, ssid, max_num, encryp, key: result_src.key
            }
            this.setData(values)
          }
        }else{
          if (result_src.ssid === ssid &&
            result_src.max_num === max_num &&
            result_src.hwmode === hwmode &&
            result_src.wifi_admin === wifi_admin &&
            result_src.noforward === noforward &&
            result_src.band_steering === band_steering &&
            result_src.band === band &&
            result_src.channel === channel &&
            result_src.tx_power === tx_power &&
            result_src.hidden === hidden &&
            result_src.encryp === encryp&&
            result_src.key === key) {
            message.success(window.__('Data Up to Date'))
            return;
          }else{
            let values = {
              wifi_admin, noforward, band_steering, hwmode, band, channel, hidden,
              tx_power, ssid, max_num, encryp, key
            }
            this.setData(values)
          }
        }
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  handleChangeChecked = (name) => event => {
    let result = deepCopy(this.state.result);
    let value = event.target.checked;
    result[name] = value === true ? 1 : 0;
    this.setState({ result });
  };
  handleChange = name => event => {
    let result = deepCopy(this.state.result)
    result[name] = event.target.value
    this.setState({ result });
  };

  handleSelect = (name) => value => {
    let result = deepCopy(this.state.result);
    if (name === 'encryp') {
      result.key = value === 0 ? '' : this.state.result_src.key;
    }
    if(name === 'auth_mode'){
      result.cipher_mode = value === 'disable' ? this.state.result_src.cipher_mode : this.state.result.cipher_mode;
      result.key = value === 'disable' ? this.state.result_src.key : this.state.result.key;
    }

    if (name === 'band' && this.props.radio_id === 1 && value !== 0) {
      result.channel = 0
    }
    if (name === 'hwmode') {
      switch (value) {
        case 6:
        case 8:
        case 9:
          if (result.band === 2) {//80M
            result.band = 0;//20M
          }
          break;
        case 2:
        case 4:
        case 1:
          if (result.band !== 0) {//20M
            result.band = 0;//20M
          }
          break;
        default:
          break;
      }
    }
    result[name] = value;
    this.setState({ result });
  }
  handleChange_toNum = name => event => {
    let result = deepCopy(this.state.result)
    let value = Number(event.target.value)
    /**频段转换，将频宽值也转为默认值 */
    if (name === 'hwmode') {
      if (value === 1 || value === 4) result['bw'] = 0 //20M
      if (value === 6 || value === 9) result['bw'] = 1  //AUTO
    }

    result[name] = value
    //setFlag2 = this.state.result_src[name] !== result[name]
    this.setState({ result });
  };

  /**信道 2.4G  CN信道范围1-13;  US信道范围1-11;  OT信道范围1-13；  EU信道范围1-13*/
  renderChannel = () => {
    const channel_2g = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    const channel_5g = [0, 36, 40, 44, 48, 52, 56, 60, 64, 149, 153, 157, 161];
    if (this.props.radio_id === 1 && this.state.result.band === 0) {//5G 20M 信道支持165
      channel_5g.push(165)
    }

    let channel = this.props.radio_id === 0 ? channel_2g : channel_5g;
    return channel.map(item => {
      return <Option key={item} value={item}>{item === 0 ? 'AUTO' : item}</Option>
    })
  }
  changeMode = (value) => {
    let result = deepCopy(this.state.result);
    result["cipher_mode"] = value;
    this.setState({ result });
  }
  render() {
    const { result: { wifi_admin, noforward, band_steering, hwmode, band,
      channel, hidden, tx_power, ssid, max_num, encryp, key }, result } = this.state
    return (
      <div>
        <PageText
          title={this.props.radio_id === 0 ? '2.4G ' + window.__('Basic Setting')
            : '5.8G ' + window.__('Basic Setting')}
        />

        <div>
          <FormGroup lable={window.__('Enable/Disable')}>
            <Select onChange={this.handleSelect("wifi_admin")} value={wifi_admin}>
              <Option value={0}>{window.__("Disable")}</Option>
              <Option value={1} >{window.__("Enable")}</Option>
            </Select>
          </FormGroup>
          {wifi_admin === 1 ? <div>
            <div style={{ display: this.state.simple ? "none" : "block" }}>
              <FormGroup lable={window.__('BandSteering')}>
                <Select onChange={this.handleSelect("band_steering")} value={band_steering}>
                  <Option value={0}>{window.__("Disable")}</Option>
                  <Option value={1} >{window.__("Enable")}</Option>
                </Select>
              </FormGroup>
            </div>

            <FormGroup lable={window.__('SSID')}>
              <input value={ssid || ''} onChange={this.handleChange('ssid')} />
              <div className="tip-err">
                {this.validator.message('ssid', ssid, 'required&&ssid&&max:32&&houtais', '', {
                  default: window.__('SSID Field Required!'),
                  houtais: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                  max: window.__('SSID At Most 32 Characters!'),
                  ssid: window.__('Chinese Characters, Numbers, Letters, Underscores, Bars, Spaces Are Vaild!')
                })}</div>
            </FormGroup>

            <FormGroup lable={window.__('Maximum Clients')}>
              <input value={max_num || ''}
                onChange={this.handleChange('max_num')}
              />
              <div className='tip' >{window.__('Range 1-32,Default 32')}</div>
              <div className="tip-err">
                {this.validator.message('max_num', max_num, 'required&&range:1-32', '', {
                  default: window.__('Range 1-32,Default 32'),
                })}
              </div>
            </FormGroup>

            <FormRadioCheck lable={window.__('Hide SSID')}>
              <Checkbox checked={hidden === 1} onChange={this.handleChangeChecked('hidden')} />
            </FormRadioCheck>
            {
              this.props.radio_id === 0 ?
                <FormGroup lable={window.__('Wireless Mode')}>
                  <Select onChange={this.handleSelect("hwmode")} value={hwmode}>
                    <Option value={1}>11B</Option>
                    <Option value={4} >11G</Option>
                    <Option value={6} >11N</Option>
                    <Option value={9} >11BGN</Option>
                  </Select>
                </FormGroup>

                : <FormGroup lable={window.__('Wireless Mode')}>
                  <Select onChange={this.handleSelect("hwmode")} value={hwmode}>
                    <Option value={2}>11A</Option>
                    <Option value={8} >11AN</Option>
                    <Option value={14} >11AC</Option>
                  </Select>
                </FormGroup>
            }
            {
              hwmode === 2 || //11A
                hwmode === 1 ||   //11B
                hwmode === 4 ?    //11G
                <FormGroup lable={window.__('Bandwidth')}>
                  <Select onChange={this.handleSelect("band")} value={band} >
                    <Option value={0}>20M</Option>
                  </Select>
                </FormGroup>
                : hwmode === 6 || //11N
                  hwmode === 9 ||   //11BGN
                  hwmode === 8 ?    //11AN
                  <FormGroup lable={window.__('Bandwidth')}>
                    <Select onChange={this.handleSelect("band")} value={band}>
                      <Option value={1}>AUTO</Option>
                      <Option value={0}>20M</Option>
                    </Select>
                  </FormGroup>
                  : hwmode === 14 ? //11AC          
                    <FormGroup lable={window.__('Bandwidth')}>
                      <Select onChange={this.handleSelect("band")} value={band}>
                        <Option value={1}>AUTO</Option>
                        <Option value={0}>20M</Option>
                        <Option value={2} >80M</Option>
                      </Select>
                    </FormGroup>
                    : null
            }

            <FormGroup lable={window.__('Isolated')}>
              <Select onChange={this.handleSelect("noforward")} value={noforward}>
                <Option value={0}>{window.__("Disable")}</Option>
                <Option value={1} >{window.__("Enable")}</Option>
              </Select>
            </FormGroup>

            <FormGroup lable={window.__('Channel')}>
              <Select onChange={this.handleSelect("channel")} value={channel}>
                {this.renderChannel()}
              </Select>
            </FormGroup>
            <FormGroup lable={window.__('TX Power')}>
              <Select onChange={this.handleSelect("tx_power")} value={tx_power}>
                <option value={100}>100%</option>
                <option value={75}  >75%</option>
                <option value={50}  >50%</option>
                <option value={25}  >25%</option>
                <option value={12}>12.5%</option>
                <option value={0}    >0%</option>
              </Select>
            </FormGroup>
            {result.auth_mode ?
              <div>
                <FormGroup lable={window.__('Security Mode')}>
                  <Select onChange={this.handleSelect("auth_mode")} value={result.auth_mode}>
                    <Option value={"disable"}>{window.__("Disable")}</Option>
                    <Option value={"WPAPSK"} >{window.__("WPAPSK")}</Option>
                    <Option value={"WPA2PSK"} >{window.__("WPA2PSK")}</Option>
                    <Option value={"WPAPSKWPA2PSK"} >{window.__("WPAPSKWPA2PSK")}</Option>
                    <Option value={"WPA-Enterprise"} >{window.__("WPA-Enterprise")}</Option>
                    <Option value={"WPA2-Enterprise"} >{window.__("WPA2-Enterprise")}</Option>
                    <Option value={"WPAWPA2-Enterprise"} >{window.__("WPAWPA2-Enterprise")}</Option>
                  </Select>
                </FormGroup>
                {result.auth_mode !== "disable" &&result.auth_mode !=="WPA-Enterprise"&&result.auth_mode !=="WPA2-Enterprise"&&result.auth_mode !=="WPAWPA2-Enterprise" && <>
                  <FormRadioCheck lable={window.__('Cipher Mode')}>
                    <Radio.Group onChange={this.handleChange('cipher_mode')} value={result.cipher_mode}>
                      <Radio value={"TKIP"}>{window.__('TKIP')}</Radio>
                      <Radio value={"AES"}>{window.__('AES')}</Radio>
                      <Radio value={"TKIPAES"}>{window.__('TKIPAES')}</Radio>
                    </Radio.Group>
                  </FormRadioCheck>
                  <FormPassword lable={window.__('Password')}
                    value={key || ""}
                    onChange={this.handleChange('key')}>
                  </FormPassword>
                  <div className="tip-err">
                    {this.validator.message('key', key, 'required&&min:8&&max:63&&password&&houtais', '', {
                      default: window.__('Password Field Required!'),
                      houtais: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                      min: window.__('Password At Least 8 Characters!'),
                      max: window.__('Password At Most 63 Characters!'),
                      password: window.__('Only Supports ASCII Code!')
                    })}</div>
                </>
                }
                {(result.auth_mode === "WPA-Enterprise" ||result.auth_mode === "WPA2-Enterprise" || result.auth_mode === "WPAWPA2-Enterprise") && <>
                  <FormGroup lable={window.__('Authentication Server')}>
                    <Input
                      value={result.auth_server || ""}
                      onChange={this.handleChange('auth_server')}
                      placeholder={window.__('Enter server address')}
                    />

                    <div className="tip-err">
                      {this.validator.message('auth_server', result.auth_server, 'required', '', {
                        default: window.__('Authentication Server Field Required!')
                      })}
                    </div>
                  </FormGroup>

                  <FormGroup lable={window.__('Authentication Port')}>
                    <Input
                      value={result.auth_port || ""}
                      onChange={this.handleChange('auth_port')}
                      placeholder={window.__('Enter server port (e.g., 1812)')}
                    />
                    <div className="tip-err">
                      {this.validator.message('auth_port', result.auth_port, 'required&&range:1-65535', '', {
                        default: window.__('Authentication Port Field Required!'),
                        range: window.__('Port must be between 1 and 65535!')
                      })}
                    </div>
                  </FormGroup>

                  <FormPassword lable={window.__('Authentication Secret')}
                    value={result.auth_secret || ""}
                    onChange={this.handleChange('auth_secret')}
                    placeholder={window.__('Enter server secret key')}>
                  </FormPassword>
                  <div className="tip-err">
                    {this.validator.message('auth_secret', result.auth_secret, 'required&&min:1&&max:128', '', {
                      default: window.__('Authentication Secret Field Required!'),
                      min: window.__('Secret must be at least 1 character!'),
                      max: window.__('Secret must be at most 128 characters!')
                    })}
                  </div>
                </>}
              </div>
              :
              <div>
                <FormGroup lable={window.__('Encryption')}>
                  <Select value={encryp} onChange={this.handleSelect('encryp')}>
                    <Option value={0}>{window.__("None")}</Option>
                    <Option value={1}>{window.__("Encrypted")}</Option>
                  </Select>

                </FormGroup>
                {encryp !== 0 ? <>
                  <FormPassword lable={window.__('Password')}
                    value={key || ""}
                    onChange={this.handleChange('key')}>
                  </FormPassword>
                  <div className="tip-err">
                    {this.validator.message('key', key, 'required&&min:8&&max:63&&password&&houtais', '', {
                      default: window.__('Password Field Required!'),
                      houtais: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                      min: window.__('Password At Least 8 Characters!'),
                      max: window.__('Password At Most 63 Characters!'),
                      password: window.__('Only Supports ASCII Code!')
                    })}</div>
                 </>
                : null}
              </div>
            }
          </div> : null}
        </div>

        <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>


        <Progress
          showProgress={this.state.showProgress}
          locktime={this.state.locktime}
          handleRedirect={this.handleRedirect}
          message='Configuring...Please Do Not Shut Down The Device,Completed After ' />

        <div style={{ height: 68 }}></div>
      </div>
    );
  }
}

const mapState = (state) => ({
  language: state.getIn(['common', 'language']),
})

const mapDispatch = (dispatch) => ({
  sendWirelessEnable(radio_id, enable) {
    dispatch(actionCreater.sendWirelessEnable(radio_id, enable))
  }
})

export default connect(mapState, mapDispatch)(Base2G)
