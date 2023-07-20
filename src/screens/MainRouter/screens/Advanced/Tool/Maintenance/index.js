import React,{Component} from 'react';
import {FormGroup,FormButton,PageText,Progress} from '@/screens/components';
import {axios,HYID ,posturl,smsurl,sms_HYID,deepCopy,handleRedir} from '@/share';
import {message} from 'antd';
import ReactValidator from '@/share/validator/index.js';

export default class WIFIBase extends Component {
  state={
    hbp: 0,
    hbp_src: 0
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  
  componentDidMount(){
    this.getData()
  }
  /**这是取结果的，里面置有定时器 */
  getData=()=>{    
    axios.post({
      data:{
        HYID:HYID.get_hbp_config
      },
      url:posturl
    }).then((res)=>{
        if(res.errcode === 2000){
          this.setState({
            hbp: res.huayi_r.hbp,
            hbp_src: res.huayi_r.hbp,
          })           
        }
    })
  }
  setData=(values)=>{    
    axios.post({
      data:{
        HYID:HYID.set_hbp_config,
        ...values
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){        
        message.success(window.__('Success'));
        this.getData();
      }
    })
  }
  handleChange = name => event => {
    this.setState({ 
      [name]:event.target.value
     });
  };
  handleSave=()=>{
    let hbp = this.state.hbp;
    let hbp_src = this.state.hbp_src;
    let values = {}
		if(hbp===hbp_src){
			message.success(window.__('Data Up to Date'));
			return false;
		}else{
			values = {
				hbp: this.state.hbp,
			}
			this.setData(values)
		}
  }
  
  render(){
    const {hbp}=this.state;
    return (
      <div>
        <PageText 
          title={window.__('Maintenance')}/>
          <FormGroup lable={window.__('Number Of Heartbeat Packets')}>
            <input value={hbp||''} onChange={this.handleChange('hbp')}/> 
            <div className="tip-err">
            {this.validator.message('hbp', hbp, 'required'/*&&range:1-100*/,'',{
              default: window.__('Ping Count Field Required!'),
              // range: window.__('Ping Count Range Is 1-100!'),
            })}</div>   
          </FormGroup>
          
          <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>

      </div>
    );
  }
}


  