import React,{Component} from 'react';
import {FormGroup,Table,PageText,Modal,ScanList} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import ReactValidator from '@/share/validator/index.js';
import {message,Switch,Icon} from 'antd';

export default class MACFilter extends Component {
  state={
    visible:false,
    listIndex:-1,
    result:{},
    result_src:{},
    com:''
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  
  componentDidMount(){
    this.getData()
  }
  getData = () => {
    axios.post({
      data:{
        HYID:HYID.get_mac_filter_config
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
          result:deepCopy(res.huayi_r),
          result_src:deepCopy(res.huayi_r)
        })
      }
    })
  };  
  setData=(rules=null,checked=null)=>{    
    let result  = deepCopy(this.state.result);
    if(rules!==null){      
      result.macfilter_arr = rules;
    }
    if(checked!==null){      
      result.mac_filter = checked;
    }
    this.setState({result});
    axios.post({
      data:{
        HYID:HYID.set_mac_filter_config,
        ...result,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        message.success(window.__('Success'));
        this.handleCloseModal();
      }
    })
  }
  handleChange = name => event => {
    let result = deepCopy(this.state.result);
    let value = event.target.value;
    result[name] = value;
    this.setState({ result });
  };
  handleChangeModal = name => event => {
    this.setState({ [name]:event.target.value });
  };
  handleSwitch= name => checked =>{
    let result = deepCopy(this.state.result);
    result[name] = checked;
    this.setState({ result });
    if(name==='mac_filter'){
      this.setData(null,checked)
    }
  }
  handleModal=()=>{
    this.setState({
      visible:!this.state.visible
    })
  }
  
  handleCloseModal=()=>{
    this.setState({
      visible:false,
      listIndex:-1,
      mac_addr:'',
      com:''
    })
    this.validator.hideMessages();
  }
  handleSave=()=>{
    const {mac_addr,com,listIndex} = this.state;
    const rules = deepCopy(this.state.result.macfilter_arr);
    if(this.validator.allValid()){
      if(listIndex!==-1){//edit
        if(mac_addr.toUpperCase()===rules[listIndex].mac_addr.toUpperCase()&&
          com===rules[listIndex].com){
          message.success(window.__('Data Up to Date'));
          return;
        }
        rules.splice(listIndex,1)
        //将原来的删除，在下面添加进新的
      }
      //add new one (先判断是否超过10条,是否重复)
      if(rules.length>=10){
        message.error(window.__('At Most 10 Rules!'));
        return;
      }
      
      let flag = rules.some(item=>{
        return item.mac_addr.toUpperCase()===mac_addr.toUpperCase()
      })
      if(flag){        
        message.error(window.__('This MAC Already Exists!'))
      }else{
        rules.push({mac_addr:mac_addr.toUpperCase(),com});
        this.setData(rules)
      }
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  
  handleEdit=(index)=>{    
    const rules = deepCopy(this.state.result.macfilter_arr);
    this.setState({
      visible:true,
      listIndex:index,
      mac_addr:rules[index].mac_addr.toUpperCase(),
      com:rules[index].com,
    })
  }
  handleDelete=(index)=>{    
    const rules = deepCopy(this.state.result.macfilter_arr);
    rules.splice(index,1)
    this.setState({
      listIndex:-1,
    })
    this.setData(rules);
  }
  scanData=(ip,mac)=>{
    this.setState({
      mac_addr:mac
    })
  }
  render(){    
    this.columns=[
      {
        title:window.__('MAC Address'),
        dataIndex: 'mac_addr',
        key: 'mac_addr',
        render: (index,record) => (
          <td key='mac'>{record.mac_addr.toUpperCase()}</td>
        ),
      },
      {
        title:window.__('Comment'),
        dataIndex: 'com',
        key: 'com',
      },
      {
        title:window.__('Action'),
        key: 'action',
        render: (index,record) => (
          <td key='actiontd'>
          <Icon type="edit" className='table-icon' onClick={()=>this.handleEdit(index)}/>
          <Icon type="delete" className='table-icon' onClick={()=>this.handleDelete(index)} />
          </td>
        ),
      },
    ]
    const {result:{mac_filter,macfilter_arr},mac_addr,com} = this.state;
    
    return (
      <div>
        <PageText 
          title={window.__('MAC Filter')}
          msg={window.__('You can configure the parameters of MAC Filter, for deny LAN clients to access to the Internet.')}
        />
                    
        <FormGroup lable={window.__('MAC Filter')}>
            <Switch  checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={mac_filter} onChange={this.handleSwitch('mac_filter')}/>
        </FormGroup>
      {mac_filter===true?<>
        <div style={{marginBottom:30}}></div>
        <Table 
        title={window.__('MAC Filter List')}
        selectKey={false}
        columns={this.columns}
        showAdd={true}
        dataSource={macfilter_arr}
        opration={this.handleModal}/>

        
      <Modal
        title={window.__('MAC Filter')}
        style={{width:650,}}
        visible={this.state.visible}
        closeModel={this.handleCloseModal}
        close={true}
        >          
        <FormGroup lable={window.__('MAC Address')}>
          <input value={mac_addr||''} onChange={this.handleChangeModal('mac_addr')}/>
          <div className='tip'>{window.__('Valid Format Is XX:XX:XX:XX:XX:XX!')}</div>
          <div className="tip-err">
          {this.validator.message('mac_addr', mac_addr, 'required&&mac','',{
              default: window.__('MAC Address Field Required!'),
              mac: window.__('Valid Format Is XX:XX:XX:XX:XX:XX!')
          })}</div>  
        </FormGroup>
        
        <FormGroup lable={window.__('Comment')}>
          <input value={com||''} onChange={this.handleChangeModal('com')}/>
        </FormGroup>        
        <div className="tip-err">
          {this.validator.message('com', com, 'max:16&&houtais','',{ 
            default: 'comment_atmost',
            max: window.__('Comment At Most 16 Characters!'),        
            houtais: window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
          })}</div>  
        
        
        <ScanList scanData={this.scanData}/>
        
        <button className='modal-confirm-btn'
          onClick={this.handleCloseModal}>{window.__('Cancel')}</button>
        <button className='modal-confirm-btn'
          onClick={this.handleSave}>{window.__('OK')}</button>
      </Modal></>:null}
      </div>
    );
  }
}


  