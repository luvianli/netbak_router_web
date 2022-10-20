import React,{Component} from 'react';
import {FormGroup,Table,PageText} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy} from '@/share';
import {message,Switch} from 'antd';

export default class URL extends Component {
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
        HYID:HYID.get_upnpd_config
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
        HYID:HYID.set_upnpd_config,
        upnp_admin:checked
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
    this.columns=[
      {
        title: window.__('Protocol'),
        dataIndex: 'proto',
        key: 'proto',
      },
      {
        title: window.__('Name'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: window.__('IP'),
        dataIndex: 'ip_addr',
        key: 'ip_addr',
      },
      {
        title: window.__('Internal Port'),
        dataIndex: 'ip_addr',
        key: 'ip_addr',
      },
      {
        title: window.__('External Port'),
        dataIndex: 'ex_port',
        key: 'ex_port',
      },
    ]
    const {result:{upnp_admin,upnp_arr}} = this.state;
    
    return (
      <div>
        <PageText 
          title={window.__('UPNP Setting')}
          msg={window.__('You can configure whether enble UPNP feature, for applications supporting UPNP protocol more stable.')}/>
                    
        <FormGroup lable={window.__('UPNP Setting')}>
            <Switch  checkedChildren={window.__('ON')} unCheckedChildren={window.__('OFF')}
            checked={upnp_admin} onChange={this.handleSwitch('upnp_admin')}/>
        </FormGroup>

        <div style={{marginBottom:30}}></div>
        {
          upnp_admin===true?
          <Table 
          title={window.__('UPNP List')}
          selectKey={false}
          columns={this.columns}
          dataSource={upnp_arr}/>
          :null
        }
        
      </div>
    );
  }
}


  