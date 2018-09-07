import React from 'react';

import Header from '../components/header';
import NotebookList from '../components/notebook-list';


export default class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Header userInfo={this.props.userInfo} />
        <NotebookList notebookList={this.props.notebookList} />
      </div>
    )
  }
}
