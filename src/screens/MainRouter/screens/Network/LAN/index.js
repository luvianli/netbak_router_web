import React,{Component} from 'react';
import {PageText} from '@/screens/components';
import LAN from './lan'

export default class LANRouter extends Component {

  render(){
    return (
      <div>
        <PageText 
          title={window.__('LAN Setting')}/>

        <LAN/>

      </div>
    );
  }
}
