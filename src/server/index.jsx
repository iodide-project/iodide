import React from 'react';
import { render } from 'react-dom';

import Header from './components/header';
import LoginPanel from './components/login-panel';
import NotebookList from './components/notebook-list';

const { location, userInfo, notebookList } = window;
const path = location.pathname.replace(/^\/|\/$/g, '');

const content = (path === '') ? (
  <div>
    <Header userInfo={userInfo} />
    <NotebookList notebookList={notebookList} />
  </div>
) : <LoginPanel />

render(content, document.getElementById('page'))
