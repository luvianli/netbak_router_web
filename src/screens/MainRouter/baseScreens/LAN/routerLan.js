

import React from 'react';
import {Content} from '@/screens/components/Base';
import  LANRouter from '@/screens/MainRouter/screens/Network/LAN/lan.js';
import '../index.less';

export default function Lan(){
  
  return (
    <Content      
      className="base-lan-bg base-theme"
      title={window.__('LAN Setting')}>
      <LANRouter/>

    </Content>
  );
}

