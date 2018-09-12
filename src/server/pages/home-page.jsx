import React from 'react';

import Header from '../components/header';
import PageBody from '../components/page-body';
import PageHeader from '../components/page-header';
import NotebookList from '../components/notebook-list';

export default class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Header userInfo={this.props.userInfo} />
        <PageBody>
          <PageHeader>Most Recent Notebooks</PageHeader>
          <NotebookList notebookList={this.props.notebookList} />
        </PageBody>
      </div>
    )
  }
}
