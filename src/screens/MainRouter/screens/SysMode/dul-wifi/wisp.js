import React, { Component } from 'react';
import Repeater from './repeater'

class WISP extends Component {
    render() {   
      return (
        <Repeater opmode={3} {...this.props}/>
    );
  }
}

export default WISP;