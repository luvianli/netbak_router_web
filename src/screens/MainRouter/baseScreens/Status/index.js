import React from 'react';
import {Content} from '@/screens/components/Base';
import Status from './status'
import '../index.less';

export default function BaseStatus(){
  
  return (
    <Content
      className="base-status-bg base-theme"
      title={window.__('System Status')}>
        <Status/>

    </Content>
  );
}

