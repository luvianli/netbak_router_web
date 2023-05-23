import React, { Component } from 'react';
import BaseWifi from '../BaseWifi_src'

class Base5G extends Component {
    render() {   
      return (
        <BaseWifi radio_id={1}/>
    );
  }
}

export default Base5G;