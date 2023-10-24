import React ,{Component}from 'react';
import {axios} from '@/share';
import {FormGroup} from '@/screens/components';
import {Switch} from 'antd';
class SwitchC extends Component {
  
  state={
  }
  componentDidMount(){
      this.getData()
  }
  getData =()=>{
    axios.post({
        data:{
          HYID:191
        },
        url:"cgi-bin/cgi_huayi.cgi"
      }).then((res)=>{
        if(res.errcode===2000){        
            this.setState({enable: res.huayi_r.enable})
        }
      })
  }

  handleSwitch = name=>checked =>{
    axios.post({
        data:{
          HYID:192,
          enable:checked?1:0
        },
        url:"cgi-bin/cgi_huayi.cgi"
      }).then((res)=>{
        if(res.errcode===2000){        
            this.getData()
        }
      })
  }
    
  render(){
      const {enable} = this.state
    return (
      <FormGroup>
        <Switch  checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={enable===1} 
            onChange={this.handleSwitch("test")}
            />
      </FormGroup>
    );
  }
}

export default SwitchC

  