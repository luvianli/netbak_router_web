import React,{Component} from 'react';
import {Table,ClickButton,FormButton,PageText} from '@/screens/components';
import {axios,HYID ,posturl} from '@/share';
import {Spin,message} from 'antd';
import ReactValidator from '@/share/validator/index.js';

export default class WIFIBase extends Component {
  state={
    result:{},
    result_src:{},
    stopping:false,    
		//ping_detct:	0,//检测状态：0 未检测，1 正在检测 ，2 检测完成
    action_arr:	[],
    max_hops:20,
    time_out:10
  }
  componentWillMount() {
    this.validator = new ReactValidator();
  }
  
  componentDidMount(){
    this.getData()
  }
  componentWillUnmount(){
    clearInterval(this.timeInterval);
  }
  /**这是取结果的，里面置有定时器 */
  getData=()=>{    
    axios.post({
      data:{
        HYID:HYID.get_dhcp_detect_result
      },
      url:posturl
    }).then((res)=>{
        if(res.errcode === 2000){
          if(res.huayi_r.ping_detct===1){        
            clearInterval(this.timeInterval);
            this.setState({
              stopping:true,
              action_arr:res.huayi_r.action_arr
            })          
            this.timeInterval = setInterval(() => {
              this.getData()        
              this.setState({
                action_arr:res.huayi_r.action_arr
              })          
            }, 5000);
          }
          else if(res.huayi_r.ping_detct===2 ||res.huayi_r.ping_detct===0){
            clearInterval(this.timeInterval);
            
            if(res.huayi_r.ping_detct===2 && (res.huayi_r.action_arr.length<=0)){
              message.success(window.__('No DHCP Server Found'))
            }
            this.setState({
              action_arr:res.huayi_r.action_arr,          
              stopping:false
            })
          }           
        }
    })
  }

  setStartDhcpTest=()=>{
    this.setState({
      stopping:true,
      action_arr:	[]
    })
    axios.post({
      data:{
        HYID:HYID.do_dhcp_detect,
      },
      url:posturl
    }).then((res)=>{          
        setTimeout(() => {
          this.getData()
        }, 5000);
    })      
  }

  setStopDhcpTest=()=>{
    this.setState({
      stopping:false
    })
    axios.post({
      data:{
        HYID:HYID.stop_dhcp_detect,
      },
      url:posturl
    }).then((res)=>{      
      clearInterval(this.timeInterval);
    })
  }
  
  render(){    
    
    this.columns =[
      {
        title: window.__('Index'),
        dataIndex: 'key',
        key: 'key',
        render: (index,record) => (
          <td key='indexd'><span>{index+1}</span></td>
        ),
      },
      {
        title: window.__('DHCP Server IP Address'),
        dataIndex: 'ip_addr',
        key: 'ip_addr',
      },
      {
        title: window.__('DHCP Server MAC Address'),
        dataIndex: 'mac_addr',
        key: 'mac_addr',
      },
    ]
    const {stopping,action_arr}=this.state;
    return (
      <div>
        <PageText 
          title={window.__('DHCP Detect')}/>
          
        {stopping===false?
        <ClickButton onClick={this.setStartDhcpTest}>{window.__('Start Detect')}</ClickButton>
        :<ClickButton  style={{background:'#ff0000',color:'#fff'}} onClick={this.setStopDhcpTest}>{window.__('Stop Detect')}
         <Spin style={{marginLeft:10,color:'#fff'}}/></ClickButton>
        }
        
        <div style={{marginBottom:30}}></div>
        <Table 
          title={window.__('DHCP Detect List')}
          selectKey={false}
          columns={this.columns}
          dataSource={action_arr}/>

      </div>
    );
  }
}


  