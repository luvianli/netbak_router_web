import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom'
import './index.less'
import { actionCreater } from '@/screens/Login/store';
import { connect } from 'react-redux';

const SubMenu = Menu.SubMenu;

class NavMobile extends Component {
    state = {
        openMainKey: ['/Home'],
        style: {
            minHeight: document.documentElement.clientHeight - 76 - 56 - 50,
        },
        selectKey: "",
        openSecondKey: "",
        openThirdKey: "",
        openForthKey: "",
    }

    componentDidMount() {
        this.selectKey = (window.location.hash.length > 0 ? window.location.hash.substring(1) : "")
        let openMainKey = ""
        let openSecondKey = ""
        let openThirdKey = ""
        let openForthKey = ""
        openMainKey = `${this.selectKey.split('/')[1]}`
        openSecondKey = `${this.selectKey.split('/')[1]}/${this.selectKey.split('/')[2]}`
        openThirdKey = `${this.selectKey.split('/')[1]}/${this.selectKey.split('/')[2]}/${this.selectKey.split('/')[3]}`
        openForthKey = `${this.selectKey.split('/')[1]}/${this.selectKey.split('/')[2]}/${this.selectKey.split('/')[3]}/${this.selectKey.split('/')[4]}`
        this.setState({
            openMainKey: '/' + openMainKey,
            openSecondKey: '/' + openSecondKey,
            openThirdKey: '/' + openThirdKey,
            openForthKey: '/' + openForthKey,
        })
    }
    watchChangeSize = () => {
        let offsetHeight = document.documentElement.clientHeight;
        let style = { ...this.state.style }
        style.minHeight = offsetHeight - 76 - 56 - 50;
        this.setState({
            style
        })
    }
    handleMainMenu = (item) => {
        this.setState({
            openMainKey: item.key
        })
        if (item.children && item.children.length > 0) {
            return
        } else {
            window.location.hash = item.key;
            this.props.onClose()
        }
    }
    handleSubmenus = (item) => {
        this.setState({ openSecondKey: item.key })
        if (item.children && item.children.length > 0) {
            return
        } else {
            window.location.hash = item.key;
            this.props.onClose()
        }
    }
    renderSubMenu = (data) => {
        const { openSecondKey } = this.state
        return data.map((item, index) => {
            return (
                <div onClick={() => { this.handleSubmenus(item) }} key={item.key} className="li-sub-content">
                    <div className="menu-li">
                        <span className={openSecondKey == item.key ? 'active bar-menu' : 'bar-menu'}>{window.__(item.title)}</span>
                        {item.children &&
                            <span className="arrow-right">
                                {openSecondKey == item.key ?
                                    <Icon type="down" />
                                    :
                                    <Icon type="right" />
                                }
                            </span>
                        }
                    </div>
                    {item.children && openSecondKey == item.key && this.renderThirdMenu(item.children)}
                </div>
            )
        })
    }
    handleThirdMenus = (item) => {
        this.setState({ openThirdKey: item.key })
        if (item.children && item.children.length > 0) {
            return
        } else {
            window.location.hash = item.key;
            this.props.onClose()
        }
    }
    renderThirdMenu = (data) => {
        const { openThirdKey } = this.state
        return data.map((item, index) => {
            return (
                <div onClick={() => { this.handleThirdMenus(item) }} key={item.key} className="li-sub-content">
                    <div className="menu-li">
                        <div className={openThirdKey == item.key ? "point-to point-display" : "point-to"} />
                        <span className={openThirdKey == item.key ? 'active bar-menu' : 'bar-menu'}>{window.__(item.title)}</span>
                        {item.children &&
                            <span className="arrow-right">
                                {openThirdKey == item.key ?
                                    <Icon type="down" />
                                    :
                                    <Icon type="right" />
                                }
                            </span>
                        }
                    </div>
                    {item.children && openThirdKey == item.key && this.renderForthMenu(item.children)}
                </div>
            )
        })
    }
    renderForthMenu = (data) => {
        const { openForthKey } = this.state
        return data.map((item, index) => {
            return (
                <div className="third-li" onClick={() => { this.handleForthMenus(item) }} key={item.key}>
                    <div className={openForthKey == item.key ? "point-to point-display" : "point-to"} />
                    <Link className={openForthKey == item.key ? 'active bar-menu' : 'bar-menu'}
                        key={`bar${index}`}
                        to={item.key}>{window.__(item.title)}</Link>
                </div>
            )
        })
    }
    handleForthMenus = (item) => {
        this.setState({ openForthKey: item.key })
        window.location.hash = item.key;
        this.props.onClose()
    }
    render() {
        let isActive = false;
        let thisIndex = 0
        let pathname = window.location.hash;
        const { menu, prdy } = this.props;
        const { openMainKey } = this.state
        return (
            <div>
                <div className='navbar-menu-mobile navbar-bg-mobile'>
                    <nav className='nav-mobile'>
                        {menu.map((item, index) => {
                            isActive = pathname.indexOf(`#${item.key}`) === 0
                            thisIndex = isActive ? index : thisIndex
                            return (
                                <div key={index}>
                                    <div className="menu-li" onClick={() => this.handleMainMenu(item)}>
                                        <span className={openMainKey == item.key ? 'active bar-menu' : 'bar-menu'}>{window.__(item.title)}</span>
                                        {item.children &&
                                            <span className="arrow-right">
                                                {openMainKey == item.key ?
                                                    <Icon type="down" />
                                                    :
                                                    <Icon type="right" />
                                                }
                                            </span>
                                        }
                                    </div>
                                    {item.children && openMainKey == item.key ?
                                        (this.renderSubMenu(item.children))
                                        : null
                                    }
                                </div>
                            )
                        })}
                        {this.props.children}
                    </nav>
                </div>
            </div>
        )
    }
}

export default NavMobile