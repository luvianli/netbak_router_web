import React,{Component} from 'react';
import {FormGroup,FormButton,PageText,FormPassword,Table,Modal,Progress} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy,deepCompare,handleRedir} from '@/share';
import {message,Select,Switch,Icon} from 'antd';
import ReactValidator from '@/share/validator/index.js';
const { Option } = Select;
/**
 * L2TP为开启状态时，要定时获取PPTP状态
 */
export default class LAN extends Component {
  state={
    result:{},
    result_src:{},
    visible: false,
    listIndex: -1,
    showProgress: false,
    locktime: 0,
  }
  componentWillMount() {
    this.validator = new ReactValidator();
    this.modalValidator = new ReactValidator();
  }
  componentDidMount(){
    this.getData();
  }  
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  getData = () => {
    axios.post({
      data:{
        HYID:HYID.get_pptp_client_config
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){          
        this.setState({
            pptp_status : res.huayi_r.pptp_status,
            pptp_addr : res.huayi_r.pptp_addr,
            //pptp_addr : res.huayi_r.pptp_addr.replace(/\'/g,''),
            result:deepCopy(res.huayi_r),
            result_src:deepCopy(res.huayi_r)
        }, () => {
            clearInterval(this.timer)
            /**L2TP为开启状态时，要定时获取PPTP状态 */
            this.timer = setInterval(() => {
                if (res.huayi_r.pptp_enable && this.state.result.pptp_enable) {
                    this.getPptpStatus()
                }
            }, 6000)
        })
      }
    })
  };
  
  getPptpStatus = () => {
    axios.post({
      data:{
        HYID:HYID.get_pptp_client_config
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
          this.setState({
            pptp_status : res.huayi_r.pptp_status,
            pptp_addr : res.huayi_r.pptp_addr,
            //pptp_addr : res.huayi_r.pptp_addr.replace(/\'/g,''),
          })    
      }
    })
  };
  
  setData=(values)=>{    
    axios.post({
      data:{
        HYID:HYID.set_pptp_client_config,
        ...values,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        clearInterval(this.timer)
        if(res.progresstime!= 0){
          this.setState({
            showProgress: res.progresstime!= 0,
            locktime: res.progresstime,
            redir:res.reconnection,
            redir_ip:res.reconnection_addr||'', 
          })
        }else{
          message.success(window.__('Success'))
        }
      }
    })
  }
  
  handleChange = name => event => {
    let result = deepCopy(this.state.result);
    let value = event.target.value;
    result[name] = value;
    this.setState({ result });
  };
  
  handleSelect= name => value =>{    
    let result = deepCopy(this.state.result);
    result[name] = value;
    this.setState({ result });
  }
  
  handleSwitch= name => checked =>{
    let result = deepCopy(this.state.result);
    result[name] = checked;
    this.setState({ result });
  }
  
