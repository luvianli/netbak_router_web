import React,{Component} from 'react';
import {FormGroup,PageText,Modal} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import {message,Switch} from 'antd';

export default class InternetConnection extends Component {
  state={
    result:{},
    result_src:{},    
    visible:false,
  }
  componentDidMount(){
    this.getData();
  }
  
  getData = () => {
    axios.post({
      data:{
        HYID:HYID.get_hwnat_config
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
          result:deepCopy(res.huayi_r),
          result_src:deepCopy(res.huayi_r),
        })        
      }
    }); 
  } 
  setData = (value) => {
    axios.post({
      data:{
        HYID:HYID.set_hwnat_config,
        nat_admin:value
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        message.success(window.__('Success'))
      }
    }); 
  } 
  handleSwitch= name => value =>{    
    let result = deepCopy(this.state.result);
    result[name] = value;
    if(name==='nat_admin'){
      if(value === true){
        this.setState({visible:true})
      }
      else{
        this.setState({ result });
        this.setData(value)

      }
    }
  }
  confirmSetCfg=()=>{
    let result = deepCopy(this.state.result);
    result.nat_admin = true;
    this.setState({ result,visible:false });
    
    this.setData(true)
  }
  handleCloseModal=()=>{
    this.setState({
      visible:false,
    })
  }
  render(){
    const {result:{nat_admin}}=this.state;
    return (
      <div>
      <PageText 
        title={window.__('Hardward NAT')}/>
            
      <FormGroup lable={window.__('Hardward NAT')}>
        <Switch checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={nat_admin||false} onChange={this.handleSwitch('nat_admin')}/>
        {nat_admin===true?
        <div className='tip'>{window.__('Enable Hardware Acceleration, Use Hardware To Forward Network Packets To Improve Network Transmission Rate.Network Statistics Will Be Inaccurate')}
        </div>:null}
      </FormGroup>
      
      <Modal
        style={{width:650,}}
        visible={this.state.visible}
        >          
        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          margin: '30px'}}
        >{window.__('Enable Hardware NAT, System Will Automatically Turn Off QoS.')}</div>

        <button className='modal-confirm-btn'
          onClick={this.handleCloseModal}>{window.__('Cancel')}</button>
        <button className='modal-confirm-btn'
          onClick={this.confirmSetCfg}>{window.__('OK')}</button>
      </Modal>
      </div>
    );
  }
}


  