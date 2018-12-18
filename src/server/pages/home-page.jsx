import React from 'react';

import Header from '../components/header';
import PageBody from '../components/page-body';
import PageHeader from '../components/page-header';
import NotebookDisplay from '../components/notebook-display'
import NotebookDisplayItem from '../components/notebook-display-item'
import TrendingNotebooksList from '../components/trending-notebooks-list';
import AttentionBlock from '../components/attention-block'
import NewNotebookButton from '../components/new-notebook-button'

const TrendingNotebooksPage = ({ notebookList }) => (
  <React.Fragment>
    <PageHeader>Most Recent Notebooks</PageHeader>
    <TrendingNotebooksList notebookList={notebookList} />
  </React.Fragment>
)


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
          <NotebookDisplay>
            <NotebookDisplayItem
              title="Lorenz Attractor"
              description="
                   A concise example demonstrating how powerful
                   a web tech-focused notebook environment is for computational presentations."
              href="#"
              imageSource="https://media.giphy.com/media/ftdkB78fuQ1Eb3J2o1/giphy.gif"
            />
            <NotebookDisplayItem
              title="Pyodide: Scientific Python in your Browser"
              description="
                A tutorial demonstrating how
                to use Python, Numpy, Pandas, and Matplotlib entirely within your browser."
              href="#"
              imageSource="https://media.giphy.com/media/65NKOOH1IQrsLx5aZb/giphy.gif"
            />
          </NotebookDisplay>
          {notebookList.length ?
            <TrendingNotebooksPage notebookList={notebookList} /> :
            <LetsGetStarted />
          }
        </PageBody>
      </div>
    )
  }
}
