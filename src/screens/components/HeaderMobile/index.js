import React, { Component } from 'react'
import logo_img from '@/logo.png'
import './index.less';
import { Icon } from 'antd';

class HeaderMobile extends Component {
  constructor(props) {
    super(props);
  }
  showMenu=()=>{
    this.props.showMenu()
  }

  render(){
    const { isMenu } = this.props;
    return(  
    <header className={isMenu?'header-mobile menu-header':'header-mobile'}>
      {isMenu?null
      :
        <div className="main-menu" onClick={this.showMenu}><Icon type="menu" /></div>
      }
      <div className='logo-center'>
        {this.props.logo&&<img src={logo_img} alt='logo'/>}
      </div>
      {this.props.children}
    </header>
  )}
}


export default HeaderMobile


