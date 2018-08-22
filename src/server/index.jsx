import React from 'react';
import { render } from 'react-dom';

import Header from './components/header';

const userInfo = window.userData;

render(
  <div><Header userInfo={userInfo} /></div>,
  document.getElementById('page'),
)
