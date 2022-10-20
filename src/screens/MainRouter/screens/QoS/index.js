import React,{Component} from 'react';
import {FormGroup,Table,PageText,Modal,FormButton,ScanList} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy,deepCompare,ipRangeisExist} from '@/share';
import ReactValidator from '@/share/validator/index.js';
import {message,Switch,Icon,Select} from 'antd';
const { Option } = Select;

export default class MACFilter extends Component {
  state={
    visible:false,
    visible_cfm:false,
    listIndex:-1,
    result:{},
    result_src:{},    
    rules_totolbandwidth : {rules_totalupBandwidth:0,rules_totaldwBandwidth:0},
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
        HYID:HYID.get_qos
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        
        let rules_totalupBandwidth = 0;
        let rules_totaldwBandwidth = 0;
        res.huayi_r.iplimit_arr.forEach(item=>{
          rules_totalupBandwidth = rules_totalupBandwidth+Number(item.upBandwidth)
          rules_totaldwBandwidth = rules_totaldwBandwidth+Number(item.dwBandwidth)
        })

        this.setState({     
          result:deepCopy(res.huayi_r),
          result_src:deepCopy(res.huayi_r),
          rules_totolbandwidth : {rules_totalupBandwidth,rules_totaldwBandwidth},
        })

      }
    })
  };  
  setData=(rules=[],checked=null,result={})=>{   
    //let result  = deepCopy(this.state.result);
    const rules_totolbandwidth  = deepCopy(this.state.rules_totolbandwidth);
    result.iplimit_arr = rules;

    if(result.totalUpBw < rules_totolbandwidth.rules_totalupBandwidth){              
          message.error(window.__('The Total Uplink Bandwidth Cannot Be Less Than The Sum Of The Items Of Upload Bandwidth!'));
          this.setState({
            result:this.state.result_src
          })
          return false;
      }
      
    if(result.totalDwBw < rules_totolbandwidth.rules_totaldwBandwidth){              
          message.error(window.__('The Total Downlink Bandwidth Cannot Be Less Than The Sum Of The Items Of Download Bandwidth!'));
          this.setState({
            result:this.state.result_src
          })
          return false;
      }

    if(checked!==null){      
      result.qos_admin = checked ? "1" : "0";
    }
    this.setState({result});
    axios.post({
      data:{
        HYID:HYID.set_qos,
        ...result,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        message.success(window.__('Success'));
        this.handleCloseModal();
        this.getData();
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
    if(result.can_hwnat===1 && name==='qos_admin' && checked===true){        
      this.setState({visible_cfm:true})
    }else{
      result[name] = checked ? "1" : "0";
      this.setState({ result });
      if(name==='qos_admin'){
        this.setData(result.iplimit_arr,checked,this.state.result_src)
      }
    }
    
  }
  
  confirmSetCfg=()=>{
    let result = deepCopy(this.state.result);
    result.checked = true;
    this.setState({ result,visible_cfm:false });
    
    this.setData(result.iplimit_arr,true,this.state.result_src)
  }

  closeCfmModal=()=>{
    this.setState({
      visible_cfm:false,
    })
  }

  handleSelect= name => value =>{
    this.setState({
      [name]:value
    });
  }
  handleModal=()=>{
    if(this.state.visible === false &&
      !this.validator.someValid(['totalUpBw','totalDwBw'])){  
      this.validator.showMessages();
      this.forceUpdate();
      return false;      
    }

    this.setState({
      visible:!this.state.visible
    })
    this.validator.hideMessages();
  }
  
  handleCloseModal=()=>{
    this.setState({
      visible:false,
      listIndex:-1,
      ip_start:'',
      ip_end:'',
      upBandwidth:'',
      dwBandwidth:'',
      com:''
    })
    this.validator.hideMessages();
  }
  handleSaveAll=(rules = [], del = false)=>{
    if(this.validator.someValid(['totalUpBw','totalDwBw'])){
      const {result,result_src} = this.state;
      if(!del && deepCompare(result,result_src)){
        message.success(window.__('Data Up to Date'))
        return;
      }
      this.setData(rules,true,this.state.result);
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }

  }
  handleSaveModal=()=>{
    const {ip_start,ip_end,upBandwidth,dwBandwidth,com,listIndex} = this.state;
    const {totalUpBw,totalDwBw} = this.state.result;
    const rules = deepCopy(this.state.result.iplimit_arr);
    if(this.validator.allValid()){
      if(listIndex!==-1){//edit
        if(ip_start===rules[listIndex].ip_start&&
          ip_end===rules[listIndex].ip_end&&
          upBandwidth===rules[listIndex].upBandwidth&&
          dwBandwidth===rules[listIndex].dwBandwidth&&
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
      
      /**所有的规则的上传带宽相加不能超过总上传带宽；下载带宽也是一样 */
      let rules_totalupBandwidth = Number(upBandwidth);//先赋值为添加的数据
      let rules_totaldwBandwidth = Number(dwBandwidth)
      rules.forEach(item=>{
        rules_totalupBandwidth = rules_totalupBandwidth+Number(item.upBandwidth)
        rules_totaldwBandwidth = rules_totaldwBandwidth+Number(item.dwBandwidth)
      })
      let rules_totolbandwidth =  {rules_totalupBandwidth,rules_totaldwBandwidth}
      if(rules_totolbandwidth.rules_totalupBandwidth>totalUpBw){                 
          message.error(window.__('Uplink Bandwidth Out Of Range!'))
          return;
      }
      if(rules_totolbandwidth.rules_totaldwBandwidth>totalDwBw){            
        message.error(window.__('Downlink Bandwidth Out Of Range!'))
        return;
      }
      
      if(ipRangeisExist(rules,ip_start,ip_end)){
        this.setState({
          rules_totolbandwidth:{...rules_totolbandwidth}
        })
        rules.push({ip_start,ip_end,upBandwidth,dwBandwidth,com});
        this.setData(rules,true,this.state.result)
      }
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  
  handleEdit=(index)=>{
    const rules = deepCopy(this.state.result.iplimit_arr);
    
    if(this.state.visible === false &&
      !this.validator.someValid(['totalUpBw','totalDwBw'])){  
      this.validator.showMessages();
      this.forceUpdate();
      return false;      
    }
    this.setState({
      visible:true,
      listIndex:index,
      ip_start:rules[index].ip_start,
      ip_end:rules[index].ip_end,
      upBandwidth:rules[index].upBandwidth,
      dwBandwidth:rules[index].dwBandwidth,
      com:rules[index].com,
    })
  }
  handleDelete=(index)=>{    
    const rules = deepCopy(this.state.result.iplimit_arr);
    rules.splice(index,1)
    this.setState({
      listIndex:-1,
    })
    this.handleSaveAll(rules , true,this.state.result);
  }

  scanData=(ip,mac)=>{
    this.setState({
      ip_start:ip,
      ip_end:ip
    })
  }
  render(){    
    this.columns=[
      {
        title: window.__('Start IP'),
        dataIndex: 'ip_start',
        key: 'ip_start',
      },
      {
        title: window.__('End IP'),
        dataIndex: 'ip_end',
        key: 'ip_end',
      },
      {
        title: window.__('Uplink Bandwidth'),
        dataIndex: 'upBandwidth',
        key: 'upBandwidth',
        render: (index,record) => (
          <td key='index'>
            {`${record.upBandwidth}Mbps`}
          </td>
        ),
      },
      {
        title: window.__('Downlink Bandwidth'),
        dataIndex: 'dwBandwidth',
        key: 'dwBandwidth',
        render: (index,record) => (
          <td key='index1'>
            {`${record.dwBandwidth}Mbps`}
          </td>
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
    const {result:{totalUpBw,totalDwBw,qos_admin,iplimit_arr},
    ip_start,ip_end,upBandwidth,dwBandwidth,com} = this.state;

    return (
      <div>
        <PageText 
          title={window.__('QoS Setting')}
          msg={window.__('You can configure the parameters of ethernet QoS, for provide better quality of network service.')}/>
                    
        <FormGroup lable={window.__('QoS Setting')}>
            <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={Number(qos_admin)===1} onChange={this.handleSwitch('qos_admin')}/>
        </FormGroup>
        
      <Modal
        style={{width:650,}}
        visible={this.state.visible_cfm}
        >          
        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          margin: '30px'}}
        >{window.__('Enable QoS, System Will Automatically Turn Off Hardware NAT.')}</div>

        <button className='modal-confirm-btn'
          onClick={this.closeCfmModal}>{window.__('Cancel')}</button>
        <button className='modal-confirm-btn'
          onClick={this.confirmSetCfg}>{window.__('OK')}</button>
      </Modal>

      {Number(qos_admin)===1?<>
        <FormGroup lable={window.__('Total Uplink Bandwidth')}>
            <input value={totalUpBw} onChange={this.handleChange('totalUpBw')}/>
              <div className='tip' >{window.__('Range 1-100Mbps')}</div>
            <div className="tip-err">
            {this.validator.message('totalUpBw', totalUpBw, 'required&&range:1-100','',{
                default: window.__('Range 1-100Mbps'),})}</div>  
        </FormGroup>

        <FormGroup lable={window.__('Total Downlink Bandwidth')}>
              <input value={totalDwBw} onChange={this.handleChange('totalDwBw')}/>
              <div className='tip' >{window.__('Range 1-100Mbps')}</div>
              <div className="tip-err">
              {this.validator.message('totalDwBw', totalDwBw, 'required&&range:1-100','',{
                  default: window.__('Range 1-100Mbps'),})}</div>  
          </FormGroup>

          <FormButton onClick={()=>this.handleSaveAll(this.state.result.iplimit_arr)}>{window.__('Apply')}</FormButton>
        
          <div style={{marginBottom:30}}></div>
          
        <Table 
        title={window.__('QoS List')}
        selectKey={false}
        columns={this.columns}
        showAdd={true}
        dataSource={iplimit_arr}
        opration={this.handleModal}/>

        
      <Modal
        title={window.__('QoS Setting')}
        style={{width:650,}}
        visible={this.state.visible}
        closeModel={this.handleCloseModal}
        close={true}
        >          
        <FormGroup lable={window.__('Start IP')}>
          <input value={ip_start||''} onChange={this.handleChangeModal('ip_start')}/>
          <div className="tip-err">
            {this.validator.message('ip_start', ip_start, 'required&&ip','',{
                default: window.__('Start IP Field Required!'),
                ip: window.__('Start IP Format Invalid!'),})}</div>  
        </FormGroup>
        
        <FormGroup lable={window.__('End IP')}>
          <input value={ip_end||''} onChange={this.handleChangeModal('ip_end')}/>
          <div className="tip-err">
            {this.validator.message('ip_end', ip_end, 'required&&ip','',{
                default: window.__('End IP Field Required!'),
                ip: window.__('End IP Format Invalid!'),})}</div>  
        </FormGroup>

        
        <FormGroup lable={window.__('Uplink Bandwidth')}>
              <input value={upBandwidth} onChange={this.handleChangeModal('upBandwidth')}/>
              <div className="tip-err">
              {this.validator.message('upBandwidth', upBandwidth, 'required&&range:1-100','',{
                  default: window.__('Uplink Bandwidth Range Is 1-100Mbps!'),})}</div>  
          </FormGroup>
        <FormGroup lable={window.__('Downlink Bandwidth')}>
              <input value={dwBandwidth} onChange={this.handleChangeModal('dwBandwidth')}/>
              <div className="tip-err">
              {this.validator.message('dwBandwidth', dwBandwidth, 'required&&range:1-100','',{
                  default: window.__('Downlink Bandwidth Range Is 1-100Mbps!'),})}</div>  
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
          onClick={this.handleSaveModal}>{window.__('OK')}</button>
      </Modal>   
          <div style={{marginBottom:30}}></div>
      </>:null}
      </div>
    );
  }
}


  