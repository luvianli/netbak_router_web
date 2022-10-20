import React, { useState, useEffect } from 'react';
import {FormGroup,Table,Modal,PageText,FormButton,Progress,ClientList} from '@/screens/components';
import {axios,HYID ,posturl,handleRedir} from '@/share';
import {useForceUpdate} from '@/screens/common';
import ReactValidator from '@/share/validator/index.js';
import {message,Select,Icon} from 'antd';
const validator = new ReactValidator();
const {Option} = Select;

const ACLWifi = function ACLWifi(props){  
  const [result, setResult] = useState({});
  const [resultSrc, setResultSrc] = useState({});
  const [visible, setVisible] = useState(false);
  const [mac_addr, setMacaddr] = useState('');
  const [listIndex, setListIndex] = useState(-1);
  const [locktime, setLocktime] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const forceUpdate = useForceUpdate();
  let {
    wifi_admin,
    macfilter_arr,
  } = result;
  const columns =[
    {
      title: window.__('MAC Address'),
      dataIndex: 'mac_addr',
      key: 'mac_addr',
    },
    
    {
      title:window.__('Action'),
      key: 'action',
      render: (index,record) => (
        <td key='actiontd'>
        <Icon type="edit" className='table-icon' onClick={()=>handleEdit(index)}/>
        <Icon type="delete" className='table-icon' onClick={()=>handleDelete(index)} />
        </td>
      ),
    },
  ]

  useEffect(() => {         
    getData();
  },[])

  const getData = () =>{           
      axios.post({
          data:{
              HYID:HYID.get_wireless_acl_cfg,
              wifi_radio:props.radio_id || 0
          },
          url:posturl
      }).then((res)=>{
          if(res.errcode === 2000){  
              setResult({...res.huayi_r})
              setResultSrc({...res.huayi_r})
          }
      })
  }

  const setData = () =>{           
      axios.post({
          data:{
              HYID:HYID.set_wireless_alc_cfg,
              wifi_radio:props.radio_id || 0,
              ...result,
          },
          url:posturl
      }).then((res)=>{            
          if(res.progresstime!==0){  
              setLocktime(res.progresstime);
              setShowProgress(true);  //Warnning:这2句顺序不能倒
          }
          else {
              message.success(window.__('Success'));
              getData();
          }
      })
  }

  const handleSave = () =>{
    if(resultSrc.wifi_admin === result.wifi_admin ){//因为表格操作已经马上下发
        message.success(window.__('Data Up to Date')) 
        return false;
    }
    setData();
  }

  const handleRedirect = () =>{
      setLocktime(0);
      setShowProgress(false);
      getData();
  }
  const handleSelect = name => value =>{
    setResult({
        ...result,
        [name] : value
    })    
  }
  const handleModal = () =>{
    setVisible(!visible);
  }

  const handleCloseModal = () =>{
    setVisible(false);
    setListIndex(-1);
    setMacaddr('');
    validator.hideMessages();
  }

  const handleSaveModal = () =>{
    if(validator.allValid()){
      let rules = macfilter_arr;
      
      if(listIndex!==-1){//edit
        if(mac_addr.toUpperCase()===rules[listIndex].mac_addr.toUpperCase()){
          message.success(window.__('Data Up to Date'));
          return false;
        }
        rules.splice(listIndex,1);
      }
      
      if(rules.length>=10){
        message.error(window.__('At Most 10 Rules!'));
        return;
      }
      
      let flag = rules.some(item=>{
        return item.mac_addr.toUpperCase() === mac_addr.toUpperCase()
      })
      if(flag){        
        message.error(window.__('This MAC Already Exists!'))
      }else{
        rules.push({mac_addr});
        
        setResult({
          ...result,
          macfilter_arr : rules
        })
        
        handleCloseModal();
        setData();
      }
      
    }else {
      validator.showMessages();
      forceUpdate();
    }
    
  }
  const handleEdit = (index) =>{
    setVisible(true);
    setMacaddr(macfilter_arr[index].mac_addr);
    setListIndex(index);

  }
  const handleDelete = (index) =>{
    const rules = macfilter_arr;    
    rules.splice(index,1);
    setResult({
        ...result,
        macfilter_arr : rules
    })    
    setData();
  }
  const handleChangeModal = name => event => {
    setMacaddr(event.target.value);
  };
  
  const scanData = (ip,mac) => {
    setMacaddr(mac);
  };
  if(!props.wifi_enable){
    return(
      <div style={{
        textAlign: 'center',
        fontSize: '14px',
        margin: '30px'}}
      >{window.__('Wireless is currently off. To use it, please turn on wireless first.')}</div>
    )
  }else return(
    <div>      
      <PageText 
        title={props.radio_id === 0?'2.4G ' + window.__('Wireless ACL')
        :props.radio_id === 1?'5.8G '+ window.__('Wireless ACL')
        :window.__('Wireless ACL')}
        msg={window.__('You can configure the parameters of wirelss ACL, for Deny/Allow mobile clients access to wifi network.')}
      />            
      <FormGroup lable={window.__('Access Control Rule')}>
          <Select value={wifi_admin}
              onChange={handleSelect('wifi_admin')}
          > 
              <Option value={0}>{window.__('Disable')}</Option>
              <Option value={1}>{window.__('Allow')}</Option>
              <Option value={2}>{window.__('Deny')}</Option>
          </Select>
      </FormGroup>

      <FormButton onClick={handleSave}>
          {window.__('Apply')}
      </FormButton>
      
      <div style={{height:68}}></div>

      <Table 
        title={window.__('ACL List')}
        selectKey={false}
        columns={columns}
        showAdd={true}
        dataSource={macfilter_arr}
        opration={handleModal}/>


      <Modal
        title={window.__('ACL List')}
        style={{width:650,}}
        visible={visible}
        closeModel={handleCloseModal}
        close={true}
        >          

        <FormGroup lable={window.__('MAC Address')}>
          <input value={mac_addr||''} onChange={handleChangeModal('mac_addr')}/>
          <div className="tip-err">
          {validator.message('mac_addr', mac_addr, 'required&&mac','',{
              default: window.__('MAC Address Field Required!'),
              mac: window.__('Valid Format Is XX:XX:XX:XX:XX:XX!')
          })}</div>  
        </FormGroup>
        
        <ClientList 
          scanData={scanData} 
          radio_id = {props.radio_id}/>

        <button className='modal-confirm-btn'
          onClick={handleCloseModal}>{window.__('Cancel')}</button>
        <button className='modal-confirm-btn'
          onClick={handleSaveModal}>{window.__('OK')}</button>
      </Modal>   

      <Progress 
        showProgress={showProgress} 
        locktime={locktime}
        handleRedirect={handleRedirect }
        message='Configuring...Please Do Not Shut Down The Device,Completed After '/>

      <div style={{height:68}}></div>
    </div>
  )
}

export default ACLWifi;
