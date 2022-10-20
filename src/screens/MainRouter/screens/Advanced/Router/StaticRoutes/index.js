import React,{Component} from 'react';
import {FormGroup,Table,PageText,Modal,ScanList,Progress} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy,handleRedir} from '@/share';
import ReactValidator from '@/share/validator/index.js';
import {message,Icon,Select} from 'antd';
const { Option } = Select;

export default class MACFilter extends Component {
  state={
    visible:false,
    listIndex:-1,
    result:{},
    result_src:{},
    showProgress:false,
    locktime:0,
    interfaces:'lan',
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
        HYID:HYID.get_static_router_config
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
  setData=(rules=null)=>{  
    let result  = deepCopy(this.state.result);
    if(rules!==null){      
      result.static_router_arr = rules;
    }
    this.setState({result});
    axios.post({
      data:{
        HYID:HYID.set_static_router_config,
        static_router_arr:result.static_router_arr,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        //this.handleCloseModal();
        this.setState({   
          visible:false,      
          redir:res.reconnection,
          redir_ip:res.reconnection_addr||'', 
          showProgress:res.progresstime!==0,
          locktime:res.progresstime,
        })
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
  handleSelect= name => value =>{
    this.setState({
      [name]:value
    });
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
      interfaces:'lan',
      target:'',
      gateway:'',
      subnet_mask:'',
      metric:'',
      com:''
    })
    this.validator.hideMessages();
  }
  
  handleRedirect=()=>{
    handleRedir(this.state.redir,this.state.redir_ip)
    this.setState({
      showProgress:false,
    })
  }
  handleSave=()=>{
    const {interfaces,target,gateway,subnet_mask,metric,com,listIndex} = this.state;
    const rules = deepCopy(this.state.result.static_router_arr);
    if(this.validator.allValid()){
      if(listIndex!==-1){//edit
        if(interfaces===rules[listIndex].interface&&
          target===rules[listIndex].target&&
          gateway===rules[listIndex].gateway&&
          subnet_mask===rules[listIndex].subnet_mask&&
          metric===rules[listIndex].metric&&
          com===rules[listIndex].com){
          message.success(window.__('Data Up to Date'));
          return;
        }
        rules.splice(listIndex,1);
      }
      //add new one (先判断是否超过10条)
      if(rules.length>=10){
        message.error(window.__('At Most 10 Rules!'));
        return;
      }
      let flag = rules.some(item=>{
        return item.target===target
      })
      
      if(flag){        
        message.error(window.__('This IP Already Exists!'))
      }else{
        rules.push({interface:interfaces,target,gateway,subnet_mask,metric,com});
        this.setData(rules)
      }
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  
  handleEdit=(index)=>{
    const rules = deepCopy(this.state.result.static_router_arr);
    this.setState({
      visible:true,
      listIndex:index,
      interfaces:rules[index].interface,
      target:rules[index].target,
      gateway:rules[index].gateway,
      subnet_mask:rules[index].subnet_mask,
      metric:rules[index].metric,
      com:rules[index].com,
    })
  }
  handleDelete=(index)=>{    
    const rules = deepCopy(this.state.result.static_router_arr);
    rules.splice(index,1)
    this.setState({
      listIndex:-1,
    })
    this.setData(rules);
  }
  scanData=(ip,mac)=>{
    this.setState({
      target:ip
    })
  }
  renderInterface=(interface_arr)=>{
    if(!interface_arr) return;
    return interface_arr.map((item,index)=>{
      return <Option key={index} value={item.interface}>{item.interface.toUpperCase()}</Option>
    })
  }
  render(){    
    this.columns =[
      {
        title: window.__('Interface'),
        dataIndex: 'interface',
        key: 'interface',
        render: (index,record) => (
          <td key='interface'><span>{record.interface.toUpperCase()}</span></td>
        ),
      },
      {
        title: window.__('Destination Address'),
        dataIndex: 'target',
        key: 'target',
      },
      {
        title: window.__('Subnet Mask'),
        dataIndex: 'subnet_mask',
        key: 'subnet_mask',
      },
      {
        title: window.__('Default Gateway'),
        dataIndex: 'gateway',
        key: 'gateway',
      },
      {
        title: window.__('Metric'),
        dataIndex: 'metric',
        key: 'metric',
      },
      {
        title: window.__('Comment'),
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
    //react不能直接使用interface
    const {result:{static_router_arr,interface_arr},
    interfaces,target,gateway,subnet_mask,metric,com} = this.state;
    
    return (
      <div>
        <PageText 
          title={window.__('Static Router')}
          msg={window.__('You can configure the parameters of Static Router, for determine your network path.')}/>
                    
          <div style={{marginBottom:30}}></div>
          <Table 
          title={window.__('Static Router List')}
          selectKey={false}
          columns={this.columns}
          showAdd={true}
          dataSource={static_router_arr}
          opration={this.handleModal}/>

          
        <Modal
          title={window.__('Static Router')}
          style={{width:650,}}
          visible={this.state.visible}
          closeModel={this.handleCloseModal}
          close={true}
          >          
          <FormGroup lable={window.__('Interface')}>          
            <Select value={interfaces||'lan'} onChange={this.handleSelect('interfaces')}>
              {this.renderInterface(interface_arr)}
            </Select>
          </FormGroup>
          <FormGroup lable={window.__('IP Address')}>
            <input value={target||''} onChange={this.handleChangeModal('target')}/>
            <div className="tip-err">
              {this.validator.message('target', target, 'required&&ip','',{
              default: window.__('IP Address Field Required!'),
              ip: window.__('IP Address Format Invalid!'),
            })}</div>  
          </FormGroup>

          <FormGroup lable={window.__('Subnet Mask')}>
            <input value={subnet_mask||''} onChange={this.handleChangeModal('subnet_mask')}/>
            <div className="tip-err">
              {this.validator.message('subnet_mask', subnet_mask, 'required&&netmask','',{
                default: window.__('Subnet Mask Field Required!'),
                netmask: window.__('Subnet Mask Format Invalid!')
            })}</div>
          </FormGroup>
          <FormGroup lable={window.__('Default Gateway')}>
            <input value={gateway||''} onChange={this.handleChangeModal('gateway')}/>
            <div className="tip-err">
            {this.validator.message('gateway', gateway, 'required&&ip','',{
              default: window.__('Default Gateway Field Required!'), 
              ip: window.__('Default Gateway Format Invalid!')
            })}</div> 
          </FormGroup>
          
          <FormGroup lable={window.__('Metric')}>
            <input value={metric} onChange={this.handleChangeModal('metric')}/>
            <div className="tip-err">
              {this.validator.message('metric', metric, 'required&&range:0-255','',{
                  default: window.__('Metric Field Required!'),
                  range: window.__('Metric Range Is 0-255!')})}</div>  
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
        </Modal>   
        
        <Progress 
            showProgress={this.state.showProgress} 
            locktime={this.state.locktime}
            handleRedirect={this.handleRedirect }
            message='Configuring...Please Do Not Shut Down The Device,Completed After '/>

      </div>
    );
  }
}


  