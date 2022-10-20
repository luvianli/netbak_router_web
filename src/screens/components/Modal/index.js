import React from 'react'
import PropTypes from 'prop-types';
import './modal.less'

function Modal(props) {
    const { title, closeModel ,visible,close} = props
    return (
        <div className='my-madal'>
            {visible?                
            <div className="modal dialog" >
                <div className={`modal-content`} 
                style={props.style}>
                {close?<div className="close"  onClick={closeModel}>X</div>:null}
                {title?<div className="title">{title}</div>:null}
                    {props.children}
                </div>
            </div>:null
            }
        </div>
    )
}

Modal.propTypes = {
    title: PropTypes.string,
    close:PropTypes.bool,/**显示右边的关闭按键（现在没有实现关闭功能） */
    visible:PropTypes.bool,/**用于控制样式，显示、隐藏模态框 */
  
  };
  
Modal.defaultProps = {
    title: '',
    close:false,/**显示右边的关闭按键（现在没有实现关闭功能） */
    visible:false,/**用于控制样式，显示、隐藏模态框 */
    closeModel:function(){return;}
  
  };
export default Modal