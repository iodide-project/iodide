import React from 'react';
import { render } from 'react-dom';

import Header from './components/header';

const { userInfo, notebookList } = window;

render(
  <div>
    <Header userInfo={userInfo} />
    <div style={{
        marginLeft: '30px',
    }}
    >
      <h1>{userInfo.name}s notebooks</h1>
      <table >
        {notebookList.map(notebook => <tr><td><a href={`/notebooks/${notebook.id}/`}>{notebook.title}</a></td></tr>)}
      </table>
    </div>
  </div>,
  document.getElementById('page'),
)
