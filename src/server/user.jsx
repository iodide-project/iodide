import React from 'react';
import { render } from 'react-dom';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add'
import Header from './components/header';

const { userInfo, thisUser, notebookList } = window;

render(
  <div>
    <Header userInfo={userInfo} />
    <div style={{
        marginLeft: '30px',
        marginTop: 35,
    }}
    >
      <div style={{ marginBottom: 0 }}>
        <img style={{ borderRadius: '5px' }} width={150} src={thisUser.avatar} alt={`${thisUser.name}'s avatar`} />
        <h1 style={{
            marginTop: 20, marginBottom: 0, fontWeight: 900, textTransform: 'uppercase',
            }}
        >{thisUser.full_name}
        </h1>
        <h2 style={{ fontWeight: 300, marginTop: 0 }}>{thisUser.name}</h2>
      </div>
      <h2>notebooks</h2>
      <Button
        variant="contained"
        size="small"
        className="header-button"
        href="/new"
      >
        <AddIcon style={{ fontSize: 15, marginTop: -2 }} />
        New notebook
      </Button>
      <table style={{ marginTop: '20px' }} >
        <tbody>
          {notebookList.map(notebook => (
            <tr key={notebook.id}>
              <td style={{ width: 200 }}><a href={`/notebooks/${notebook.id}/`}>{notebook.title}</a></td>
              <td>{notebook.last_revision.slice(0, 19)}</td>
            </tr>
    ))}
        </tbody>
      </table>
    </div>
  </div>,
  document.getElementById('page'),
)
