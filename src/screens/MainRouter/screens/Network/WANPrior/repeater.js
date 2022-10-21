import React, { Component } from 'react';
import { Table,Progress,FormPassword,FormGroup,FormButton,Modal} from '@/screens/components';
import {axios,HYID ,posturl,deepCopy,handleRedir} from '@/share';
import './index.less'
import { Input,Button,Spin,Icon } from 'antd';
import ReactValidator from '@/share/validator/index.js';
import lock1 from './img/lock1.png'
import lock2 from './img/lock2.png'
import lock3 from './img/lock3.png'
import lock4 from './img/lock4.png'
import unlock1 from './img/unlock1.png'
import unlock2 from './img/unlock2.png'
import unlock3 from './img/unlock3.png'
import unlock4 from './img/unlock4.png'

class BaseLan extends Component {
  
  state={
    showRemotemsg:false,
    scan_list:[],
    selectList:[],
    showProgress:false,
    showRelaySSID:false,
    locktime:0,
    rep_ssid_24g:'',
  }
  componentWillMount() {
    this.validator = new ReactValidator();
    this.props.onChildEvent(this)
  }
  componentDidMount(){
    this.setWirelessScan()
  }
  componentWillUnmount(){
    clearInterval(this.intervalId);
  }
  componentWillReceiveProps(nextProps){
      this.setState({
        showRelaySSID:nextProps.showRelaySSID,
      })
  }
  setWirelessScan=()=>{
    axios.post({
      data:{
        HYID:HYID.set_wireless_scan,
      },
      url:posturl
    }).then((res)=>{
        if(res.errcode === 2000){ 
          this.getWirelessScanStatus() 
        }      
      })
  }
  handleSetWirelessScan=()=>{
    this.setState({
      showRemotemsg:false
    })
    axios.post({
      data:{
        HYID:HYID.set_wireless_scan,
      },
      url:posturl
    }).then((res)=>{
        if(res.errcode === 2000){  
          this.getWirelessScanStatus()
        }      
      })
  }
  getWirelessScanStatus=()=>{
    axios.post({
      data:{
        HYID:HYID.get_wireless_scan_status,
      },
      url:posturl
    }).then((res)=>{
        if(res.errcode === 2000){    
          clearInterval(this.intervalId);
          if(res.huayi_r.scan_status===0){
            this.getWirelessScanList()
            //this.setWirelessScan()
            //this.intervalId = setInterval(() => {
            //  /**定时获取扫描状态 */
            //  this.getWirelessScanStatus()
            //}, 3000);

          }
          if(res.huayi_r.scan_status===1){
            this.intervalId = setInterval(() => {
              /**定时获取扫描状态 */
              this.getWirelessScanStatus()
            }, 3000);
            
          }
          if(res.huayi_r.scan_status===2){
            clearInterval(this.intervalId);
            this.getWirelessScanList()
          }
          this.setState({
            scan_status:res.huayi_r.scan_status,
          })
        }      
      })
    }

  getWirelessScanList=()=>{
    axios.post({
      data:{
        HYID:HYID.get_wireless_scan_list,
      },
      url:posturl
    }).then((res)=>{
        if(res.errcode === 2000){
          /**排序 */
          let scan_24G_arr = res.huayi_r.scan_24G_arr || []
          // let scan_58G_arr = res.huayi_r.scan_58G_arr || []
          scan_24G_arr.sort(function(a,b){
              let x=parseInt(a['signal']);
              let y=parseInt(b['signal']);
              return ((x>y)?-1:((x<y)?1:0));
          });
          // scan_58G_arr.sort(function(a,b){
          //     let x=parseInt(a['signal']);
          //     let y=parseInt(b['signal']);
          //     return ((x>y)?-1:((x<y)?1:0));
          // });
          scan_24G_arr.map((item,index)=>{
            if(item.auth_mode==='NONE'){
              if(item.signal>=60){              
                scan_24G_arr[index].img=unlock1
              }
              else if(item.signal>=45&&item.signal<60){              
                scan_24G_arr[index].img=unlock2
              }
              else if(item.signal>=30&&item.signal<45){              
                scan_24G_arr[index].img=unlock3
              }
              else{  
                scan_24G_arr[index].img=unlock4
              }
            }
            else{              
              if(item.signal>=60){              
                scan_24G_arr[index].img=lock1
              }
              else if(item.signal>=45&&item.signal<60){      
                scan_24G_arr[index].img=lock2
              }
              else if(item.signal>=30&&item.signal<45){      
                scan_24G_arr[index].img=lock3
              }
              else{  
                scan_24G_arr[index].img=lock4
              }
            }
          })
          // scan_58G_arr.map((item,index)=>{
          //   if(item.auth_mode==='NONE'){
          //     if(item.signal>=60){              
          //       scan_58G_arr[index].img=unlock1
          //     }
          //     else if(item.signal>=45&&item.signal<60){        
          //       scan_58G_arr[index].img=unlock2
          //     }
          //     else if(item.signal>=30&&item.signal<45){      
          //       scan_58G_arr[index].img=unlock3
          //     }
          //     else{  
          //       scan_58G_arr[index].img=unlock4
          //     }
          //   }
          //   else{              
          //     if(item.signal>=60){              
          //       scan_58G_arr[index].img=lock1
          //     }
          //     else if(item.signal>=45&&item.signal<60){      
          //       scan_58G_arr[index].img=lock2
          //     }
          //     else if(item.signal>=30&&item.signal<45){            
          //       scan_58G_arr[index].img=lock3
          //     }
          //     else{  
          //       scan_58G_arr[index].img=lock4
          //     }
          //   }            
          // })
          let scan_list = [];
          scan_list.push(/*...scan_58G_arr,*/...scan_24G_arr,)
          this.setState({
            scan_list:deepCopy(scan_list),
          })
        }      
      })
    }
      handleRedirect=()=>{
        //handleRedir(this.state.redir,this.state.redir_ip)      
        this.setState({
          showProgress:false,
          showRelaySSID:true
        })
        localStorage.setItem("status", 4001);
        
        /*if(this.state.redir_ip === ''){
          this.props.setOpmode(this.props.opmode)
        }*/
    }
    
