import React from "react";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import CircularProgress from "@material-ui/core/CircularProgress";
import PropTypes from "prop-types";
import X from "@material-ui/icons/Close";
import styled from "@emotion/styled";

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
import DropTarget from "../../shared/components/drop-target";
import THEME from "../../shared/theme";
import { sharedProperties } from "../../server/style/base";
import { fadeIn, bounce } from "../../shared/keyframes";

const Overlay = styled.div`
  align-items: center;
  animation: ${fadeIn} 0.25s;
  background: ${THEME.header.backgroundLeft};
  box-sizing: border-box;
  color: #fff;
  display: grid;
  grid-gap: 100px;
  justify-items: center;
  overflow: auto;
  padding: 2%;
  z-index: 10;

  /* Expand to fill the viewport */
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  &.invisible {
    display: none;
  }
`;

// This wrapper works around a peculiarity with centering in CSS Grid.
//
// Setting "align-content: center" on a grid container gives it "true" vertical
// centering, which is to say that content will be clipped it it cannot fit on
// screen, even when "overflow: auto" is used.
//
// In other words, we could ditch this wrapper and set "align-content: center"
// on the overlay when an upload is in progress, but if there were more files
// being uploaded than could be shown on screen, some of them would be
// invisible.
//
// The real solution is to ditch this wrapper and use "align-content: safe
// center" which addresses this exact problem, but it's not supported in most
// browsers at the time of this writing.
//
// https://stackoverflow.com/a/33455342/4297741
const OverlayUploadingBody = styled.div`
  display: grid;
  grid-gap: 100px;
`;

const OverlayTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
`;

const OverlayArrow = styled(ArrowUpward)`
  /* Increase specificity to override Material defaults */
  #home-page & {
    animation: ${bounce} 1s ease-in-out infinite alternate;
    font-size: 10rem;
  }
`;

const OverlayFileList = styled.ul`
  display: grid;
  font-size: 2rem;
  grid-gap: 100px;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    align-items: center;
    display: grid;
    grid-auto-flow: column;
    grid-gap: 50px;
    justify-content: space-between;

    .file-status-icon {
      font-size: 50px;
    }
  }
`;

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

let previousBodyOverflow;

export default function HomePage({ notebookList, userInfo, headerMessage }) {
  const [overlayVisible, setOverlayVisible] = React.useState(false);
  const [numHoveredFiles, setNumHoveredFiles] = React.useState(0);
  const [filesMeta, setFilesMeta] = React.useState([]);
  const isLoggedIn = "name" in userInfo;

  React.useEffect(() => {
    if (overlayVisible) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousBodyOverflow;
    }

    return function cleanup() {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [overlayVisible]);

  function onHoverStart(e) {
    setNumHoveredFiles(e.dataTransfer.items.length);
    setOverlayVisible(true);
  }

  function onHoverEnd() {
    setOverlayVisible(false);
  }

  function onDrop(e) {
    // Don't let the user drop more files if some files are already uploading
    if (filesMeta.length) return;

    let id = 1;

    setFilesMeta(
      Array.from(e.dataTransfer.files).map(file => {
        const fileMeta = {
          file,
          id,
          status: "uploading"
        };

        id += 1;

        return fileMeta;
      })
    );
  }

  return (
    <DropTarget
      id="home-page"
      active={isLoggedIn}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onDrop={onDrop}
    >
      <Overlay
        className={`overlay ${overlayVisible ? "visible" : "invisible"}`}
      >
        {filesMeta.length > 0 ? (
          <OverlayUploadingBody>
            <OverlayTitle>Creating new notebook...</OverlayTitle>
            <OverlayFileList id="overlay-file-list">
              {filesMeta.map(fm => (
                <li key={fm.id}>
                  {fm.file.name}
                  {fm.status === "uploading" && (
                    <CircularProgress size="50px" color="inherit" />
                  )}
                  {fm.status === "saved" && (
                    <Check className="file-status-icon" />
                  )}
                  {fm.status === "failed" && <X className="file-status-icon" />}
                </li>
              ))}
            </OverlayFileList>
          </OverlayUploadingBody>
        ) : (
          <React.Fragment>
            <OverlayTitle>
              Drop to create a new notebook with {numHoveredFiles} attached{" "}
              {numHoveredFiles === 1 ? "file" : "files"}
            </OverlayTitle>
            <OverlayArrow />
          </React.Fragment>
        )}
      </Overlay>
      <Header userInfo={userInfo} headerMessage={headerMessage} />
      <PageBody>
        <TopContainer>
          {!isLoggedIn && process.env.IODIDE_PUBLIC && <MarketingCopySplash />}
          {!isLoggedIn && !process.env.IODIDE_PUBLIC && <LetsGetStarted />}
          {isLoggedIn && <LoggedInSplash userInfo={userInfo} />}
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
    </DropTarget>
  );
}

HomePage.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string
  }),
  headerMessage: PropTypes.string,
  notebookList: PropTypes.arrayOf(PropTypes.object)
};
