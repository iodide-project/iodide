import React from 'react';

import Header from '../components/header';
import PageBody from '../components/page-body';
import PageHeader from '../components/page-header';
import TrendingNotebooksList from '../components/trending-notebooks-list';
import { ContainedButton } from '../components/buttons'
import AttentionBlock from '../components/attention-block'

const TrendingNotebooksPage = ({ notebookList }) => (
  <React.Fragment>
    <PageHeader>Most Recent Notebooks</PageHeader>
    <TrendingNotebooksList notebookList={notebookList} />
  </React.Fragment>
)

const NewNotebookButton = () => <ContainedButton target="_blank" href="/new">+ New Notebook</ContainedButton>

const LetsGetStarted = () => (
  <AttentionBlock>
    <div>Welcome to Iodide. Shall we get started?</div>
    <NewNotebookButton />
  </AttentionBlock>
)

export default class HomePage extends React.Component {
  render() {
    const { notebookList } = this.props
    return (
      <div>
        <Header userInfo={this.props.userInfo} />
        <PageBody>
          {notebookList.length ?
            <TrendingNotebooksPage notebookList={notebookList} /> :
            <LetsGetStarted />
          }
        </PageBody>
      </div>
    )
  }
}
