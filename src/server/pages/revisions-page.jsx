import React from 'react';
import Header from '../components/header';

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

const revisionsRowStyle = {
  paddingBottom: '5px',
  textAlign: 'left',
}

const revisionDateStyle = {
  width: '200px',
}

export default class RevisionsPage extends React.Component {
  render() {
    return (
      <div>
        <Header userInfo={this.props.userInfo} />
        <div style={contentStyle}>
          <h2><a href={`/notebooks/${this.props.ownerInfo.notebookId}`}>{this.props.ownerInfo.title}</a> <span style={revisionLabelStyle}> / revisions</span></h2>

          <a style={blockLinkStyle} href={`/${this.props.ownerInfo.username}`}>
            <div style={infoTable}>
              <img
                style={avatarStyle}
                src={this.props.ownerInfo.avatar}
                alt={this.props.ownerInfo.username}
                width={35}
              />
              <div style={{ fontSize: '14px' }}>
                {this.props.ownerInfo.full_name} <i>({this.props.ownerInfo.username})</i>
              </div>
            </div>
          </a>
          <h3>Revisions</h3>
          <table style={revTable}>
            <tbody>
              <tr style={revisionsRowStyle}>
                <th>When</th>
                <th>Title</th>
              </tr>
              {
                        this.props.revisions.map((r, i) => {
                            let theTitle
                            if (i > 0 &&
                                this.props.revisions[i].title ===
                                this.props.revisions[i - 1].title) {
                                theTitle = '-'
                            } else {
                                theTitle = r.title
                            }
                            return (
                              <tr style={revisionsRowStyle} key={r.id}>
                                <td style={revisionDateStyle}><a href={`/notebooks/${r.notebookId}/?revision=${r.id}`}>{r.date.slice(0, 19)}</a></td>
                                <td>{theTitle}</td>
                              </tr>
                        )
                    })
                    }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
