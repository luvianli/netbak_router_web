import React ,{Component}from 'react';
import {axios,smsurl,sms_HYID,deepCopy,posturl,HYID} from '@/share';
import mobile from './../../../img/mobile.png'
import pc from './../../../img/pc.png'
import wifi_ok from './../../img/wifi_ok.png'
import wifi_fail from './../../img/wifi_fail.png'
import {Modal,DLlist,Card,ClientList} from '@/screens/components';
import {totalTrafficbps,totalTrafficByte,secondsToFormatTime_H} from '@/share';
import {Icon,Spin,Button} from 'antd';
import './index.less';
import {connect} from 'react-redux'
import {actionCreater } from '@/proconfig/store'
class Home extends Component {
  
  state={
    loadingVisble:true,
    result:{},
    system_info:{},
    wireless_arr: [],
    wan_infos: {}
  }
  componentDidMount(){
    this.props.setIsHome(true)
    this.getData();
    this.getSystemData()
    this.getNetworkData()
    this.getWANData()

    this.interval=setInterval(()=>{
      if(this.props.canFresh){
        this.getData();
        this.getSystemData()
        this.getNetworkData()
        this.getWANData()
      }
    },8000)
  }
  componentWillUnmount(){
    this.props.setIsHome(false)
    clearInterval(this.interval);
  }
  
  handleLoading=(enabled)=>{
    this.setState({
      loadingVisble:enabled
    })
  }
  getData = () => {
    axios.post({
      data:{
        HYID:sms_HYID.get_overview_info
      },
      url:smsurl
    }).then((res)=>{
      this.handleLoading(false);
      if(res.errcode===2000){
        let result = res.huayi_r;
        let pic1_word = '';
        let pic1_classname = ''
        let pic1_classname1 = 'home_pic_bg ';
        let pic1_classname2 = 'no_sim';
        let pic1_hash = '';
        let conect = 'fail';
        /**有线 */
        if(result.wan_mode==="rep"||result.wan_mode==="rep4g"){          
          if(result.wan_up===1){
            /**网线已连接且能上网 */
            conect='ok';
            /**图片使用 */
            pic1_classname2 = 'eth_ok'
          }else{
            /**网线已连接但不能上网 */
            conect='no_sig';
            pic1_classname2 = 'eth_fail'
          }
          pic1_hash = 'Network/Ethernet/Status';
          pic1_word = /*result.mobile_network||*/'Internet';
        }else if(result.wan_mode==="mobile"){
          /**SIM卡插入并能上网 */
          if(result.sim_state===1){
            if(result.signal===undefined || result.signal===''||
            result.signal===0){           
              conect='no_sig';       
              pic1_classname2='no_sim'
            }
            /*判断几格信号*/
            if(result.mobile_type==='4G' ||
              result.mobile_type==='5G'||
              result.mobile_type.indexOf('5G')!==-1){
                /*if(result.signal===undefined || result.signal===''||
                result.signal===0){           
                  conect='sim_lock';       
                  pic1_classname2='no_sim'
                }else */if(result.signal>=-104){
                  pic1_classname2='sig5'
                }else if(result.signal>=-109 && result.signal<=-105){                  
                  pic1_classname2='sig4'
                }else if(result.signal>=-114 && result.signal<=-110){
                  pic1_classname2='sig3'
                }else if(result.signal>=-119 && result.signal<=-115){
                  pic1_classname2='sig2'
                }else if(result.signal<=-120){
                  pic1_classname2='sig1'
                }else{
                  pic1_classname2='no_sim'
                }
                conect='ok';         
            }else if(result.mobile_type==='3G'){
              /*if(result.signal===undefined || result.signal===''||
                result.signal===0){        
                  conect='sim_lock';          
                pic1_classname2='no_sim'
              }else*/ if(result.signal>=-92){
                pic1_classname2='sig5'
              }else if(result.signal>=-98 && result.signal<=-93){                  
                pic1_classname2='sig4'
              }else if(result.signal>=-104 && result.signal<=-99){
                pic1_classname2='sig3'
              }else if(result.signal>=-110 && result.signal<=-105){
                pic1_classname2='sig2'
              }else if(result.signal<=-111){
                pic1_classname2='sig1'
              }else{
                pic1_classname2='no_sim'
              }
              conect='ok';       
            }
          }else if(result.sim_state===2){
            /**插入SIM卡但需要输入PIN码 */
            pic1_classname2 = 'no_sim'
            conect='sim_lock';
          }else{
            conect='fail';
            pic1_classname2 = 'no_sim'
          }
          pic1_hash = 'Network/Ethernet/Status';
          pic1_word = result.mobile_network;
        }else{
          conect='no_sig';
          pic1_classname2 = 'eth_fail'
          /*conect='fail';
          pic1_classname2 = 'no_sim';*/
          pic1_hash = '';
          pic1_word = 'No Internet';
        }
        pic1_classname = pic1_classname1+pic1_classname2;
        this.setState({ 
          pic1_hash, 
          pic1_classname,
          conect:conect,   
          pic1_word:pic1_word,
          result:deepCopy(res.huayi_r),
        })
      }
    })
  };
  getSystemData=()=>{    
    axios.post({
      data:{
          HYID:HYID.get_home_system_info,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode === 2000){    
        this.setState({
          system_info:deepCopy(res.huayi_r)
        })
      }
    })
}  
  getNetworkData=()=>{    
    axios.post({
      data:{
          HYID:HYID.get_home_network_info,
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode === 2000){ 
        this.setState({
          wireless_arr:deepCopy(res.huayi_r.wireless_arr),
          rep_info:deepCopy(res.huayi_r.rep_info),
        })
      }
    })
  } 
  getWANData =()=>{
    axios.post({
      data:{
        HYID:HYID.get_network_info
      },
      url:posturl
    }).then((res)=>{
      if(res.errcode===2000){
        this.setState({     
          wan_infos:deepCopy(res.huayi_r.wan_infos),
        })
      }
    })
  }
  changeHash=(hash)=>{
    if(hash===''){
      return;
    }
    if(hash==='Devices'){      
      window.location.hash=hash;
      return;
    }
    window.location.hash=hash;
    window.location.reload();
  }

