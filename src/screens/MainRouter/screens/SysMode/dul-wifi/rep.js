import React, { Component } from 'react';
import Repeater from './repeater'

class REP extends Component {
    render() {   
      return (
        <Repeater opmode={2} {...this.props}/>
    );
  }
}

export default REP;