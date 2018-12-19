import React from 'react';

import Header from '../components/header';
import PageBody from '../components/page-body';
import PageHeader from '../components/page-header';
import TopContainer from '../components/page-containers/top-container';
import BelowFoldContainer from '../components/page-containers/below-fold-container';
import SplashContent from '../components/splash-content'
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
          <TopContainer>
            <SplashContent />
            <PageHeader>Try These Examples</PageHeader>
            <NotebookDisplay>
              <NotebookDisplayItem
                title="A Brief Tour through Iodide"
                description="
                   A tutorial that walks through all the important parts of Iodide."
                href="https://extremely-alpha.iodide.io/notebooks/154/"
                // imageSource="https://media.giphy.com/media/Rdo9axaQcvGBq/giphy.gif"
                imageSource="https://media.giphy.com/media/5qF68SjjIT6khDkS5T/giphy.gif"
              />
              <NotebookDisplayItem
                title="The Lorenz Attractor Up-Close"
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
                href="https://extremely-alpha.iodide.io/notebooks/151/"
                imageSource="https://media.giphy.com/media/65NKOOH1IQrsLx5aZb/giphy.gif"
              />
              <NotebookDisplayItem
                title="World Happiness Report"
                description="A neat data exploration using the World Happiness Report."
                href="#"
                imageSource="https://media.giphy.com/media/i4rRuA3cksj8a9R58g/giphy.gif"
              />
              <NotebookDisplayItem
                title="MRIs and You"
                description="One man's cartoon / WebGL journey into his own brain."
                href="#"
                imageSource="https://media.giphy.com/media/9G6RGV7z6k4uzygzOQ/giphy.gif"
              />
              <NotebookDisplayItem
                title="Eviction Notices By SF Neighborhood, 1999-present"
                description="
                A small data presentation about one aspect of the SF Housing crisis."
                href="https://iodide.io/iodide-examples/eviction-notices-sf.html"
                imageSource="https://media.giphy.com/media/MohSU55IoyGmAXgEkY/giphy.gif"
              />
            </NotebookDisplay>
          </TopContainer>
          <BelowFoldContainer>
            {notebookList.length ?
              <TrendingNotebooksPage notebookList={notebookList} /> :
              <LetsGetStarted />
          }
          </BelowFoldContainer>
        </PageBody>
      </div>
    )
  }
}