  onRef=(ref)=>{
    this.child = ref
  }

  handleScanList=(radio_id)=>{
    this.setState({radio_id:radio_id});
    this.child.handleScanList(radio_id);
  }
    
  render(){
    const {result:{wan_mode,mobile_type,wifi_2g,wifi_5g,client_sum,tx_bps,rx_bps,rx_bytes,tx_bytes,wan_uptime,signal_4g},
      pic1_word,conect,pic1_classname,pic1_hash,system_info,wireless_arr,wan_infos} = this.state;
    return (
      <div className='home'>
        <div className='home-pic'>
          <div className="part part1">
            <div className={pic1_classname ||'home_pic_bg'} onClick={()=>this.changeHash(pic1_hash)}></div>
            {/* {
              wan_mode==="mobile"?<div className='desc desc1'>{mobile_type }&nbsp;{window.__(pic1_word)}</div>:
              <div className='desc desc1'>{window.__(pic1_word)}</div>
            } */}
          </div>
          <div className='part part2'>
            <div className='desc desc4 text'>
              {
                  conect==='ok'?<>
                  <div style={{color:'green'}}><Icon type="arrow-up" />{totalTrafficbps(tx_bps)}</div>
                  <div style={{color:'red'}}><Icon type="arrow-down" />{totalTrafficbps(rx_bps)}</div>
                  </>:conect==='sim_lock'?<div onClick={()=>this.changeHash('Advanced/System/PINCode')} className="mainColor">{window.__('Enter Correct SIM Card PIN Code!')}</div>:
                  conect==='no_sig'?window.__('No Internet'):window.__('Invalid Or Missing SIM Card!')
              }
            </div>
            <div className={conect==='ok'?'home_connect_ok_text line1':'line1'}></div>  
          </div>
          <div className="part part3">
            <div className='home_router' onClick={()=>this.changeHash('Advanced/System/Device')}></div>  
            <div className='desc desc3'>{window.__('Router')}</div>
          </div>
          <div className='part part4'>
            <div className='desc desc4'>
                <div onClick={()=>this.changeHash('WiFi/2G/Base')} className="cursor"><img src={wifi_2g===1?wifi_ok:wifi_fail}></img>2.4GHz</div>
                <div onClick={()=>this.changeHash('WiFi/5G/Base')} className="cursor"><img src={wifi_5g===1?wifi_ok:wifi_fail}></img>5.8GHz</div>
              </div>
              <div onClick={()=>this.changeHash('Network/LAN/LAN')} className={wifi_2g===0?'home_connect_fail':'home_connect_ok line1'}></div>
            </div>
          <div className='part part5'>
            <div className='line2'></div>
            <div onClick={()=>this.changeHash('Devices')}>
              <img src={mobile} alt='' className='mobile_pic'/>
              <img src={pc} alt='' className='pc_pic'/>
            </div>
            <div className='clien-num' onClick={()=>this.changeHash('Devices')}><span className='number'>{client_sum}</span>{window.__('devices')}</div>
            <div className="desc desc5">{window.__('Home Devices')}</div>
          </div>
          <div className='part part6'>
            <span className="iconfont signal">&#xe62d;</span>
            <div style={{fontSize:14}}>{window.__('4G Signal Quality')}</div>
            <div className='test' style={{fontSize:14,marginTop:15}}>{window.__('current')} <span style={{fontSize:34,fontWeight: 'bold'}}>{signal_4g}</span> {window.__('points')}</div>
          </div>
        </div>
        <div className='mobile_part6'>
          <span className="iconfont signal">&#xe62d;</span>
          <div style={{fontSize:14}}>{window.__('4G Signal Quality')}</div>
            <div className='test' style={{fontSize:14,marginTop:15}}>{window.__('current')} <span style={{fontSize:34,fontWeight: 'bold'}}>{signal_4g}</span> {window.__('points')}</div>
        </div>

        <div className='home-footer'>
          <Card height={'300px'}>
          
            <div className="card-2pic">
              <h2>{window.__('WAN Information')}</h2>
              <DLlist data={/*wan_infos.link===1?*/[
                    {key:window.__('ICCID'),value:wan_infos.iccid},
                    {key:window.__('IP Address'),value:wan_infos.ip_addr},
                    {key:window.__('Subnet Mask'),value:wan_infos.subnet_mask},
                    {key:window.__('Uplink Speed'),value:totalTrafficbps(wan_infos.tx_bps)},
                    {key:window.__('Downlink Speed'),value:totalTrafficbps(wan_infos.rx_bps)},
                    // {key:window.__('Tx Bytes'),value:totalTrafficByte(wan_infos.tx_bytes)},
                    // {key:window.__('Rx Bytes'),value:totalTrafficByte(wan_infos.rx_bytes)},
                    {key:window.__('Internet Access Mode'),value:window.__(wan_infos.net_type)},
                ]
                // :
                // [
                //   {key:window.__('ICCID'),value:wan_infos.iccid},
                //   {key:window.__('Connection Status'),value:window.__('Disconnected')},
                // ]
                } />
            </div>

            <div className="card-2pic">
              <h2>{window.__('System Information')}</h2>
              <DLlist data={[
                  {key:window.__('Product Name'),value:system_info.pro_name},
                  {key:window.__('Firmware Version'),value:system_info.fw_version},
                  {key:window.__('Domain Name'),
                    value:<a href={`http://${system_info.domain}`} target="blank">{system_info.domain}</a>},
                  // {key:window.__('Official Website'),
                  //   value:<a href={`http://${system_info.company_domain}`} target="blank">
                  //         {system_info.company_domain}</a>},
                  // {key:window.__('Release Time'),value:system_info.build_time},
                  {key:window.__('Time of Day'),value:system_info.time_day},
                  {key:window.__('Uptime'),value:secondsToFormatTime_H(system_info.uptime)},
                  {key:window.__('IMEI'),value:system_info.IMEI},
                  {key:window.__('Device Number'),value:system_info.device_umber},
              ]}/>
            </div>

            <div className="card-2pic">
              <h2>{window.__('2.4G Wireless Information')}</h2>
              {wireless_arr.length>0?
                <DLlist data={wireless_arr[0].status===1?[
                      {key:window.__('Wireless Status'),value:wireless_arr[0].status===1?window.__('Enable'):window.__('Disable')},
                      {key:'SSID',value:wireless_arr[0].ssid},
                      {key:window.__('Wireless Mode'),value:
                                                      wireless_arr[0].band===0?"11BG":
                                                      wireless_arr[0].band===1?"11B":
                                                      wireless_arr[0].band===2?"11A":
                                                      wireless_arr[0].band===4?"11G":
                                                      wireless_arr[0].band===6?"11N":
                                                      wireless_arr[0].band===8?"11AN":
                                                      wireless_arr[0].band===9?"11BGN":
                                                      wireless_arr[0].band===14?"11AC":''},
                      {key:window.__('Channel'),
                        value:`${wireless_arr[0].channel===0?'AUTO'
                        :wireless_arr[0].channel}${wireless_arr[0].channel!==0&&wireless_arr[0].auto_channel===1?'(AUTO)':''}`},
                      {key:window.__('Auth Mode'),value:wireless_arr[0].auth_mode},
                      {key:window.__('MAC Address'),value:wireless_arr[0].bssid},
                      {key:window.__('Associations'),value:<label style={{color:'#008eff',cursor:'pointer'}} 
                      onClick={()=>this.handleScanList(Number(wireless_arr[0].section))}>{wireless_arr[0].client_sum}{window.__('Click to view')}</label>},
                  ]:[
                    {key:window.__('Wireless Status'),value:wireless_arr[0].status===1?window.__('Enable'):window.__('Disable')},
                  ]} />
              :null}
            </div>
          </Card>
          <Card height={'300px'}>
          <div className="card-2pic">
              <h2>{window.__('5.8G Wireless Information')}</h2>
              {wireless_arr.length>1?
                <DLlist data={wireless_arr[1].status===1?[
                      {key:window.__('Wireless Status'),value:wireless_arr[1].status===1?window.__('Enable'):window.__('Disable')},
                      {key:'SSID',value:wireless_arr[1].ssid},
                      {key:window.__('Wireless Mode'),value:
                                                      wireless_arr[1].band===0?"11BG":
                                                      wireless_arr[1].band===1?"11B":
                                                      wireless_arr[1].band===2?"11A":
                                                      wireless_arr[1].band===4?"11G":
                                                      wireless_arr[1].band===6?"11N":
                                                      wireless_arr[1].band===8?"11AN":
                                                      wireless_arr[1].band===9?"11BGN":
                                                      wireless_arr[1].band===14?"11AC":''},
                      {key:window.__('Channel'),
                        value:`${wireless_arr[1].channel===0?'AUTO'
                        :wireless_arr[1].channel}${wireless_arr[1].channel!==0&&wireless_arr[1].auto_channel===1?'(AUTO)':''}`},
                      {key:window.__('Auth Mode'),value:wireless_arr[1].auth_mode},
                      {key:window.__('MAC Address'),value:wireless_arr[1].bssid},
                      {key:window.__('Associations'),value:<label style={{color:'#008eff',cursor:'pointer'}} 
                      onClick={()=>this.handleScanList(Number(wireless_arr[1].section))}>{wireless_arr[1].client_sum}{window.__('Click to view')}</label>},
                  ]:[
                    {key:window.__('Wireless Status'),value:wireless_arr[1].status===1?window.__('Enable'):window.__('Disable')},
                  ]} />
              :null}
            </div>
          </Card>
          <ClientList 
            onRef={this.onRef}
            show_scanbtn = {false}
            show_action = {false}
            radio_id = {this.state.radio_id}
          />
        </div>
        
        <Modal
            style={{width:450,height:200,marginTop:100}}
            visible={this.state.loadingVisble}
            >          
            <div style={{marginTop:60,fontSize:15,textAlign:'center'}}>
              <Spin/><span style={{paddingLeft:10}}>{window.__('Loadding...')}</span> 
            </div>
          </Modal>
      </div>
    );
  }
}

const mapState = (state)=>({
  canFresh:state.getIn(['common','canFresh']),
  isHome:state.getIn(['common','isHome'])
})

const mapDispatch = (dispatch) =>({
  setFresh(args){
      dispatch(actionCreater.setFresh(args))
  },
  setIsHome(args){
    dispatch(actionCreater.setIsHome(args))
},
})

export default connect(mapState,mapDispatch)(Home)

  