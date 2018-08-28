import React from 'react';
import { render } from 'react-dom';

import Header from './components/header';
import NotebookList from './components/notebook-list';

const { userInfo, notebookList } = window;

render(
  <div>
    <Header userInfo={userInfo} />
    <NotebookList notebookList={notebookList} />
  </div>,
  document.getElementById('page'),
)
