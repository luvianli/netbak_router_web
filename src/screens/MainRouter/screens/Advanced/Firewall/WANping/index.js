import React,{Component} from 'react';
import {FormGroup,PageText} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import {message,Switch} from 'antd';

export default class WANPing extends Component {
  state={
    result:{},
    result_src:{}
  }
  
  componentDidMount(){
    this.getData()
  }
  getData = () => {
    axios.post({
      data:{
        HYID:HYID.get_wan_ping_config
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
  
  setData = (checked) => {
    axios.post({
      data:{
        HYID:HYID.set_wan_ping_config,
        wanping_admin:checked
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        message.success(window.__('Success'));
      }
    })
  };    
  
  handleSwitch= name => checked =>{
    let result = deepCopy(this.state.result);
    result[name] = checked;
    this.setState({ result });
    this.setData(checked);
  }
    
  render(){    
    const {result:{wanping_admin,}} = this.state;
    
    return (
      <div>
        <PageText 
          title={window.__('Wan Ping Setting')}/>
                    
        <FormGroup lable={window.__('Wan Ping Setting')}>
            <Switch  checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={wanping_admin} onChange={this.handleSwitch('wanping_admin')}/>
        </FormGroup>

        
      </div>
    );
  }
}


  