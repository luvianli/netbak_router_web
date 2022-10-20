import React from 'react';
import {Content} from '@/screens/components/Base';
import {HYID} from '@/share';
import AP from '@/screens/MainRouter/screens/SysMode/dul-wifi/ap_fun_src'
import '../index.less';

export default function Wifi(){
  
  return (
    <Content
      className="base-wifi-bg base-theme"
      title={window.__('Wireless Setting')}>
        <AP        
          HYID_get={HYID.get_system_mode}
          HYID_set={HYID.set_basic_wifi}
          opmode = {undefined}  //用于下法数据的opmode
          src_opmode = {undefined} //用来判断当前是否要判断数据是否修改
        />

    </Content>
  );
}

