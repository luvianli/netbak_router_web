import React from 'react';
import {HYID} from '@/share';
import {Content} from '@/screens/components/Base';
import Router from '@/screens/MainRouter/screens/SysMode/dul-wifi/router'
import '../index.less';

export default function Sysmode(){
  
  return (
    <Content
      className="base-sysmode-bg base-theme" 
      title={window.__('Router Mode')}>
        <Router
          HYID_get={HYID.get_system_mode}
          HYID_set={HYID.set_sysmode_D3}
          opmode = {1} //基础设置的AP模式 ，opmode = 1,
          src_opmode = { undefined} //此参数用于判断数据是否修改，基础设置页不需要判断是否修改
        />

    </Content>
  );
}

