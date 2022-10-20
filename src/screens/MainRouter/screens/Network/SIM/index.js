import React from 'react';
import {Modal} from '@/screens/components';
import {Spin} from 'antd';
import PropTypes from 'prop-types';

export default class SIM extends React.Component{ 
  
  changeHash=(hash)=>{
    if(hash===''){
      return;
    }
    window.location.hash=hash;
    window.location.reload();
  }
  render() {
    const {module_ready,sim_state,loadingVisble} = this.props;
    return (
          <div>
            
        {
          module_ready===false?          
          <div style={{width:380,margin:'155px auto auto',textAlign:'center'}}>
            <span>{window.__('Module Initialization, Please Try Again Later.')}
            </span>
          </div>:
          <>
          {
            sim_state===0?
            <div style={{width:380,margin:'155px auto auto',textAlign:'center'}}>
              <span>{window.__('Temporarily Unavailable. Please Insert SIM Card And Try Again Later.')}
              </span>
            </div> :
            sim_state===2?//PIN被锁住
            <div style={{width:380,margin:'155px auto auto',textAlign:'center',cursor:'pointer'}}>
              <span>
              {window.__('Temporarily Unavailable. Please ')}
              <a style={{color:'#007DFF'}} onClick={()=>this.changeHash('Advanced/System/PINCode')}>{window.__('Enter PIN Code ')}</a>
              {window.__('To Unlock.')}
              </span>
            </div>              
            :
            sim_state===3?//提示PUK锁住
            <div style={{width:380,margin:'155px auto auto',textAlign:'center'}}>
              <span>{window.__('The PUK Has Been Locked, Please Go To The Business Hall To Unlock.')}
              </span>
            </div>              
            :sim_state===1?<>          
            </>
          :null}
          </>
        }

        <Modal
          style={{width:450,height:200,marginTop:100}}
          visible={this.props.loadingVisble}
          >          
          <div style={{marginTop:60,fontSize:15,textAlign:'center'}}>
            <Spin/><span style={{paddingLeft:10}}>{window.__('Loadding...')}</span> 
          </div>
        </Modal>

        <div style={{height:88}}></div>
          </div>
    )
  }
}

SIM.propTypes = {
  loadingVisble:PropTypes.bool,
  module_ready:PropTypes.bool,
  sim_state:PropTypes.number,
};  

SIM.defaultProps = {
  loadingVisble:true,
  module_ready:false,
  sim_state:0
};