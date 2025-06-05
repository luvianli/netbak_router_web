import React,{Component} from 'react';
import {FormGroup,Table,PageText,FormPassword,Modal} from '@/screens/components';
// import MyModal  from '@/screens/components/Modal';
import {axios,HYID ,posturl,deepCopy,IPstrToArr,netmaskToBit,ipToNumber} from '@/share';
import ReactValidator from '@/share/validator/index.js';
import {message,Select,Icon} from 'antd';
const { Option } = Select;
/**添加列表：
 * ALL ：列表中添加的账户不能重复
 * 其他协议：当前协议列表中的账号不能重复，且不能与ALL的账号重复
 * */

export default class MACFilter extends Component {
  state={
    visible:false,
    authenticate:'all',
    usr:'',
    pwd:'',
    remote_addr:'',
    com:'',
    vpnusr_arr:[],
    vpn_type_arr:[],
    edigIndex:-1,
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
        HYID:HYID.get_vpn_user_config
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
            vpnusr_arr:deepCopy(res.huayi_r.vpnusr_arr),
            vpn_type_arr:deepCopy(res.huayi_r.vpn_type_arr),
            pptpd_start_addr: res.huayi_r.pptpd_start_addr,
            pptpd_end_addr: res.huayi_r.pptpd_end_addr,
            xl2tpd_start_addr: res.huayi_r.xl2tpd_start_addr,
            xl2tpd_end_addr: res.huayi_r.xl2tpd_end_addr
        })
      }
    })
  };  
  setData=(rules)=>{
    axios.post({
      data:{
        HYID:HYID.set_vpn_user_config,
        vpnusr_arr:rules,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        message.success(window.__('Success'));
        this.getData();
        this.handleCloseModal();
      }
    })
  }
  handleChangeModal = name => event => {
    this.setState({ [name]:event.target.value });
  };
  handleModal=()=>{
    this.setState({
      visible:!this.state.visible
    })
  }
  
  handleChange = name => event => {
    this.setState({ [name] : event.target.value });
  };
  
  handleSelect= name => value =>{    
    this.setState({ [name] : value });
  }
  handleCloseModal=()=>{
    this.setState({
      visible:false,
      authenticate:'all',
      usr:'',
      pwd:'',
      remote_addr:'',
      route_arr:'',
      com:'',
      edigIndex:-1,
    })
    this.validator.hideMessages();
  }
  handleSave=()=>{    
    const {route_arr,authenticate,usr,pwd,remote_addr,com,edigIndex,pptpd_start_addr,pptpd_end_addr,xl2tpd_start_addr,xl2tpd_end_addr} = this.state;
    const rules = deepCopy(this.state.vpnusr_arr);
    if(edigIndex != -1){
      if(route_arr===this.renderRoute(rules[edigIndex].route_arr)&&
        authenticate===rules[edigIndex].authenticate&&
        usr===rules[edigIndex].usr&&
        pwd===rules[edigIndex].pwd&&
        remote_addr===rules[edigIndex].remote_addr&&
        com===rules[edigIndex].com){
          message.success(window.__('Data Up to Date'))
          return false
      }else{
        rules.splice(edigIndex,1)
      }
    }
    if(this.validator.allValid()){
      //add new one (先判断是否超过10条,是否重复)
      if(rules.length >= 32){
        message.error(window.__('At Most 32 rules!'));
        return;
      }
      if(remote_addr){
        if(authenticate==="all"){
          if(
            (ipToNumber(pptpd_start_addr) <= ipToNumber(remote_addr) &&
            ipToNumber(pptpd_end_addr) >= ipToNumber(remote_addr)) ||
            (ipToNumber(xl2tpd_start_addr) <= ipToNumber(remote_addr) &&
            ipToNumber(xl2tpd_end_addr) >= ipToNumber(remote_addr))
          ){}else{
            message.error(window.__("The Assign IP Must Be In The Range Of Start IP And End IP!"))
            return false;
          }
        }else if(authenticate==="pptp"){
          if(ipToNumber(remote_addr) < ipToNumber(pptpd_start_addr) || ipToNumber(remote_addr) > ipToNumber(pptpd_end_addr)){
            message.error(window.__("The Assign IP Must Be In The Range Of Start IP And End IP!"))
            return false;
          }
        }else{
          if(ipToNumber(remote_addr) < ipToNumber(xl2tpd_start_addr) || ipToNumber(remote_addr) > ipToNumber(xl2tpd_end_addr)){
            message.error(window.__("The Assign IP Must Be In The Range Of Start IP And End IP!"))
            return false;
          }
        }
      }
      let flag = false;
      flag = rules.some(item=>{
        //所有的账号不一样
        return item.usr === usr
        /* ALL ：列表中添加的账户不能重复
        * 其他协议：当前协议列表中的账号不能重复，且不能与ALL的账号重复
        if(authenticate === 'all'||
          item.authenticate === authenticate||
          item.authenticate=='all'){
          return item.usr === usr
        }*/
      })
      if(flag){        
        message.error(window.__('This User Name Already Exists!'))
      }else{
        let routeArr = IPstrToArr(route_arr);
        rules.push({route_arr:routeArr,authenticate,usr,pwd,remote_addr,com});
        this.setData(rules)
      }
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  
  handleEdit=(index)=>{
    const rules = deepCopy(this.state.vpnusr_arr);
    let routeArr = this.renderRoute(rules[index].route_arr);
    this.setState({
      visible:true,
      edigIndex:index,
      route_arr:routeArr,
      authenticate:rules[index].authenticate,
      usr:rules[index].usr,
      pwd:rules[index].pwd,
      remote_addr:rules[index].remote_addr,
      com:rules[index].com,
    })
  }
  handleDelete = (index) => {
    this.handleUserDelete(index);
    /*Modal.confirm({
        title: window.__("ConfirmDel"),
        okText: window.__('OK'),
        okType: 'danger',
        cancelText: window.__("Cancel"),
        onOk: () => {
            this.handleUserDelete(index);
        }
    })*/
  }
    handleUserDelete=(index)=>{    
        const rules = deepCopy(this.state.vpnusr_arr);
        rules.splice(index,1)
        this.setData(rules);
    }
  renderWanList=()=>{      
      return this.state.vpn_type_arr.map((item,index)=>{      
        return (
          <Option key={index} value={item.authenticate}>{item.authenticate.toUpperCase()}</Option>
        )
      })
    }
  renderRoute=(route_arr)=>{
    let str = '';
    if(!route_arr){
      return "";
    }
    for(let i = 0; i < route_arr.length; i++){
      str += route_arr[i].target;
      str += '/';
      str += netmaskToBit(route_arr[i].subnet_mask);
      str += ';';
    }
    return str;
  }
  render(){
    const routeCss = {
      maxWidth:"217px",
      overflow: "hidden",
      textOverflow:"ellipsis",
      whiteSpace: "nowrap"
    }
    this.columns=[
        {
            title: window.__('User Type'),
            dataIndex: 'authenticate',
            key: 'authenticate',
            render: (index,record) => {
                return (<td key='authenticate'>{record.authenticate.toUpperCase()}</td>)
            }
        }, {
            title: window.__('User Name'),
            dataIndex: 'usr',
            key: 'usr',
        }, {
            title: window.__('Password'),
            dataIndex: 'pwd',
            key: 'pwd',
        }, {
            title: window.__('Assign IP'),
            dataIndex: 'remote_addr',
            key: 'remote_addr',
        }, {
            title: window.__('Comment'),
            dataIndex: 'com',
            key: 'com',
        }, {
            title: window.__('Server Static Router'),
            key: 'route_arr',
            render: (index,record) => (
              <td key='route' style={routeCss} title={this.renderRoute(record.route_arr)}>{this.renderRoute(record.route_arr)}</td>
            ),
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
    const {edigIndex,route_arr,vpnusr_arr,authenticate,usr,pwd,remote_addr,com} = this.state;
    let defaultAuth = this.state.vpn_type_arr.length>0?this.state.vpn_type_arr[0].authenticate:'';
    return (
      <div>
        <PageText 
          title={window.__('User Management')}
          msg={window.__('')}
        />
                    
        <div style={{marginBottom:30}}></div>
        <Table 
        title={window.__('User Management')}
        selectKey={false}
        columns={this.columns}
        showAdd={true}
        dataSource={vpnusr_arr}
        opration={this.handleModal}/>
        
      <Modal
        title={window.__('User Management')}
        style={{width:650,}}
        visible={this.state.visible}
        closeModel={this.handleCloseModal}
        close={true}
        >          
        <FormGroup lable={window.__('User Type')}>
            <Select value={authenticate} 
                defaultValue={defaultAuth}
                onChange={this.handleSelect('authenticate')}>
                {this.renderWanList(this.state.vpn_type_arr)}
            </Select>
        </FormGroup>
        
        <FormGroup lable={window.__('User Name')}>
            <input value={usr||''} readOnly={edigIndex!=-1} onChange={this.handleChange('usr')}/> 
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

        <FormGroup lable={window.__('Assign IP')}>
            <input value={remote_addr||''} 
                placeholder="AUTO"
                onChange={this.handleChange('remote_addr')}/>
            <div className="tip-err">
            {this.validator.message('remote_addr', remote_addr, 'ip','',{
                ip: window.__('Remote IP Format Invalid!'),})}</div>  
        </FormGroup>

        <FormGroup lable={window.__('Server Static Router')}>
          <input value={route_arr||''} onChange={this.handleChangeModal('route_arr')}/>
        </FormGroup>        
        <div className="tip-err">
          {this.validator.message('route_arr', route_arr, 'ipmask&&max:128','',{
            default: window.__('Server Static Router Format Invalid!'),
            max: window.__('Server Static Router At Most 128 Characters!'),
          })}</div>  
        <div className="tip">{window.__("Format:192.168.7.0/24 For Multiple Network Segments; Separate")}</div>
        
        <FormGroup lable={window.__('Comment')}>
          <input value={com||''} onChange={this.handleChangeModal('com')}/>
        </FormGroup>        
        <div className="tip-err">
          {this.validator.message('com', com, 'max:16','',{ 
            default: 'comment_atmost',
            max: window.__('Comment At Most 16 Characters!'),        
          })}</div>  
        
        <button className='modal-confirm-btn'
          onClick={this.handleCloseModal}>{window.__('Cancel')}</button>
        <button className='modal-confirm-btn'
          onClick={this.handleSave}>{window.__('OK')}</button>
      </Modal>
      </div>
    );
  }
}
