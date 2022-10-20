/**
 * Created by 14566 on 2016/10/16.
 */
import React from 'react';
import Component1 from './component.js';
import './test.less'
import {menu} from '@/menu'

export default  class NavbarMenu extends React.Component {
  render(){
    return(
      <Component1 node={menu} {...this.props}></Component1>
    )
  }
}