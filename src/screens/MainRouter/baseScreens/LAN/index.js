import React from 'react';
import {Content} from '@/screens/components/Base';
import  LANAP from '@/screens/MainAP/LAN2/lan';
import '../index.less';

export default function Lan(){
  
  return (
    <Content      
      className="base-lan-bg base-theme"
      title={window.__('LAN Setting')}>
        <LANAP/>

    </Content>
  );
}