  handleSave=()=>{
    const {result,result_src} = this.state;
    /**关闭状态 */
    if(!result.pptp_enable){
        let values = deepCopy(result_src);
        values.pptp_enable = false;
        this.setData(values);
        return false;
    }
    /**数据不能与原来的相同 */
    if(deepCompare(result,result_src)){
        message.success(window.__('Data Up to Date'))
        return false;
    }
    /**校验并发送数据 */
    if(this.validator.allValid()){
        this.setData(result);
    }else{
        this.validator.showMessages();
        this.forceUpdate();
    }
  }
  handleCloseModal=()=>{
    this.setState({
      visible:false,
      listIndex:-1,
      subnet_mask: '',
      target: ''
    })
    this.modalValidator.hideMessages();
  }
  handleTableModal=()=>{
    this.setState({
      visible:!this.state.visible,
      listIndex: -1,
      subnet_mask: '',
      target: ''
    })
  }
  handleModal=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  }
  handleEdit=(index)=>{
    const list = deepCopy(this.state.result.pptp_static_arr);
    this.setState({
      visible:true,
      listIndex:index,
      subnet_mask:list[index].subnet_mask,
      target:list[index].target,
    })
  }
  handleDelete=(index)=>{    
    const list = deepCopy(this.state.result.pptp_static_arr);
    list.splice(index,1)
    let result = this.state.result
    result['pptp_static_arr'] = list
    this.setState({
      listIndex:-1,
      result
    })
  }
  handleModalSave=()=>{
    const {subnet_mask,target,listIndex} = this.state;
    const list = deepCopy(this.state.result.pptp_static_arr);
    if(this.modalValidator.allValid()){
      if(listIndex!==-1){//edit
        if(subnet_mask===list[listIndex].subnet_mask&&
          target===list[listIndex].target){
          message.success(window.__('Data Up to Date'));
          return;
        }else{
          list.splice(listIndex,1);
          let flag = list.every(item=>{
            if(item.target!==target){
              return true
            }else{
              return false
            }
          })
          if(flag){
            list.push({subnet_mask,target});
            let result = this.state.result
            result['pptp_static_arr'] = list
            this.setState({
              listIndex:-1,
              result,
              visible:!this.state.visible,
            })
          }else{
            message.error(window.__('This IP Already Exists!'))
          }
        }
      }else{//add
        let flag = list.every(item=>{
          if(item.target!==target){
            return true
          }else{
            return false
          }
        })
        if(flag){
          list.push({subnet_mask,target});
          let result = this.state.result
          result['pptp_static_arr'] = list
          this.setState({
            listIndex:-1,
            result,
            visible:!this.state.visible,
          })
        }else{
          message.error(window.__('This IP Already Exists!'))
        }
      }
    }else {
      this.modalValidator.showMessages();
      this.forceUpdate();
    }
  }
  handleChangeModal = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleRedirect=()=>{
    handleRedir(this.state.redir,this.state.redir_ip)      
    this.setState({
      showProgress:false
    })
    window.location.reload()
  }
  render(){
    const {pptp_enable,server_addr,usr,pwd,route_type,mppe,pptp_static_arr} = this.state.result;
    const {pptp_addr,pptp_status,subnet_mask,target} = this.state;
    const columns=[
      {
        title: window.__('IP Address'),
        dataIndex: 'target',
        key: 'target',
      },
      {
        title: window.__('Subnet Mask'),
        dataIndex: 'subnet_mask',
        key: 'subnet_mask',
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
    const tableFatherCss = {
      width:'100%',
      maxHeight:'189px',
      overflowY:'auto'
    }
    return (
      <div className="client-content">
        <PageText 
          title={window.__('PPTP Client')}
          msg={window.__('')}/>
                       
        <FormGroup lable={window.__('PPTP Client Setting')}>
            <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={pptp_enable} onChange={this.handleSwitch('pptp_enable')}/>
        </FormGroup>
        
        <div style={{display:pptp_enable?"block":"none"}}>
            <FormGroup lable={window.__("PPTP Client Status")}>
            <span style={{fontSize:14}}>
                {pptp_status == 0 ? window.__('PPTP Disconnected') : 
                window.__('PPTP Connected')}
            </span>
            </FormGroup>

            <FormGroup lable={window.__("PPTP Client")+' IP'}>
                <span style={{fontSize:14}}>{pptp_addr}</span>
            </FormGroup>
            
            
            <FormGroup lable={window.__('Server Address')}>
                <input value={server_addr||''} onChange={this.handleChange('server_addr')}/>
                <div className="tip-err">
                {this.validator.message('server_addr', server_addr, 'required&&ascii&&max:63','',{
                    default: window.__('Server Address Field Required!'),
                    // ip: window.__('Server Address Format Invalid!')
                    ascii: window.__('Only Supports ASCII Code!'),
                    max: window.__('Server Address At Most 63 Characters!')
                    })}</div>  
            </FormGroup>

            
            <FormGroup lable={window.__('User Name')}>
            <input value={usr||''} onChange={this.handleChange('usr')}/> 
            </FormGroup>
            <div className="tip-err">
            {this.validator.message('usr', usr, 'required&&max:32&&password&&special','',{
            default: window.__('User Name Field Required!'),    
            max: window.__('User Name At Most 32 Characters!'),    
            special: window.__('User Name')+'  ' + window.__('Cannot Be Entered  \' \" \\ #'),
            password: window.__('Only Supports ASCII Code!')
            })}</div>

            <FormPassword lable={window.__('Password')}
            value={pwd||''} 
            onChange={this.handleChange('pwd')}> 
            </FormPassword>        
            <div className="tip-err">
            {this.validator.message('pwd', pwd, 'required&&max:32&&password&&special','',{
            default: window.__('Password Field Required!'),
            max: window.__('Password At Most 32 Characters!'),
            special: window.__('Password')+'  '+window.__('Cannot Be Entered  \' \" \\ #'),
            password: window.__('Only Supports ASCII Code!')
            })}</div>   
            

            <FormGroup lable={window.__('MPPE Data Encryption')}>
            <Select value={mppe} onChange={this.handleSelect('mppe')}>
                <Option value={0}>{window.__('Encryption')}</Option>
                <Option value={1}>{window.__('Optional Encryption')}</Option>
                <Option value={2}>{window.__('Unencrypted')}</Option>
            </Select>
            </FormGroup>

            <FormGroup lable={window.__('Routing Mode')}>
            <Select value={route_type} onChange={this.handleSelect('route_type')}>
                <Option value={0}>{window.__('Manual')}</Option>
                <Option value={1}>{window.__('Automatic')}</Option>
            </Select>
            </FormGroup>
            {route_type===0&&<>
              <div style={{marginBottom:30}}></div>
              <Table 
                title={window.__('PPTP Static Router List')}
                tableFatherCss={tableFatherCss}
                selectKey={false}
                columns={columns}
                showAdd={true}
                dataSource={pptp_static_arr}
                opration={this.handleTableModal}
              />
              <Modal
                title={window.__('PPTP Client')}
                style={{width:650,}}
                visible={this.state.visible}
                closeModel={this.handleCloseModal}
                close={true}
                >

                <FormGroup lable={window.__('IP Address')}>          
                  <input value={target||''} onChange={this.handleChangeModal('target')}/>
                  <div className="tip-err">
                    {this.modalValidator.message('target', target, 'required&&ip','',{
                    default: window.__('IP Address Field Required!'),
                    ip: window.__('IP Address Format Invalid!'),
                  })}</div>  
                </FormGroup>

                <FormGroup lable={window.__('Subnet Mask')}>
                  <input value={subnet_mask||''} onChange={this.handleChangeModal('subnet_mask')}/>
                  <div className="tip-err">
                    {this.modalValidator.message('subnet_mask', subnet_mask, 'required&&netmask','',{
                      default: window.__('Subnet Mask Field Required!'),
                      netmask: window.__('Subnet Mask Format Invalid!')
                    })}</div>
                </FormGroup>

                <button className='modal-confirm-btn'
                  onClick={this.handleCloseModal}>{window.__('Cancel')}</button>
                <button className='modal-confirm-btn'
                  onClick={this.handleModalSave}>{window.__('OK')}</button>
              </Modal>
            </>}
        </div>
    
        <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>
        <Progress 
          showProgress={this.state.showProgress} 
          locktime={this.state.locktime}
          handleRedirect={this.handleRedirect }
          message='Configuring...Please Do Not Shut Down The Device,Completed After '/>
    
        <div style={{height:88}}></div>
      </div>
    );
  }
}


  