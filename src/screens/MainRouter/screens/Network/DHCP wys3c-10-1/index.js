import React, { Component } from 'react';
import { FormGroup, Table, PageText, Modal, FormButton, ScanList } from '@/screens/components';
import { axios, HYID, posturl, deepCopy, ipPoolRange } from '@/share';
import ReactValidator from '@/share/validator/index.js';
import { message, Switch, Icon } from 'antd';

export default class DHCP extends Component {
  state = {
    visible: false,
    listIndex: -1,
    result: {},
    result_src: {}
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
        HYID: HYID.get_dhcps_server_config
      },
      url: posturl
    }).then((res) => {
      if (res.errcode === 2000) {
        this.setState({
          result: deepCopy(res.huayi_r),
          result_src: deepCopy(res.huayi_r),
          leasetime_modal: res.huayi_r.lease_time,
        })
      }
    })
  };
  setData = (rules = null, checked = null, result = {}) => {
    //let result  = deepCopy(this.state.result);
    if (rules !== null) {
      result.static_dhcp_arr = rules;
    }
    if (checked !== null) {
      result.dhcp_enable = checked;
    }
    this.setState({ result });
    axios.post({
      data: {
        HYID: HYID.set_dhcps_server_config,
        ...result,
      },
      url: posturl
    }).then((res) => {
      if (res.errcode === 2000) {
        message.success(window.__('Success'));
        this.getData();
        this.handleCloseModal();
      }
    })
  }
  handleChange = name => event => {
    let result = deepCopy(this.state.result);
    let value = event.target.value;
    result[name] = value;
    if (name === "start_ip") {
      result["end_ip"] = value
    }

    this.setState({ result });
  };
  handleChangeModal = name => event => {
    this.setState({ [name]: event.target.value });
  };
  handleSwitch = name => checked => {
    let result = deepCopy(this.state.result);
    result[name] = checked;
    this.setState({ result });
    if (checked === false && name === 'dhcp_enable') {
      this.validator.hideMessages();
      this.setData(null, checked, this.state.result_src)
    }
  }
  handleModal = () => {
    if (this.state.visible === false &&
      !this.validator.someValid(['start_ip', 'end_ip', 'lease_time'])) {
      this.validator.showMessages();
      this.forceUpdate();
      return false;
    }

    let result = deepCopy(this.state.result)
    let { min_ip, max_ip } = deepCopy(this.state.result)
    if (!ipPoolRange(min_ip, max_ip, result.start_ip, result.end_ip)) {
      return false;
    }
    this.setState({
      visible: !this.state.visible
    })
    this.validator.hideMessages();
  }

  handleCloseModal = () => {
    this.setState({
      visible: false,
      listIndex: -1,
      ip_addr: '',
      mac_addr: '',
      name: '',
      leasetime_modal: this.state.result_src.lease_time,
    })
    this.validator.hideMessages();
  }
  handleSave = () => {
    let result = deepCopy(this.state.result)
    let result_src = deepCopy(this.state.result_src)
    let { min_ip, max_ip } = deepCopy(this.state.result)
    if (this.validator.someValid(['start_ip', 'end_ip', 'lease_time'])) {
      if (!ipPoolRange(min_ip, max_ip, result.start_ip, result.end_ip)) {
        return false;
      }
      if (result.dhcp_enable === result_src.dhcp_enable &&
        result.start_ip === result_src.start_ip &&
        result.end_ip === result_src.end_ip &&
        Number(result.lease_time) === Number(result_src.lease_time)) {
        message.success(window.__('Data Up to Date'));
        return;
      }
      this.setData(null, true, this.state.result);
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  handleSaveItem = () => {
    const { ip_addr, mac_addr, name, leasetime_modal, listIndex } = this.state;
    const rules = deepCopy(this.state.result.static_dhcp_arr);
    // if(this.validator.someValid(['ip','mac','leasetime_modal','name'])){
    if (this.validator.someValid(['ip_addr', 'mac_addr', 'name'])) {
      if (listIndex !== -1) {//edit
        if (ip_addr === rules[listIndex].ip_addr &&
          mac_addr.toUpperCase() === rules[listIndex].mac_addr.toUpperCase() &&
          name === rules[listIndex].name
          // &&Number(leasetime_modal)===Number(rules[listIndex].lease_time)
        ) {
          message.success(window.__('Data Up to Date'));
          return;
        }
        rules.splice(listIndex, 1);
      }
      //add new one (先判断是否超过10条,是否重复)
      if (rules.length >= 10) {
        message.error(window.__('At Most 10 Rules!'));
        return;
      }

      /**IP,MAC不能重复*/
      let flag = rules.some(item => {
        if (item.ip_addr === ip_addr) {
          message.error(window.__('This IP Already Exists!'))
          return true
        }
        else if (item.mac_addr.toUpperCase() === mac_addr.toUpperCase()) {
          message.error(window.__('This MAC Already Exists!'))
          return true
        }
        return false;
      })
      if (!flag) {
        rules.push({ ip_addr, mac_addr: mac_addr.toUpperCase(), name, lease_time: leasetime_modal });
        this.setData(rules, true, this.state.result)
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  handleEdit = (index) => {
    const rules = deepCopy(this.state.result.static_dhcp_arr);
    let result = deepCopy(this.state.result)
    let { min_ip, max_ip } = deepCopy(this.state.result)
    if (this.state.visible === false &&
      !this.validator.someValid(['start_ip', 'end_ip', 'lease_time'])) {
      this.validator.showMessages();
      this.forceUpdate();
      return false;
    }
    if (!ipPoolRange(min_ip, max_ip, result.start_ip, result.end_ip)) {
      return false;
    }

    this.setState({
      visible: true,
      listIndex: index,
      ip_addr: rules[index].ip_addr,
      mac_addr: rules[index].mac_addr.toUpperCase(),
      name: rules[index].name,
      leasetime_modal: rules[index].lease_time,
    })
  }
  handleDelete = (index) => {
    const rules = deepCopy(this.state.result.static_dhcp_arr);
    let result = deepCopy(this.state.result)
    let { min_ip, max_ip } = deepCopy(this.state.result)
    if (this.state.visible === false &&
      !this.validator.someValid(['start_ip', 'end_ip', 'lease_time'])) {
      this.validator.showMessages();
      this.forceUpdate();
      return false;
    }
    if (!ipPoolRange(min_ip, max_ip, result.start_ip, result.end_ip)) {
      return false;
    }
    rules.splice(index, 1)
    this.setState({
      listIndex: -1,
    })
    this.setData(rules, true, this.state.result);
  }
  scanData = (ip_addr, mac_addr) => {
    this.setState({
      ip_addr: ip_addr,
      mac_addr: mac_addr
    })
  }

  render() {

    this.columns = [
      {
        title: window.__('IP Address'),
        dataIndex: 'ip_addr',
        key: 'ip_addr',
      },
      {
        title: window.__('MAC Address'),
        dataIndex: 'mac_addr',
        key: 'mac_addr',
        render: (index, record) => (
          <td key='mac_addr'>{record.mac_addr.toUpperCase()}</td>
        ),
      },
      {
        title: window.__('Host Name'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: window.__('Lease Time'),
        dataIndex: 'lease_time',
        key: 'lease_time',
      },
      {
        title: window.__('Action'),
        key: 'action',
        render: (index, record) => (
          <td key='actiontd'>
            <Icon type="edit" className='table-icon' onClick={() => this.handleEdit(index)} />
            <Icon type="delete" className='table-icon' onClick={() => this.handleDelete(index)} />
          </td>
        ),
      },
    ]
    const { result: { static_dhcp_arr, dhcp_enable, min_ip, max_ip, start_ip, end_ip, lease_time },
      ip_addr, mac_addr, name, leasetime_modal } = this.state;
    console.log("start_ip", this.state.result.start_ip)
    console.log("end_ip", this.state.result.end_ip)
    return (
      <div>
        <PageText
          title={window.__('DHCP Setting')} />

        <FormGroup lable={window.__('DHCP')}>
          <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={dhcp_enable} onChange={this.handleSwitch('dhcp_enable')} />
        </FormGroup>

        {dhcp_enable === true ? <>
          <div className='tip'>{window.__('Note：The Range Of DHCP Address Pool Is')}{min_ip}-{max_ip}!</div>
          <FormGroup lable={window.__('Start IP')}>
            <input value={start_ip || ''} onChange={this.handleChange('start_ip')} />
            <div className="tip-err">
              {this.validator.message('start_ip', start_ip, 'required&&ip', '', {
                default: window.__('Start IP Field Required!'),
                ip: window.__('Start IP Format Invalid!'),
              })}</div>
          </FormGroup>
          <FormGroup lable={window.__('End IP')}>
            <input value={start_ip || ''} disabled={true} />
            <div className="tip-err">
              {this.validator.message('end_ip', end_ip, 'required&&ip', '', {
                default: window.__('End IP Field Required!'),
                ip: window.__('End IP Format Invalid!'),
              })}</div>
          </FormGroup>

          <FormGroup lable={window.__('Lease Time')}>
            <input value={lease_time || ''} onChange={this.handleChange('lease_time')} />
            <div className="tip-err">
              {this.validator.message('lease_time', lease_time, 'required&&range:300-604800', '', {
                default: window.__('Lease Time Field Required!'),
                range: window.__('Lease Time Range Is 300-604800(Default 7200)!'),
              })}</div>
          </FormGroup>

          <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>

          <div style={{ marginBottom: 30 }}></div>
          <Table
            title={window.__('Static IP Bind')}
            selectKey={false}
            columns={this.columns}
            showAdd={true}
            dataSource={static_dhcp_arr}
            opration={this.handleModal} />


          <Modal
            title={window.__('Static DHCP')}
            style={{ width: 650, }}
            visible={this.state.visible}
            closeModel={this.handleCloseModal}
            close={true}
          >
            <FormGroup lable={window.__('IP Address')}>
              <input value={ip_addr || ''} onChange={this.handleChangeModal('ip_addr')} />
              <div className="tip-err">
                {this.validator.message('ip_addr', ip_addr, 'required&&ip', '', {
                  default: window.__('IP Address Field Required!'),
                  ip: window.__('IP Address Format Invalid!'),
                })}</div>
            </FormGroup>
            <FormGroup lable={window.__('MAC Address')}>
              <input value={mac_addr || ''} onChange={this.handleChangeModal('mac_addr')} />
              <div className="tip-err">
                {this.validator.message('mac_addr', mac_addr, 'required&&mac', '', {
                  default: window.__('MAC Address Field Required!'),
                  mac: window.__('Valid Format Is XX:XX:XX:XX:XX:XX!')
                })}</div>
            </FormGroup>

            <FormGroup lable={window.__('Host Name')}>
              <input value={name || ''} onChange={this.handleChangeModal('name')} />
            </FormGroup>
            <div className="tip-err">
              {this.validator.message('name', name, 'houtais&&max:32&&hostname', '', {
                default: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                hostname: window.__('Only Supports Number Or Letters!'),
                max: window.__('Host Name At Most 32 Characters!'),
              })}</div>

            {/* <FormGroup lable={window.__('Lease Time')}>
          <input value={leasetime_modal} onChange={this.handleChangeModal('leasetime_modal')}/>
          <div className="tip-err">
            {this.validator.message('leasetime_modal', leasetime_modal, 'required&&range:300-604800','',{
              default: window.__('Lease Time Field Required!'),
              range: window.__('Lease Time Range Is 300-604800(Default 7200)!'),
          })}</div>
        </FormGroup> */}

            <ScanList scanData={this.scanData} />

            <button className='modal-confirm-btn'
              onClick={this.handleCloseModal}>{window.__('Cancel')}</button>
            <button className='modal-confirm-btn'
              onClick={this.handleSaveItem}>{window.__('OK')}</button>
          </Modal>
        </> : null}
        <div style={{ height: 200 }}></div>
      </div>
    );
  }
}


