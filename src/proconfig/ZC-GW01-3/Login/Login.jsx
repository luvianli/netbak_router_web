import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './login.less';

const Login = function Login(props) {
  const {
    winHight,
    clickLogin,
    onInputKeyUp
  } = props;

  const [password, setPassword] = useState('');

  return (
    <div className='login_win' style={{ minHeight: winHight }}>
      <div className='login-border'>
        <div className='login-content'>
          <div className='content'>
            <div className='login_image'></div>
            <div className='login_title'>{window.__('Router Login Password')}</div>

            <input
              className='login-input'
              type='password'
              value={password}
              placeholder={window.__('Please Enter Your Password')}
              onChange={e => setPassword(e.target.value)}
              onKeyUp={(e) => onInputKeyUp(e, password)}
            />

            <button
              className='login-button'
              onClick={() => clickLogin(password)}
            >{window.__('Login')}
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

Login.propTypes = {
  winHight: PropTypes.number.isRequired,
  clickLogin: PropTypes.func.isRequired,
  onInputKeyUp: PropTypes.func.isRequired,
};

export default Login;