import React, { useState, useEffect } from 'react';
import {FormGroup,PageText,FormButton,Progress} from '@/screens/components';
import {axios,HYID ,posturl,handleRedir} from '@/share';
import {useForceUpdate} from '@/screens/common';
import ReactValidator from '@/share/validator/index.js';
import {message,Select} from 'antd';
const validator = new ReactValidator();
const {Option} = Select;

const AdvanceWifi = function AdvanceWifi(props){
    const [result, setResult] = useState({});
    const [resultSrc, setResultSrc] = useState({});
    const [locktime, setLocktime] = useState(0);
    const [showProgress, setShowProgress] = useState(false);
    const forceUpdate = useForceUpdate();
    let {
        bgprotect_mode,
        beacon,
        dtim,
        rts_thres,
        frag_thres,
        tx_burst,
        tx_preamble,
        wmm,
    } = result;

    const handleSelect = name => value =>{
        setResult({
            ...result,
            [name] : value
        })
        
    }
    const inputNumber = name => e =>{
        //if( !validator.allValid() ){
        //  validator.showMessages();
        //}
        
        setResult({
            ...result,
            [name] : e.target.value
        })
    }
    const handleSave = () =>{
        if(validator.allValid()){
            if(resultSrc.bgprotect_mode === result.bgprotect_mode &&
                Number(resultSrc.beacon) === Number(result.beacon) &&
                Number(resultSrc.dtim) === Number(result.dtim) &&
                Number(resultSrc.rts_thres) === Number(result.rts_thres) &&
                Number(resultSrc.frag_thres) ===  Number(result.frag_thres) &&
                resultSrc.tx_burst ===  result.tx_burst &&
                resultSrc.tx_preamble === result.tx_preamble &&
                resultSrc.wmm === result.wmm 
            ){
                message.success(window.__('Data Up to Date'))
                return false;
            }
            setData();
        }else {
          validator.showMessages();
          forceUpdate();
        }
    }
    
    useEffect(() => {         
        getData();
    },[])

    const getData = () =>{           
        axios.post({
            data:{
                HYID:HYID.get_wireless_adv_cfg,
                wifi_radio:props.radio_id
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
                HYID:HYID.set_wireless_adv_cfg,
                wifi_radio:props.radio_id,
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
    
    const handleRedirect = () =>{
        setLocktime(0);
        setShowProgress(false);
        getData();
    }
    if(!props.wifi_enable){
      return(
        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          margin: '30px'}}
        >{window.__('Wireless is currently off. To use it, please turn on wireless first.')}</div>
      )
    }else  return(
        <div>
            <PageText 
                title={props.radio_id === 0?'2.4G ' + window.__('Advanced Setting')
                :'5.8G '+ window.__('Advanced Setting')}
            />            

            <FormGroup lable={window.__('BG protection Mode')}>
                <Select value={bgprotect_mode}
                    onChange={handleSelect('bgprotect_mode')}
                > 
                    <Option value={0}>{window.__('AUTO')}</Option>
                    <Option value={1}>{window.__('Enable')}</Option>
                    <Option value={2}>{window.__('Disable')}</Option>
                </Select>
            </FormGroup>

            <FormGroup lable={window.__('Beacon Interval')}>
                <input value={beacon} 
                    onChange={inputNumber('beacon')}
                />         
                <div className='tip' >{window.__('Range 20-1024,Default 100')}</div>
                <div className="tip-err">
                    {validator.message('beacon', beacon, 'required&&range:20-1024','',{
                    default: window.__('Range 20-1024,Default 100'),})}
                </div>  
            </FormGroup>
            <FormGroup lable={window.__('DTIM')}>
                <input value={dtim}    
                    onChange={inputNumber('dtim')}
                /> 
                <div className='tip' >{window.__('Range 1-255,Default 1')}</div>
                <div className="tip-err">
                    {validator.message('dtim', dtim, 'required&&range:1-255','',{
                    default: window.__('Range 1-255,Default 1'),})}
                </div>  
            </FormGroup>
            <FormGroup lable={window.__('RTS Threshold')}>
                <input value={rts_thres}
                    onChange={inputNumber('rts_thres')}
                />         
                <div className='tip' >{window.__('Range 1-2347,Default 2347')}</div>
                <div className="tip-err">
                    {validator.message('rts_thres', rts_thres, 'required&&range:1-2347','',{
                    default: window.__('Range 1-2347,Default 2347'),})}
                </div>  
            </FormGroup>
            <FormGroup lable={window.__('Fragment Threshold')}>
                <input value={frag_thres}
                    onChange={inputNumber('frag_thres')}
                />         
                <div className='tip' >{window.__('Range 256-2346,Default 2346')}</div>
                <div className="tip-err">
                    {validator.message('frag_thres', frag_thres, 'required&&range:256-2346','',{
                    default: window.__('Range 256-2346,Default 2346'),})}
                </div>  
            </FormGroup>
            <FormGroup lable={window.__('TX Burst')}>
                <Select value={tx_burst}
                    onChange={handleSelect('tx_burst')}
                > 
                    <Option value={0}>{window.__('Disable')}</Option>
                    <Option value={1}>{window.__('Enable')}</Option>
                </Select>
            </FormGroup>

            <FormGroup lable={window.__('Preamble Type')}>
                <Select value={tx_preamble}
                    onChange={handleSelect('tx_preamble')}
                > 
                    <Option value={0}>{window.__('Long Preamble')}</Option>
                    <Option value={1}>{window.__('Short Preamble')}</Option>
                    <Option value={2}>{window.__('AUTO')}</Option>
                </Select>
            </FormGroup>

            <FormGroup lable={window.__('Wi-Fi WMM')}>
                <Select value={wmm}
                    onChange={handleSelect('wmm')}
                > 
                    <Option value={0}>{window.__('Disable')}</Option>
                    <Option value={1}>{window.__('Enable')}</Option>
                </Select>
            </FormGroup>

            <FormButton onClick={handleSave}>
                {window.__('Apply')}
            </FormButton>
       
    
            <Progress 
                showProgress={showProgress} 
                locktime={locktime}
                handleRedirect={handleRedirect }
                message='Configuring...Please Do Not Shut Down The Device,Completed After '/>
    

            <div style={{height:68}}></div>

        </div>
    )
}

export default AdvanceWifi;
