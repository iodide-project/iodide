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
    <div style={{ width: '1000px', margin: 'auto' }}>
      <h1>Latest Iodide Notebooks</h1>
      <NotebookList notebookList={notebookList} />
    </div>
  </div>
) : <LoginPanel />

render(content, document.getElementById('page'))
