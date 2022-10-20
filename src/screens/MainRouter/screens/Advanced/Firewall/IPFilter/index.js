import React,{Component} from 'react';
import {FormGroup,Table,PageText,Modal,ScanList} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy,portRangeisExist} from '@/share';
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
        HYID:HYID.get_ip_port_filter_config
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
      result.ipportfilter_arr = rules;
    }
    if(checked!==null){      
      result.ip_port_filter = checked;
    }
    this.setState({result});
    axios.post({
      data:{
        HYID:HYID.set_ip_port_filter_config,
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
    if(name==='ip_port_filter'){
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
      src_addr:'',
      proto:0,
      start_port:'',
      end_port:'',
      com:''
    })
    this.validator.hideMessages();
  }
  handleSave=()=>{
    const {src_addr,proto,start_port,end_port,com,listIndex} = this.state;
    const rules = deepCopy(this.state.result.ipportfilter_arr);
    if(this.validator.allValid()){
      if(listIndex!==-1){//edit
        if(src_addr===rules[listIndex].src_addr&&
          proto===rules[listIndex].proto&&
          Number(start_port)===Number(rules[listIndex].start_port)&&
          Number(end_port)===Number(rules[listIndex].end_port)&&
          com===rules[listIndex].com){
          message.success(window.__('Data Up to Date'));
          return;
        }
        rules.splice(listIndex,1);
      }
      //add new one (先判断是否超过10条,是否重复)
      if(rules.length>=10){
        message.error(window.__('At Most 10 Rules!'));
        return;
      }
      if(Number(start_port)>Number(end_port)){
        message.error(window.__('Start Port Cannot Be Greater Than End Port!'))
        return false
      }  
      /**原来：重复IP的端口不能冲突； 不同的IP端口不用作判断 */
      /**现在：重复IP的端口在相同的协议内不能冲突； 不同的IP端口不用作判断 */      
      let flag = rules.every(item=>{
        // if(item.src_addr === src_addr){
        //   let list = [{port1:item.start_port,port2:item.end_port}]
        //   return portRangeisExist(list,start_port,end_port)
        // }else{
        //   return true
        // }
        let list = [{port1:item.start_port,port2:item.end_port}]
        if(item.src_addr !== src_addr){
          return true
        }else if(item.src_addr == src_addr){
          if(item.proto==0||proto==0){
            return portRangeisExist(list,start_port,end_port)
          }else if (item.proto == proto){
            return portRangeisExist(list,start_port,end_port)
          }else {
            return true
          }
        }
      })
      if(flag){
        rules.push({src_addr,proto,start_port,end_port,com});
        this.setData(rules)
      }
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  
  handleEdit=(index)=>{
    const rules = deepCopy(this.state.result.ipportfilter_arr);
    this.setState({
      visible:true,
      listIndex:index,
      src_addr:rules[index].src_addr,
      proto:rules[index].proto,
      start_port:rules[index].start_port,
      end_port:rules[index].end_port,
      com:rules[index].com,
    })
  }
  handleDelete=(index)=>{    
    const rules = deepCopy(this.state.result.ipportfilter_arr);
    rules.splice(index,1)
    this.setState({
      listIndex:-1,
    })
    this.setData(rules);
  }
  scanData=(ip,mac)=>{
    this.setState({
      src_addr:ip
    })
  }
  render(){    
    this.columns=[
      {
        title: window.__('IP Address'),
        dataIndex: 'src_addr',
        key: 'src_addr',
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
        title: window.__('Start Port'),
        dataIndex: 'start_port',
        key: 'start_port',
      },
      {
        title: window.__('End Port'),
        dataIndex: 'end_port',
        key: 'end_port',
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
    const {result:{ip_port_filter,ipportfilter_arr},
    src_addr,proto,start_port,end_port,com} = this.state;
    return (
      <div>
        <PageText 
          title={window.__('IP/Port Filter')}
          msg={window.__('You can configure the parameters of IP/Port Filter, for deny LAN clients to access to the Internet.')}/>
                    
        <FormGroup lable={window.__('IP/Port Filter')}>
            <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={ip_port_filter} onChange={this.handleSwitch('ip_port_filter')}/>
        </FormGroup>
      {ip_port_filter===true?<>
        <div style={{marginBottom:30}}></div>
        <Table 
        title={window.__('IP/Port Filter List')}
        selectKey={false}
        columns={this.columns}
        showAdd={true}
        dataSource={ipportfilter_arr}
        opration={this.handleModal}/>

        
      <Modal
        title={window.__('IP/Port Filter')}
        style={{width:650,}}
        visible={this.state.visible}
        closeModel={this.handleCloseModal}
        close={true}
        >          
        <FormGroup lable={window.__('IP Address')}>
          <input value={src_addr||''} onChange={this.handleChangeModal('src_addr')}/>
          <div className="tip-err">
            {this.validator.message('src_addr', src_addr, 'required&&ip','',{
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
        
        <FormGroup lable={window.__('Start Port')}>
          <input value={start_port||''} onChange={this.handleChangeModal('start_port')}/>
          <div className="tip-err">
            {this.validator.message('start_port', start_port, 'required&&range:1-65535','',{
              default: window.__('Start Port Field Required!'),
              range:window.__('Start Port Range Is 1-65535!')
          })}</div>
        </FormGroup>

        <FormGroup lable={window.__('End Port')}>
          <input value={end_port||''} onChange={this.handleChangeModal('end_port')}/>
          <div className="tip-err">
            {this.validator.message('end_port', end_port, 'required&&range:1-65535','',{
              default: window.__('End Port Field Required!'),
              range:window.__('End Port Range Is 1-65535!')
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
      </>:null}
      </div>
    );
  }
}


  