    handleRepConfig=()=>{
        let selectList = deepCopy(this.state.selectList)
        let validarr = ['rep_ssid_24g']
        if(this.state.selectList.auth_mode !== 'NONE'){
          validarr.push('key')
        }
        if( this.validator.someValid(validarr) ){
          this.setState({selectList})
          return true
        } else {
          this.validator.showMessages();
          this.forceUpdate();
          return false
        }
    }
    
    handleSelect=(index)=>{
      let selectList = this.state.scan_list[index];
      selectList.rep_ssid_24g = selectList.ssid+'-2.4G-EXT'
      this.setState({
        showRemotemsg:true,
        selectList:selectList
      })
      this.props.selectTo()
    }

  handleChange = (name,list) => event => {
    let result;
    if(list==='repeater'){
      result = deepCopy(this.state.selectList)
    }
    /**切换加密方式时 修改加密类型 */
    if((name === 'auth_mode') && (event.target.value !=='NONE'))
    result['encryption'] = 'TKIP'
    else if((name === 'auth_mode') && (event.target.value ==='NONE')){
      result['encryption'] = ''
      result['key'] = ''
    }
    result[name] = event.target.value
    if(list==='repeater'){
      this.setState({ selectList:result });
    }
  };
  renderChannel=()=>{
    let channel_com = [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
      return channel_com.map(item =>{  
        return  <option key={item} value ={item}>{item===0?'AUTO':item}</option>
      })    
  }
  goStatus=()=>{
    window.location.href="#/status"
  }
  handleCloseModal=()=>{
    this.setState({
      showRelaySSID:false
    })
  }
  render() {  
    const {scan_status,selectList:{ssid,signal,channel,auth_mode,encryption,key,rep_ssid_24g},} = this.state  
    this.columns =[
      {
        title: window.__('Action'),
        key: 'action',
        render: (index,record) => (
          <td key='action' className={record.channel>14?'sys_table5g':'sys_table2g'}>
          <button className='button-del' onClick={()=>this.handleSelect(index)}>{window.__('Select')}</button>
          </td>
        ),
      },
      {
        title: window.__('SSID'),
        dataIndex: 'ssid',
        key: 'ssid',
        render: (index,record) => (
          <td key='ssid' className={record.channel>14?'sys_table5g':'sys_table2g'}><span>{record.ssid}</span></td>
        ),
      },
      {
        title: window.__('Signal'),
        dataIndex: 'img',
        key: 'img',
        render: (index,record) => (
          <td key='img' className={record.channel>14?'sys_table5g':'sys_table2g'}>
            <img style={{width:25,height:20}} src={record.img}></img></td>
        ),
      },
      /*{
        title: window.__('Signal'),
        dataIndex: 'signal',
        key: 'signal',
        render: (index,record) => (
          <td key='signal' className={record.channel>14?'sys_table5g':'sys_table2g'}><span>{record.signal}</span></td>
        ),
      },
      {
        title: window.__('Auth Mode'),
        dataIndex: 'auth_mode',
        key: 'auth_mode',
        render: (index,record) => (
          <td key='auth_mode' className={record.channel>14?'sys_table5g':'sys_table2g'}><span>{record.auth_mode==='NONE'?record.auth_mode:`${record.auth_mode}/${record.encryption}`}</span></td>
        ),
      },*/
      {
        title: window.__('Channel'),
        dataIndex: 'channel',
        key: 'channel',
        render: (index,record) => (
          <td key='channel' className={record.channel>14?'sys_table5g':'sys_table2g'}><span>{record.channel}</span></td>
        ),
      },
      {
        title: window.__('MAC Address'),
        dataIndex: 'bssid',
        key: 'bssid',
        render: (index,record) => (
          <td key='bssid' className={record.channel>14?'sys_table5g':'sys_table2g'}><span>{record.bssid}</span></td>
        ),
      },

    ] 
    return (
      <div className='main-wizard'>
      <>
      {
        this.state.showRemotemsg===true?
        <>
          <FormGroup  lable={window.__('Remote SSID')} >    
          
            <Input type="text"  readOnly
                  value ={ssid||""}
                  />     
            </FormGroup>
        {this.props.opmode===3?null:
        <FormGroup  lable={window.__('Extended SSID')} >      
          <Input type="text"            
                value ={rep_ssid_24g||""}
                onChange={this.handleChange('rep_ssid_24g','repeater')}/>                        
          <div className="tip-err">
          {this.validator.message('rep_ssid_24g', rep_ssid_24g, 'required&&max:32&&ssid&&houtais','',{
              default: window.__('SSID Field Required!'),                 
              houtais:  window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
              max: window.__('SSID At Most 32 Characters!'),
              ssid: window.__('Chinese Characters, Numbers, Letters, Underscores, Bars, Spaces Are Vaild!')
          })}</div>      
          </FormGroup>
        }
          {/*
            <FormGroup  lable={window.__('Channel')}>        
            <Input type="text" value ={channel||""} readOnly/>   
            </FormGroup>
            
            <FormGroup  lable={window.__('Security Mode')}>   
            <Input type="text" value ={auth_mode||""} readOnly/>

            </FormGroup>
            <FormGroup  lable={window.__('Cipher Mode')}>   
              <Input type="text" value ={encryption||""} readOnly/>  
            </FormGroup>
          */}  
            {auth_mode!=='NONE'?
            <>
              <FormPassword lable={window.__('Remote Password')}   
                value ={key||""}
                onChange={this.handleChange('key','repeater')}>
              </FormPassword>                      
              <div className="tip-err">
              {this.validator.message('key', key, 'required&&min:8&&max:63&&password&&houtais','',{
                  default: window.__('Password Field Required!'),             
                  houtais:  window.__('Limited To English Letters And Characters, Numbers, And Chinese Characters,But Not Contain The Following: \" \' ` \\'),
                  min: window.__('Password At Least 8 Characters!'),
                  max: window.__('Password At Most 63 Characters!'),
                  password: window.__('Only Supports ASCII Code!')
              })}</div>  
              </>
            :null} 
            {/* <FormButton onClick={()=>this.handleRepConfig('repeater')}>{window.__('Apply')}</FormButton> */}
            </>:null
          }
          

          {
            scan_status===1?
            <div className="scan-loading">
              <Button onClick={this.scanAction}>{window.__('Scanning...')}</Button>
              <Spin/>
              <div class="overlay"></div>
            </div>
            :
            scan_status===2?<Button onClick={this.handleSetWirelessScan}>{window.__('Rescan')}</Button>:
            <Button onClick={this.handleSetWirelessScan}>{window.__('Scan')}</Button>
          
          }
          
          <div style={{height:28}}></div>
          <div className='wiz-table'>
            
        <Table 
        title={window.__('Scan List')}
        selectKey={false}
        columns={this.columns}
        dataSource={this.state.scan_list}/>

          </div>

        </>
        

      <Modal
              style={{width:650,height:260,marginTop:20}}
              visible={this.state.showRelaySSID}
              closeModel={this.handleCloseModal}
              close={true}
              >          
              <div className="relaysucess">
                <span><Icon type="check-circle"/>{window.__('Success! Please Reconnect To Network!')}</span>
                <div><div className="textleft">{window.__("Wireless SSID After Relay:")}</div>{rep_ssid_24g}</div>
                {auth_mode!=='NONE'&&<div><div className="textleft">{window.__("Wireless Passowrd After Relay:")}</div>{key}</div>}
                {/* <div className="visitPage">{window.__('After reconnecting to the network, launch the browser and enter')}<span className="setup_url">&nbsp;{this.props.domainName}&nbsp;</span>{window.__('in the address')}</div> */}
              </div>
            </Modal>
        <Progress 
          showProgress={this.state.showProgress} 
          locktime={this.state.locktime}
          handleRedirect={this.handleRedirect}
          message='Configuring...Please Do Not Shut Down The Device,Completed After '/>

          <div className='leave_blank'></div>
      </div>
    );
  }
}


export default BaseLan


