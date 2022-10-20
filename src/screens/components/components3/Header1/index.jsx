import React from 'react';
import PropTypes from 'prop-types';
import Logout from '@/screens/common/Logout';
import './index.less';

const propTypes = {
  logo:PropTypes.string,
  baseBtnClick:PropTypes.func,
  showButton:PropTypes.bool,
};

const defaultProps = {
  showButton:false,
  baseBtnClick:function(){return;}
};

function Navbar(props) {
  const { logo } = props;
  return (
    <header className={'header1'}>
      <div  className="logo-img">
        {logo && <img alt="logo" className="brand" src={logo} />}
      </div>

      {props.nobar===true?null:        
        <div className="bar-right">
          <div className='bar-button'>
            <button onClick={()=>props.baseBtnClick('base')}>{window.__('Basic')}</button>
            <button onClick={()=>props.baseBtnClick('adv')}>{window.__('Advanced')}</button>
          </div>

          <div className='bar-icon'>
            <Logout/>
          </div>        
        </div>
      }
    </header>
  );
}

Navbar.propTypes = propTypes;
Navbar.defaultProps = defaultProps;

export default Navbar;
