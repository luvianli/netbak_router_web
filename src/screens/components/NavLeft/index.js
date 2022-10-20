import React from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom'
import './nav.less'

export default class NavLeft extends React.Component{
    state = {
        openMainKey: ['/Home'],
        style: {
            // minHeight: document.documentElement.clientHeight - 76 - 56 - 50,//76是一级菜单的高度,50是footer的高度，56是header的高度
						minHeight: document.documentElement.clientHeight - 76 - 90,//76是一级菜单的高度,90是header的高度
        },
        selectKey: "",
        openSecondKey: "",
        openThirdKey: "",
        openForthKey: "",
    }
    componentDidMount(){
        window.addEventListener('resize', this.watchChangeSize)
        this.watchChangeSize();
        this.selectKey = (window.location.hash.length > 0 ? window.location.hash.substring(1) : "")
        let openSecondKey,secondKey,openThirdKey,thirdKey,openForthKey
        openSecondKey = `${this.selectKey.split('/')[1]}/${this.selectKey.split('/')[2]}`
        openThirdKey = `${this.selectKey.split('/')[1]}/${this.selectKey.split('/')[2]}/${this.selectKey.split('/')[3]}`
        openForthKey = `${this.selectKey.split('/')[1]}/${this.selectKey.split('/')[2]}/${this.selectKey.split('/')[3]}/${this.selectKey.split('/')[4]}`
        this.setState({
            openSecondKey: '/' + openSecondKey,
            secondKey: '/' + openSecondKey,
            openThirdKey: '/' + openThirdKey,
            thirdKey: '/' + openThirdKey,
            openForthKey: '/' + openForthKey,
        })
    }
      watchChangeSize=()=>{
        let offsetHeight = document.documentElement.clientHeight;
        let style ={ ...this.state.style}
        style.minHeight = offsetHeight- 76 - 90;
        this.setState({
          style
        })
      }
    componentWillMount(){
        this.selectKey = (window.location.hash.length > 0 ? window.location.hash.substring(1) : "")
        // this.openKeys = `${this.selectKey.split('/')[1]}/${this.selectKey.split('/')[2]}`
        // this.setState({
        //     openKeys:['/'+this.openKeys]
        // })
        window.removeEventListener('resize', this.watchChangeSize)
    } 
    handleSubmenu=(key)=>{
      this.selectKey = key
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
            openSecondKey:'/Advanced/SysStatus',
            secondKey: '/Advanced/SysStatus',
            // openKeys:item.children?[item.children[0].key]:[]
        })
    }
    handleSubmenus = (item) => {
        if(item.key === this.state.secondKey){
            this.setState({secondKey: "", thirdKey: ""})
        }else{
            this.setState({ openSecondKey: item.key, secondKey: item.key })
            if (item.children && item.children.length > 0) {
                if(item.key===this.state.openSecondKey){
                    return
                }else{
                    this.setState({ openThirdKey: item.children[0].key, thirdKey: item.children[0].key})
                    if(item.children[0].children&&item.children[0].children.length > 0){
                        this.setState({ openForthKey: item.children[0].children[0].key})
                        window.location.hash = item.children[0].children[0].key;
                    }else{
                        window.location.hash = item.children[0].key;
                    }
                }
            } else {
                window.location.hash = item.key;
            }
        }
    }
    renderThirdMenu = (data) => {
        const { openThirdKey,thirdKey } = this.state
        return data.map((item, index) => {
            return (
                <div onClick={(e) => { this.handleThirdMenus(e,item) }} key={item.key} className="li-sub-content">
                    <div className={item.children||openThirdKey !== item.key?"menu-li": "menu-li li-active"}>
                        <div className={openThirdKey == item.key ? "point-to point-display" : "point-to"} />
                        <span className={openThirdKey == item.key ? 'active bar-menu' : 'bar-menu'}>{window.__(item.title)}</span>
                        {item.children &&
                            <span className="arrow-right">
                                {thirdKey == item.key ?
                                    <Icon type="down"/>
                                    :
                                    <Icon type="right"/>
                                }
                            </span>
                        }
                    </div>
                    {item.children && thirdKey == item.key && this.renderForthMenu(item.children)}
                </div>
            )
        })
    }
    handleThirdMenus = (e,item) => {
        if ( e && e.stopPropagation ) {
            //因此它支持W3C的stopPropagation()方法 
            e.stopPropagation(); }
        else {
            //否则，我们需要使用IE的方式来取消事件冒泡 
            window.event.cancelBubble = true; 
        }
        if(item.key===this.state.thirdKey){
            this.setState({thirdKey: ""})
        }else{
            this.setState({ openThirdKey: item.key, thirdKey: item.key})
            if (item.children && item.children.length > 0) {
                if(item.key===this.state.openThirdKey){
                    return
                }else{
                    this.setState({openForthKey: item.children[0].key})
                    window.location.hash = item.children[0].key;
                }
            } else {
                window.location.hash = item.key;
            }
        }
    }
    renderForthMenu = (data) => {
        return data.map((item, index) => {
            return (
                 <div onClick={(e) => { this.handleForthMenus(e,item)}} key={item.key} className="li-sub-content">
                 <div className={this.state.openForthKey !== item.key?"menu-li": "menu-li li-active"}>
                    <div className={this.state.openForthKey == item.key ? "point-to point-display" : "point-to"} />
                    <span className={this.state.openForthKey == item.key ? 'active bar-menu' : 'bar-menu'}>{window.__(item.title)}</span>
                 </div>
             </div>
            )
        })
    }
    handleForthMenus = (e,item) => {
        if ( e && e.stopPropagation ) {
            //因此它支持W3C的stopPropagation()方法 
            e.stopPropagation(); }
        else {
            //否则，我们需要使用IE的方式来取消事件冒泡 
            window.event.cancelBubble = true; 
        }
        this.setState({ openForthKey: item.key })
        window.location.hash = item.key;
    }
    render(){
        let isActive = false;
        let thisIndex = 0
        let pathname = window.location.hash;
        const { menu, prdy } = this.props;
        const { openSecondKey,secondKey } = this.state
        return(
        <div className='adv_bg'> 
            <div className='navbar-menu navbar-bg'>
                <nav className='nav'>
                    {menu.map((item,index)=>{
                        isActive = pathname.indexOf(`#${item.key}`) === 0  
                        thisIndex = isActive?index:thisIndex
                        return (
                            <div className='nav_div'>
                        <Link onClick={()=>this.handleMainMenu(item)} className={isActive?'active bar-menu':'bar-menu'}
                        key={`bar${index}`} 
                        to={item.children?item.children[0].children?item.children[0].children[0].key:item.children[0].key:item.key}>{window.__(item.title)}</Link>
                        </div>)
                    })}
                </nav>
            </div>
    
            {menu[thisIndex].children?
                <div className='fram_test'>
                    <div className='fram-content'>
                        <div className='fram-navleft fram-navleft-bg'>
                            <nav className='nav-left'>
                                {menu[thisIndex].children.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <div className={item.children||openSecondKey !== item.key?"menu-li": "menu-li li-active"} onClick={() => this.handleSubmenus(item)}>
                                                <span className={openSecondKey == item.key ? 'active bar-menu' : 'bar-menu'}>{window.__(item.title)}</span>
                                                {item.children ?
                                                    <span className="arrow-right">
                                                        {secondKey == item.key ?
                                                            <Icon type="down" />
                                                            :
                                                            <Icon type="right" />
                                                        }
                                                    </span>
                                                    :<span style={{display:'inline-block',width: '22px'}}></span>
                                                }
                                            </div>
                                            {item.children && secondKey == item.key &&
                                                (this.renderThirdMenu(item.children))
                                            }
                                        </div>
                                    )
                                })}
                            </nav>
                        </div>
                        
                        <div className='page-content'>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            :
            <div className='fram_test'>
                <div className={this.props.isHome?'fram-content fram-no-border':'fram-content'}>
                    {/* <div className='main-content' style={this.state.style}>  */}
                    <div className='main-content'> 
                        {this.props.children}
                    </div>
                </div>
            </div>}
        </div>
        )
    }
}