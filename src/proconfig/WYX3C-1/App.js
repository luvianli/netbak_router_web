import React, { Component } from 'react';
import {Provider} from 'react-redux'
import store from '@/screens/MainRouter/store';
import FrameRouter from './FrameRouter'
import {getCookie,setCookie,clearCookie} from '@/share/cookies';

document.title='';

class App extends Component {
  render() {

    const cookie_value = getCookie('PSW');
    setCookie('PSW',cookie_value)

    return (
      <Provider store={store}>
        <FrameRouter/>
      </Provider>
    );
  }
}

export default App;
