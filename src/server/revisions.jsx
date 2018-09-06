import React from 'react';
import { render } from 'react-dom';
import Header from './components/header';

const { userInfo, ownerInfo, revisions } = window;

const contentStyle = {
  paddingLeft: '20px',
  paddingTop: '20px',
}

const revisionLabelStyle = {
  fontStyle: 'italic',
  color: 'gray',
  fontWeight: '300',
}

const avatarStyle = {
  borderRadius: '7px',
  marginRight: '15px',
}

const infoTable = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
}

const blockLinkStyle = {
  textDecoration: 'none',
  color: 'black',
}

const revTable = {
  paddingBottom: '40px',
}

const revR = {
  paddingBottom: '5px',
  textAlign: 'left',
}

const revC1 = {
  width: '200px',
}

render(
  <div>
    <Header userInfo={userInfo} />
    <div style={contentStyle}>
      <h2>{ownerInfo.title} <span style={revisionLabelStyle}> / revisions</span></h2>

      <a style={blockLinkStyle} href={`/${ownerInfo.username}`}>
        <div style={infoTable}>
          <img style={avatarStyle} src={ownerInfo.avatar} alt={ownerInfo.username} width={35} />
          <div style={{ fontSize: '14px' }}>
            {ownerInfo.full_name} <i>({ownerInfo.username})</i>
          </div>
        </div>
      </a>
      <h3>Revisions</h3>
      <table style={revTable}>
        <tbody>
          <tr style={revR}>
            <th>When</th>
            <th>Title</th>
          </tr>
          {
                revisions.map((r, i) => {
                    let theTitle
                    if (i > 0 && revisions[i].title === revisions[i - 1].title) {
                        theTitle = '-'
                    } else {
                        theTitle = r.title
                    }
                    return (
                      <tr style={revR} key={r.id}>
                        <td style={revC1}>{r.date.slice(0, 19)}</td>
                        <td>{theTitle}</td>
                      </tr>
                )
            })
            }
        </tbody>
      </table>
    </div>
  </div>,
  document.getElementById('page'),
)
