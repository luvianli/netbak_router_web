import React,{Component} from 'react';
import {FormGroup,Table,PageText,Modal,ScanList} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import ReactValidator from '@/share/validator/index.js';
import {message,Switch,Icon,Select} from 'antd';
const { Option } = Select;

export default class MACFilter extends Component {
  state={
    visible:false,
    listIndex:-1,
    result:{},
    result_src:{},
    proto:0,
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
        HYID:HYID.get_port_forward_config
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
      result.port_forward_arr = rules;
    }
    if(checked!==null){      
      result.port_admin = checked;
    }
    this.setState({result});
    axios.post({
      data:{
        HYID:HYID.set_port_forward_config,
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
    if(name==='port_admin'){
      this.setData(null,checked)
    }
  }
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
      ip_addr:'',
      proto:0,
      in_port:'',
      ex_port:'',
      com:''
    })
    this.validator.hideMessages();
  }
  handleSave=()=>{
    const {ip_addr,proto,in_port,ex_port,com,listIndex} = this.state;
    const rules = deepCopy(this.state.result.port_forward_arr);
    if(this.validator.allValid()){
      if(listIndex!==-1){//edit
        if(ip_addr===rules[listIndex].ip_addr&&
          proto===rules[listIndex].proto&&
          Number(in_port)===Number(rules[listIndex].in_port)&&
          Number(ex_port)===Number(rules[listIndex].ex_port)&&
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

      let flag = rules.every(item=>{  
        /**重复IP的端口不能重复； 所有的IP外部端口不能重复 */
        /*端口映射：
          不用判断IP和内部端口；外部端口相同时：协议不能重复添加，
        */
        
        if(item.ip_addr === ip_addr){
          /*if(Number(item.in_port)==Number(in_port)){
            message.error(window.__(`Internal Port Has Exits!`))
            return false
          }else */if(Number(item.ex_port)!==Number(ex_port)){
            return true;
          }else if(item.proto==0||proto==0){
            message.error(window.__(`External Port Has Exits!`))
            return false 
          }else if(item.proto!==proto) {
            return true
          } 
          else{
            message.error(window.__(`External Port Has Exits!`))
            return false;
          }
        }else
        /**这是不同IP里的判断（对外部端口作判断） */
        if(Number(item.ex_port)!==Number(ex_port)){
          return true;
        }else if(item.proto==0||proto==0){
          message.error(window.__(`External Port Has Exits!`))
          return false 
        }else if(item.proto!==proto) {
          return true
        } 
        else{
          message.error(window.__(`External Port Has Exits!`))
          return false;
        }  
      })
      if(flag){ 
        rules.push({ip_addr,proto,in_port,ex_port,com});
        this.setData(rules)
      }else{
        return;
      }
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  
  handleEdit=(index)=>{
    const rules = deepCopy(this.state.result.port_forward_arr);
    this.setState({
      visible:true,
      listIndex:index,
      ip_addr:rules[index].ip_addr,
      proto:rules[index].proto,
      in_port:rules[index].in_port,
      ex_port:rules[index].ex_port,
      com:rules[index].com,
    })
  }
  handleDelete=(index)=>{    
    const rules = deepCopy(this.state.result.port_forward_arr);
    rules.splice(index,1)
    this.setState({
      listIndex:-1,
    })
    this.setData(rules);
  }
  scanData=(ip,mac)=>{
    this.setState({
      ip_addr:ip
    })
  }
  render(){    
    this.columns=[
      {
        title: window.__('IP Address'),
        dataIndex: 'ip_addr',
        key: 'ip_addr',
      },
      {
        title: window.__('Protocol'),
        dataIndex: 'proto',
        key: 'proto',
        render: (index,record) => (
          <td key='proto'>
            {record.proto===1?'TCP':record.proto===2?'UDP':'TCP/UDP'}
          </td>
        ),
      },
      {
        title: window.__('Internal Port'),
        dataIndex: 'in_port',
        key: 'in_port',
      },
      {
        title: window.__('External Port'),
        dataIndex: 'ex_port',
        key: 'ex_port',
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
    const {result:{port_admin,port_forward_arr},
    ip_addr,proto,in_port,ex_port,com} = this.state;
    return (
      <div>
        <PageText 
          title={window.__('Port Mapping')}
          msg={window.__('You can configure the parameters of Port Mapping, for LAN hosts provide designated services on the Internet.')}/>
                    
        <FormGroup lable={window.__('Port Mapping')}>
            <Switch  checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            defaultChecked={false} checked={port_admin} onChange={this.handleSwitch('port_admin')}/>
        </FormGroup>
      {
        port_admin===true?<>        
          <div style={{marginBottom:30}}></div>
          <Table 
          title={window.__('Port Mapping List')}
          selectKey={false}
          columns={this.columns}
          showAdd={true}
          dataSource={port_forward_arr}
          opration={this.handleModal}/>

          
        <Modal
          title={window.__('Port Mapping')}
          style={{width:650,}}
          visible={this.state.visible}
          closeModel={this.handleCloseModal}
          close={true}
          >          
          <FormGroup lable={window.__('IP Address')}>
            <input value={ip_addr||''} onChange={this.handleChangeModal('ip_addr')}/>
            <div className="tip-err">
              {this.validator.message('ip_addr', ip_addr, 'required&&ip','',{
              default: window.__('IP Address Field Required!'),
              ip: window.__('IP Address Format Invalid!'),
            })}</div>  
          </FormGroup>

          <FormGroup lable={window.__('Protocol')}>          
            <Select value={proto||0} onChange={this.handleSelect('proto')}>
              <Option value={0}>TCP+UDP</Option>
              <Option value={1}>TCP</Option>
              <Option value={2}>UDP</Option>
            </Select>
          </FormGroup>
          
          <FormGroup lable={window.__('Internal Port')}>
            <input value={in_port||''} onChange={this.handleChangeModal('in_port')}/>
            <div className="tip-err">
              {this.validator.message('in_port', in_port, 'required&&range:1-65535','',{
                default: window.__('Internal Port Field Required!'),
                range:window.__('Internal Port Range Is 1-65535!'),
              })}</div>  
          </FormGroup>

          <FormGroup lable={window.__('External Port')}>
            <input value={ex_port||''} onChange={this.handleChangeModal('ex_port')}/>
            <div className="tip-err">
              {this.validator.message('ex_port', ex_port, 'required&&range:1-65535','',{
                default: window.__('External Port Field Required!'),
                range:window.__('External Port Range Is 1-65535!'),
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
        </Modal>   
        </>:null
      } 
      </div>
    );
  }
}


  