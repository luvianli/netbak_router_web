import React, { useEffect } from 'react';

import { Header } from '@/screens/components'
// import { Footer} from '@/screens/components/index3.js'

import logo_img from '@/logo.png';
import Login from './Login/Login.jsx';

function LoginApp(props){
  
  return(
    <div>
      <Header
          // logo = {logo_img}
          nobar = {true}
      />

      <Login />
      
      {/* <Footer/> */}

    </div>
  )
  
}


export default LoginApp

