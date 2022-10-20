import React, {Component, useEffect,} from 'react';
import {Header4G, Footer, HeaderMobile, Modal, NavMobile} from '@/screens/components';
import logo_img from '@/logo.png';
import NavLeft from '@/screens/components/NavLeft';
import menu from './menuconfig';
import './frame.less';
import { Drawer, Select, Spin } from 'antd';
import { connect } from 'react-redux';
import {actionCreater } from '../../store';
import Logout from '@/screens/common/Logout';
import Reboot from '@/screens/common/Reboot'

const { Option } = Select;
const local_support_language = {
  "cn":"简体中文", 
  "en":"English"
}

function renderLanguage (support_language){
  if(support_language===undefined) return;
  return support_language.map((item,index)=>{
    return(
      <Option key={index} value={item}>{local_support_language[item]}</Option>
    )
  })
}
class Frame extends Component {
  constructor(props) {
    super(props);
  }
  state={
    drawerVisible: false,
    selectVisible: false
  }
  componentDidMount(){
      window.addEventListener('resize', this.watchChangeSize)
      this.watchChangeSize();
      
    }
    watchChangeSize=()=>{
      let clientWidth = document.body.clientWidth;
      this.setState({
        clientWidth:clientWidth
      })
    }
  componentWillMount(){
      window.removeEventListener('resize', this.watchChangeSize)
  }
  
  showMenu=()=>{
    this.setState({
      drawerVisible: true,
    })
  }
  onClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };
  handleChange=(value)=>{    
    this.props.setLanguage(value);
    this.setState({selectVisible:true})
    setTimeout(() => {
      this.setState({selectVisible:false})
    }, 3000);
  }
  render(){
    const title = (
      <HeaderMobile isMenu={true} 
      // logo={logo_img}
      ></HeaderMobile>
    )
    const { language } = this.props;
  return(
    <div>
    {
      this.state.clientWidth>768?
        <div className="pc-view">
        <Header4G 
          // logo={logo_img}
        />

          <NavLeft isHome={this.props.isHome} menu={menu.menulist({enable2g:this.props.enable2g,enable5g:this.props.enable5g})}>
            {this.props.children}      
          </NavLeft>  
          {/* <Footer/> */}
        </div>:
        <div className="mobile-view">
          <HeaderMobile isMenu={false} showMenu={this.showMenu} 
            // logo={logo_img}
          >
            <Select value={language} className='language' onChange={this.handleChange}>
              {renderLanguage(['cn','en'])}
            </Select>
            <Modal
              style={{width:450,height:180,marginTop:20}}
              visible={this.state.selectVisible}
              >          
              <div style={{marginTop:40,fontSize:15,textAlign:'center'}}>
                <Spin/><span style={{paddingLeft:10}}>{window.__('Loadding...')}</span> 
              </div>
            </Modal>
          </HeaderMobile>
          <Drawer
            title={title}
            placement="left"
            width={'100%'}
            closable={true}
            onClose={this.onClose}
            visible={this.state.drawerVisible}
            maskClosable={true}
            destroyOnClose={true}
          >
            <NavMobile menu={menu.menulist({enable2g:this.props.enable2g,enable5g:this.props.enable5g})} onClose={this.onClose.bind(this)}>
              <div className="menu-li">
                  <div className='bar-menu logout-li'>{this.props.prdy>1594&&<Logout/>}</div>
              </div>
              <div className="menu-li">
                  <div className='bar-menu logout-li'><Reboot/></div>
              </div>
            </NavMobile>
          </Drawer>
          <div className="page-container">{this.props.children}</div>
      </div> 
      }        
      </div>
    )
  }
}

const mapState = (state)=>({
  
  enable2g:state.getIn(['wirelessBase','enable2g']),
  enable5g:state.getIn(['wirelessBase','enable5g']),
  language:state.getIn(['common','language']),
  support_language:state.getIn(['common','support_language']),
  prdy:state.getIn(['common','prdy']),
  isHome:state.getIn(['common','isHome'])
})

const mapDispatch = (dispatch) =>({
  setLanguage(args){
    dispatch(actionCreater.setLanguage(args))
},
})

export default connect(mapState,mapDispatch)(Frame)

