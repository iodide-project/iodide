import React from 'react';
import { render } from 'react-dom';

import Header from './components/header';

const { userInfo, notebookList } = window;

render(
  <div>
    <Header userInfo={userInfo} />
    <div style={{
        marginLeft: '30px',
        marginTop: 35,
    }}
    >
      <div style={{ marginBottom: 0 }}>
        <img style={{ borderRadius: '5px' }} width={150} src={userInfo.avatar} alt={`${userInfo.name}'s avatar`} />
        <h1 style={{
            marginTop: 20, marginBottom: 0, fontWeight: 900, textTransform: 'uppercase',
            }}
        >{userInfo.full_name}
        </h1>
        <h2 style={{ fontWeight: 300, marginTop: 0 }}>{userInfo.name}</h2>
      </div>
      <h2>notebooks</h2>
      <table >
        <tbody>
          {notebookList.map(notebook => (
            <tr key={notebook.id}>
              <td style={{ width: 200 }}><a href={`/notebooks/${notebook.id}/`}>{notebook.title}</a></td>
              <td>{notebook.last_revision}</td>
            </tr>
    ))}
        </tbody>

      </table>
    </div>
  </div>,
  document.getElementById('page'),
)
