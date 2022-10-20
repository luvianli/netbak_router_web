import React, { Component } from 'react';
import { FormGroup, FormButton, PageText, Progress } from '@/screens/components';
import { axios, HYID, posturl, deepCopy, handleRedir } from '@/share';
import { message, Select } from 'antd';
import ReactValidator from '@/share/validator/index.js';
const { Option } = Select;

export default class LAN extends Component {
  state = {
    result: {},
    result_src: {},
    showProgress: false,
    locktime: 0,
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
        HYID: HYID.get_lan_info
      },
      url: posturl
    }).then((res) => {
      if (res.errcode === 2000) {
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
        HYID: HYID.set_lan_info,
        ...values,
      },
      url: posturl
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

  handleSelect = name => value => {
    let result = deepCopy(this.state.result);
    result[name] = value;
    this.setState({ result });
    // this.validator.hideMessages();
  }

  handleSave = () => {
    const { result, result_src } = this.state;
    let values= {}
    if (result.proto === 'dhcp') {
      if (this.validator.someValid(['host_name'])) {
        if (result_src.proto === result.proto &&
          result_src.host_name === result.host_name) {
          message.success(window.__('Data Up to Date'))
          return;
        }
        values = {
          proto: 'dhcp',
          host_name: result.host_name,
        }
        this.setData(values)
      } else {
        this.validator.showMessages();
        this.forceUpdate();
      }
    } else if (result.proto === 'static') {
      if (this.validator.someValid(['ip_addr', 'subnet_mask'])) {
        if (result_src.proto === result.proto &&
          result_src.ip_addr === result.ip_addr &&
          result_src.subnet_mask === result.subnet_mask
          ) {
          message.success(window.__('Data Up to Date'))
          return;
        }
        values = {
          //wan_type:result.wan_type,
          proto: 'static',
          ip_addr: result.ip_addr,
          subnet_mask: result.subnet_mask,
        }
        this.setData(values)
      } else {
        this.validator.showMessages();
        this.forceUpdate();
      }
    }
  }
  handleChange = name => event => {
    let result = deepCopy(this.state.result);
    let value = event.target.value;
    result[name] = value;
    this.setState({ result });
  };

  changeHostIP = (event) => {
    if (event.target.checked === true) {
      let { result } = this.state;
      result.dest_ip = this.state.user_ip;
      this.setState({
        result: result
      })
    }
    else {
      let { result, result_src } = this.state;
      result.dest_ip = result_src.dest_ip;
      this.setState({
        result: result
      })
    }
  }

  handleRedirect = () => {
    handleRedir(this.state.redir, this.state.redir_ip)
    this.setState({
      showProgress: false,
    })
  }
  render() {
    const { result: { proto, ip_addr, subnet_mask, host_name} } = this.state;
    return (
      <div>
        <FormGroup lable={window.__('Internet Access Mode')}>
          <Select value={proto || ''} onChange={this.handleSelect('proto')}>
            <Option value={'static'}>{window.__('STATIC')}</Option>
            <Option value={'dhcp'}>{window.__('DHCP')}</Option>
          </Select>
        </FormGroup>
        {
          proto === 'dhcp' ?
            <FormGroup lable={window.__('Host Name')}>
              <input value={host_name || ''} onChange={this.handleChange('host_name')} />
              <div className="tip-err">
                {this.validator.message('host_name', host_name, 'houtais&&ascii&&max:32', '', {
                  default: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                  max: window.__('Host Name At Most 32 Characters!'),
                  ascii: window.__('Only Supports ASCII Code!'),
                })}</div>
            </FormGroup>
            :
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
                {/*<div className='tip' >{window.__('Note: Changing The Subnet Mask Will Affect The Range Of The DHCP Address Pool!')}</div>*/}
                <div className="tip-err">
                  {this.validator.message('subnet_mask', subnet_mask, 'required&&netmask', '', {
                    default: window.__('Subnet Mask Field Required!'),
                    netmask: window.__('Subnet Mask Format Invalid!')
                  })}</div>
              </FormGroup>
            </> : null
        }
        <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>

        <Progress
          showProgress={this.state.showProgress}
          locktime={this.state.locktime}
          handleRedirect={this.handleRedirect}
          message='Configuring...Please Do Not Shut Down The Device,Completed After ' />
      </div>
    );
  }
}


