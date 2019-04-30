/* global IODIDE_PUBLIC */
import React from "react";
import PropTypes from "prop-types";

import Header from "../components/header";
import PageBody from "../components/page-body";
import PageHeader from "../components/page-header";
import TopContainer from "../components/page-containers/top-container";
import BelowFoldContainer from "../components/page-containers/below-fold-container";
import MarketingCopySplash from "../components/splash/marketing-copy-splash";
import LoggedInSplash from "../components/splash/logged-in-splash";
import TrendingNotebooksList from "../components/trending-notebooks-list";
import AttentionBlock from "../components/attention-block";
import NewNotebookButton from "../components/new-notebook-button";
import FeaturedNotebooks from "../../shared/components/featured-notebooks";
import { sharedProperties } from "../../server/style/base";

const TrendingNotebooksPage = ({ notebookList }) => (
  <React.Fragment>
    <PageHeader>The Firehose of Notebooks</PageHeader>
    <TrendingNotebooksList notebookList={notebookList} />
  </React.Fragment>
);

TrendingNotebooksPage.propTypes = {
  notebookList: PropTypes.arrayOf(PropTypes.object)
};

const LetsGetStarted = () => (
  <AttentionBlock>
    <div>Welcome to Iodide. Shall we get started?</div>
    <NewNotebookButton />
  </AttentionBlock>
);
export default class HomePage extends React.Component {
  static propTypes = {
    userInfo: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string
    }),
    notebookList: PropTypes.arrayOf(PropTypes.object)
  };
  render() {
    const isLoggedIn = "name" in this.props.userInfo;
    const { notebookList } = this.props;
    return (
      <div>
        <Header userInfo={this.props.userInfo} />
        <PageBody>
          <TopContainer>
            {!isLoggedIn && IODIDE_PUBLIC && <MarketingCopySplash />}
            {!isLoggedIn && !IODIDE_PUBLIC && <LetsGetStarted />}
            {isLoggedIn && <LoggedInSplash userInfo={this.props.userInfo} />}
            <PageHeader>Try These Examples</PageHeader>
            <FeaturedNotebooks width={`${sharedProperties.pageWidth}px`} />
          </TopContainer>
          <BelowFoldContainer>
            {notebookList.length ? (
              <TrendingNotebooksPage notebookList={notebookList} />
            ) : (
              <LetsGetStarted />
            )}
          </BelowFoldContainer>
        </PageBody>
      </div>
    );
  }
}
