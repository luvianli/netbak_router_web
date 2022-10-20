import React, { Component } from 'react';
import BaseWifi from '../BaseWifi_src'

class Base2G extends Component {
    render() {   
      return (
        <BaseWifi radio_id={0} simple={true}/>
    );
  }
}

export default Base2G;