import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom'
import './index.less';

const propTypes = {    
  menus: PropTypes.array.isRequired,
};

const defaultProps = {
    menus: [],
};
/**全局变量，点击时切换，用于排列二级菜单(页面刷新有也有效) */
let activeIndex = 0;

class Nav extends Component {    
  state={
  }

  handleTab1Click = (type,item) => {
        this.setState({
            activeType_1: type,
            activeType_2: 0
        })    
  }
  handleTab2Click = (type) => {
      this.setState({
          activeType_2: type
      })
    }
  
renderMenu=(menus)=>{
    return( 
        <nav className="t-main__nav o-nav">
          <ul className="m-menu m-menu--open">
          {
            menus.map((item,index)=>{
                let path = item.key;
                let isActive = false;
                let linkClassName = 'm-menu__link o-nav__link';
                let pathname =window.location.hash;
                isActive = pathname.indexOf(`#${path}`) === 0                
                if (isActive) {
                    linkClassName = `${linkClassName} active`;
                    activeIndex = index;
                }
                /**用于点击一级菜单时，二级菜单默认开启第一个页面内容 */
                if(item.children){
                  path = item.children[0].key;
                }
                return (            
                    <li
                    key={index}
                    onClick={()=>this.handleTab1Click(index,item)}
                    >
                    <NavLink  
                        className={linkClassName}
                        to={path} index={index}><span className="iconfont" style={{fontSize: '15px'}} 
                          dangerouslySetInnerHTML={{ __html: item.icon }}></span> {item.title}</NavLink></li>            
                )
            })
          }
          </ul>
        </nav>
    )
  }
  
renderMenuChild=(menus)=>{
    let {activeType_2} = this.state;
    if(menus[activeIndex] && menus[activeIndex].children){//如果有子菜单
      return (
        <ul className="o-tab__nav">
        {
          menus[activeIndex].children.map((item,index)=>{
            return (          
              <li 
                key={100+index}
                onClick={()=>this.handleTab2Click(index)}>
                <NavLink className={index===activeType_2?"active":""}  to={item.key} index={index}>{item.title}</NavLink></li>                  
            )
          })
        }    
        </ul>)
      }
    }

    render() {
    const { menus } = this.props;
    
  return (
    <div className="t-main main--open clearfix">
              {this.renderMenu(menus)}
      <div className="t-main__content">
        <div className="o-tab">
        {this.renderMenuChild(menus)}
        <div className="o-tab__content">
            {this.props.children}
        </div>
        </div>
      </div>
    </div>
  );
}
}
Nav.propTypes = propTypes;
Nav.defaultProps = defaultProps;

export default Nav;
