import React from 'react';
import { Menu, Icon } from 'antd';
import { NavLink ,Link} from 'react-router-dom'
//import {menu} from '@/menu'
const SubMenu = Menu.SubMenu;

export default class NavLeft extends React.Component{

    componentDidMount(){
        window.addEventListener('resize', this.watchChangeSize)
        this.watchChangeSize();
      }
      watchChangeSize=()=>{
        let offsetHeight = document.documentElement.clientHeight;
        let style ={ ...this.state.style}
        style.minHeight = offsetHeight-182;
        this.setState({
          style
        })
      }
    componentWillMount(){
        this.selectKey = (window.location.hash.length > 0 ? window.location.hash.substring(1) : "")
        this.openKeys = `${this.selectKey.split('/')[1]}/${this.selectKey.split('/')[2]}`
        this.setState({
            openKeys:['/'+this.openKeys]
        })
        window.removeEventListener('resize', this.watchChangeSize)
    }
    
    state = {
        openKeys: ['/Home'],
        style:{            
          minHeight:document.documentElement.clientHeight-182,
        }    
    }
    
  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find((key) => {
        return this.state.openKeys.indexOf(key) === -1
    });
    
    this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
    });

  }
  handleSubmenu=(key)=>{
      this.selectKey = key
  }
    //菜单渲染   data就是menu.js的菜单列表
    renderMenu=(data)=>{
        return data.map((item)=>{
            if(item.children){//如果有子菜单
                return(
                    <SubMenu key={item.key} title={window.__(item.title)}>
                        {this.renderMenu(item.children)}
                    </SubMenu>
                )
            }
            return (                
                <Menu.Item onClick={()=>this.handleSubmenu(item.key)} key={item.key}>
                <NavLink to={item.key}>{window.__(item.title)}</NavLink>
                </Menu.Item>
            )
        })
    }
    handleMainMenu=(item)=>{        
        if(item.children){            
            if(item.children[0].children){
                this.selectKey = (item.children[0].children[0].key)
            }else{           
                this.selectKey = (item.children[0].key)
            }
        }
        this.setState({
            openKeys:item.children?[item.children[0].key]:[]
        })
    }
    render(){
        let isActive = false;
        let thisIndex = 0
        let pathname =window.location.hash;
        const { menu } = this.props;
        return(
        <div> 
            <div className='navbar-menu navbar-bg'>
                <nav className='nav'>
                    {menu.map((item,index)=>{
                        isActive = pathname.indexOf(`#${item.key}`) === 0  
                        thisIndex = isActive?index:thisIndex
                        return (
                        <Link onClick={()=>this.handleMainMenu(item)} className={isActive?'active bar-menu':'bar-menu'}
                        key={`bar${index}`} 
                        to={item.children?item.children[0].children?item.children[0].children[0].key:item.children[0].key:item.key}>{window.__(item.title)}</Link>)
                    })}
                </nav>
            </div>
    
            {menu[thisIndex].children?
            <div className='fram_test'>
            <div className='fram-content'>
                <div className='fram-navleft fram-navleft-bg' style={this.state.style}>    
                    <Menu
                        theme="white"
                        /*mode="inline"*/
                        /*mode="vertical"*/
                        defaultSelectedKeys={[this.selectKey]}
                        selectedKeys={[this.selectKey]}
                        mode="inline"
                        openKeys={this.state.openKeys}
                        onOpenChange={this.onOpenChange}
                    >                
                        { this.renderMenu(menu[thisIndex].children) }
                    </Menu>                    
                </div>
                
                <div className='page-content'  style={this.state.style}>
                    {this.props.children}
                </div>
            </div>
            </div>:
            <div className='fram_test'>
                <div className='fram-content'>
                    <div className='main-content' style={this.state.style}> 
                        {this.props.children}
                    </div>
                </div>
            </div>}
            </div>
        )
    }
}