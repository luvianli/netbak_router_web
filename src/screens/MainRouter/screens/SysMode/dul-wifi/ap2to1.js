import React, { Component } from 'react';
import {HYID} from '@/share';
import AP from './ap_fun';
//此文件用于系统模式调用 ， 基础模式调用 ./ap_fun.js
class BaseLan extends Component {
  render(){
    return (
      <AP 
        HYID_get={HYID.get_system_mode}
        HYID_set={HYID.set_sysmode_D3}
        opmode = {1}
        src_opmode = {this.props.src_opmode} //用来判断当前模式和AP模式是否相同
        domainName={this.props.domainName}
      />
    );
  }
}

export default BaseLan;
