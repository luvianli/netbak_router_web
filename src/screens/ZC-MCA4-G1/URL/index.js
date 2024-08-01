import React, { Component } from 'react';
import { FormGroup, Table, PageText, Modal } from '@/screens/components';
import { axios, HYID, posturl, deepCopy, urldomainToLowercase } from '@/share';
import ReactValidator from '@/share/validator/index.js';
import { message, Select, Icon } from 'antd';
const urlReg = /^(?=^.{3,255}$)(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+((\/)*([a-zA-Z0-9][-a-zA-Z0-9]{0,62})?)+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/;
const { Option } = Select;

export default class URL extends Component {
  state = {
    visible: false,
    listIndex: -1,
    result: {},
    result_src: {},
    urlTest: true
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
        HYID: HYID.get_url_filter_config
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
  setData = (rules = null, value) => {
    let result = deepCopy(this.state.result);
    if (rules !== null) {
      result.urlfilter_arr = rules;
    }
    if (value === 0) {
      result.url_filter = 0;
    } else if (value === 1) {
      result.url_filter = 1;
    } else if(value === 2) {
      result.url_filter = 2;
    }
    this.setState({ result });
    axios.post({
      data: {
        HYID: HYID.set_url_filter_config,
        ...this.state.result,
      },
      url: posturl
    }).then((res) => {
      if (res.errcode === 2000) {
        message.success(window.__('Success'));
        this.handleCloseModal();
      }
    })
  }
  // handleChange = name => event => {
  //   let result = deepCopy(this.state.result);
  //   let value = event.target.value;
  //   result[name] = value;
  //   this.setState({ result });
  // };
  handleChangeModal = name => event => {
    this.setState({ [name]: event.target.value });
  };
  // handleSwitch= name => checked =>{
  //   let result = deepCopy(this.state.result);
  //   result[name] = checked;
  //   this.setState({ result });
  //   if(name==='url_filter'){
  //     this.setData(null,checked)
  //   }
  // }
  handleModal = () => {
    this.setState({
      visible: !this.state.visible
    })
  }

  handleCloseModal = () => {
    this.setState({
      visible: false,
      listIndex: -1,
      urlfilter_url: '',
      urlTest: true
    })
    this.validator.hideMessages();
  }
  handleSave = () => {
    const urlfilter_url = urldomainToLowercase(this.state.urlfilter_url);
    const listIndex = this.state.listIndex;
    const rules = deepCopy(this.state.result.urlfilter_arr);
    if (!urlReg.test(urlfilter_url)) {
      this.setState({
        urlTest: false
      })
      this.validator.showMessages();
      this.forceUpdate();
      return false;
    }
    if (this.validator.allValid()) {
      this.setState({
        urlTest: true
      })
      if (listIndex !== -1) {//edit
        if (urlfilter_url === rules[listIndex].urlfilter_url) {
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

      let flag = rules.some(item => {
        return urldomainToLowercase(item.urlfilter_url) === urldomainToLowercase(urlfilter_url)
      })
      if (flag) {
        message.error(window.__('This URL Already Exists!'))
      } else {
        rules.push({ urlfilter_url });
        this.setData(rules)
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  handleEdit = (index) => {
    const rules = deepCopy(this.state.result.urlfilter_arr);
    this.setState({
      visible: true,
      listIndex: index,
      urlfilter_url: rules[index].urlfilter_url,
    })
  }
  handleDelete = (index) => {
    const rules = deepCopy(this.state.result.urlfilter_arr);
    rules.splice(index, 1)
    this.setState({
      listIndex: -1,
    })
    this.setData(rules);
  }
  handleUrlFilterChange = (value) => {

    let result = deepCopy(this.state.result);
    result.url_filter = value;
    this.setState({ result });
    this.setData(null, value);
  }
  renderUrlFilterContent = () => {
    const { result: { url_filter, urlfilter_arr }, urlfilter_url } = this.state;
    if (url_filter === 0) {
      return null;
    } else {
      return (
        <div>
          <div style={{ marginBottom: 30 }}></div>
          <Table
            title={window.__('URL Keywords List')}
            selectKey={false}
            columns={this.columns}
            showAdd={true}
            dataSource={urlfilter_arr}
            opration={this.handleModal} />


          <Modal
            title={window.__('URL Filter')}
            style={{ width: 650, }}
            visible={this.state.visible}
            closeModel={this.handleCloseModal}
            close={true}
          >
            <FormGroup lable={window.__('URL Keywords')}>
              <input value={urlfilter_url || ''} onChange={this.handleChangeModal('urlfilter_url')} maxLength={63} />
              {/*<div className="tip-err">
            {this.validator.message('urlfilter_url', urlfilter_url, 'required&&notcn&&min:2','',{
            default: window.__('URL format'),})}</div>*/}

              {!this.state.urlTest && <div className="tip-err">{window.__('URL Format Invalid,Valid Format Is xxx.yyy.zzz(such as baidu.com,www.baidu.com)!')}</div>}
              <div className="tip-err">
                {this.validator.message('urlfilter_url', urlfilter_url, 'required&&max:63', '', {
                  default: window.__('URL Field Required!'),
                  // url: window.__('URL Format Invalid,Valid Format Is xxx.yyy.zzz !'),            
                  max: window.__('URL Keywords At Most 63 Characters!'),
                })}</div>
            </FormGroup>

            <button className='modal-confirm-btn'
              onClick={this.handleCloseModal}>{window.__('Cancel')}</button>
            <button className='modal-confirm-btn'
              onClick={this.handleSave}>{window.__('OK')}</button>
          </Modal>
        </div>
      )
    }
  }

  render() {
    this.columns = [
      {
        title: window.__('URL Keywords'),
        dataIndex: 'urlfilter_url',
        key: 'urlfilter_url',
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
    const { result: { url_filter, urlfilter_arr }, urlfilter_url } = this.state;
    return (
      <div>
        <PageText
          title={window.__('URL Filter')}
          msg={window.__('You can configure the parameters of URL Filter, for deny LAN clients to access to the websites or links with keywords.')}
          showHelp={true}
          helpmsg={window.__('Note:Vaild Format is xxx.yyy.zzz.')} />

        {/* <FormGroup lable={window.__('URL Filter')}>
            <Switch  checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={url_filter} onChange={this.handleSwitch('url_filter')}/>
        </FormGroup> */}
        <FormGroup lable={window.__('URL Filter')}>
          {/* <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={ip_port_filter} onChange={this.handleSwitch('ip_port_filter')}/> */}
          <Select value={url_filter} onChange={this.handleUrlFilterChange} >
            <Option value={0}>{window.__('OFF')}</Option>
            <Option value={1}>{window.__('Blacklist')}</Option>
            <Option value={2}>{window.__('Whitelist')}</Option>
          </Select>
        </FormGroup>
        {this.renderUrlFilterContent()}
      </div>
    );
  }
}


