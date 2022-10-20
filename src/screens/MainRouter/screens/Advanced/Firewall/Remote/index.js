import React,{Component} from 'react';
import {FormGroup,FormButton,PageText} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import {message,Switch} from 'antd';
import ReactValidator from '@/share/validator/index.js';

export default class WIFIBase extends Component {
  state={
    result:{},
    result_src:{}
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
        HYID:HYID.get_remote_manage_config
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
  setData=(result={},checked=null)=>{  
    //let result  = deepCopy(this.state.result);
    if(checked!==null){
      result.remote_admin = checked;
    }
    axios.post({
      data:{
        HYID:HYID.set_remote_manage_config,
        ...result,
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
    let result = deepCopy(this.state.result);
    let value = event.target.value;
    result[name] = value;
    this.setState({ result });
  };
  handleSwitch= name => checked =>{
    let result = deepCopy(this.state.result);
    result[name] = checked;
    this.setState({ result });
    if(checked===false && name ==='remote_admin'){      
      this.setData(this.state.result_src,checked)
    }
  }
  handleSave=()=>{
    const {result,result_src} = this.state;
    if(this.validator.allValid()){
      if(result.remote_admin===result_src.remote_admin&&
        Number(result.port)===Number(result_src.port) ){
        message.success(window.__('Data Up to Date'))
        return;
      }
      this.setData(result,true)
    }else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }
  render(){    
    const {result:{remote_admin,port}} = this.state;
    return (
      <div>
        <PageText 
          title={window.__('Remote Management')}/>                    
                    
        <FormGroup lable={window.__('Remote Management')}>
          <Switch  checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
          checked={remote_admin} onChange={this.handleSwitch('remote_admin')}/>
          
        </FormGroup>
          {
            remote_admin===true?<>
            <FormGroup lable={window.__('Port')}>
              <input value={port||''} onChange={this.handleChange('port')}/>
              <div className="tip-err">
                {this.validator.message('port', port, 'required&&range:80-65535','',{
                  default: window.__('Port Field Required!'),
                  range:window.__('Port Range Is 80-65535!'),
                })}</div>  
            </FormGroup>

            <FormButton onClick={this.handleSave}>{window.__('Apply')}</FormButton>
            </>:null
          }
      </div>
    );
  }
}


  