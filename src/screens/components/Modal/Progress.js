import React, { Component } from 'react'
import Modal from './index'
import PropTypes from 'prop-types';
import './modal.less'

class Progress extends Component {
    state = {
        visible: false,
        completed: 0,
        currentime:''
      };
      
      componentWillUnmount() {
        clearInterval(this.timer);
      }
      componentDidMount(){        
        if (this.props.showProgress===true) {
          this.handleOpen();
        }
      }
      componentWillReceiveProps(nextProps) {
        this.setState({currentime:nextProps.locktime})
        if (nextProps.showProgress===true) {
          this.handleOpen();
        }
      } 
      handleClose = () => {
        this.setState({ visible: false ,completed:0,currentime:''});
      };
      
      handleOpen = () => {
        let locktime = 0  
        let n = 0,currentime = 0
        this.timer = setInterval(()=>{
          const { completed } = this.state;
          locktime = this.props.locktime  
          currentime=locktime-n
          n=n+1 
          if (completed === 100) {
            this.handleClose()
            clearInterval(this.timer);
            //进行重启完清楚登陆信息、跳转到登陆/其他IP，不清除登陆信息，回到当前页面处理 
            this.props.handleRedirect()
          } else {
            const diff = 100/locktime
            this.setState({currentime:currentime, completed: Math.min(completed + diff, 100) });
          }
        }, 1000);
        this.setState({ visible: true });
      };
    render() {
      const message = this.props.message
      const progressBar={
        width:`${this.state.completed}%`
      }  
      return (
        <div className="progress">{this.state.currentime!==0?
        <Modal        
        style={{width:500,height:150,margin:'auto',paddingTop:40}}
        visible={this.props.showProgress}
        > 
            {window.__(message?message:'Remaining ')}{this.state.currentime}s...
            <div className="div-progress">  
                <div  style={progressBar} className="progress-bar"></div>  
                <div style={{position:'absolute',right:'8px'}}>{parseInt(this.state.completed)}%</div>
            </div>  
        </Modal>:null}</div>
      )
    }
}

Progress.propTypes = {
    showProgress: PropTypes.bool.isRequired,
    locktime:PropTypes.number.isRequired,
    //handleRedirect:PropTypes.func.isRequired,
    message:PropTypes.string
  };  
 
Progress.defaultProps = {
  showProgress:false,
  handleRedirect:function(){return;}
};

export default Progress