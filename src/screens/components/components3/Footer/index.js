import React from 'react';
import './index.less';
import {connect} from 'react-redux'

function Footer(props){
  return(
    <div className='footer3'>
        <div className='footer3-content'>
        <ul>
          {
            props.text?
            <li>{props.text}</li>
            :<li dangerouslySetInnerHTML={{__html: props.company_copyright}}></li>
          }
        </ul>
        </div>
    </div>
  )
}

const mapState = (state)=>({
  company_copyright:state.getIn(['common','company_copyright']),
})

export default connect(mapState,null)(Footer)
