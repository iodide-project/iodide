import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import {
  SplashTitle,
  HighlightedTitle,
  SplashContentContainer
} from "./shared-components";
import UserNotebookList from "../user-notebook-list";
import NewNotebookButton from "../new-notebook-button";
import AttentionBlock from "../attention-block";
import PageHeader from "../page-header";
import { sharedProperties } from "../../style/base";

const UserNotebooks = styled("div")`
  width: ${sharedProperties.pageWidth}px;
  margin: auto;
`;

const NoNotebooksCreateInstructions = styled.div`
  align-items: center;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 7px;

  #drop-instructions {
    font-size: 0.8em;
    font-weight: normal;
  }
`;

const SomeNotebooksCreateInstructions = styled.div`
  align-items: center;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 7px;
  justify-content: start;
`;

const LetsGetStarted = () => (
  <AttentionBlock>
    <span>Shall we get started?</span>
    <NoNotebooksCreateInstructions>
      <NewNotebookButton />
      <span id="drop-instructions">or drop files directly onto this page</span>
    </NoNotebooksCreateInstructions>
  </AttentionBlock>
);

export default class LoggedInSplash extends React.Component {
  static propTypes = {
    userInfo: PropTypes.shape({
      name: PropTypes.string,
      notebooks: PropTypes.arrayOf(PropTypes.object)
    })
  };
  render() {
    return (
      <SplashContentContainer>
        <UserNotebooks>
          <SplashTitle>
            Welcome back,{" "}
            <HighlightedTitle>
              <a href={`/${this.props.userInfo.name}`}>
                {this.props.userInfo.name}
              </a>
            </HighlightedTitle>
            .
          </SplashTitle>
          {this.props.userInfo.notebooks.length ? (
            <React.Fragment>
              <SomeNotebooksCreateInstructions>
                <NewNotebookButton />
                <span>or drop files directly onto this page</span>
              </SomeNotebooksCreateInstructions>
              <PageHeader>Your Notebooks</PageHeader>
              <UserNotebookList
                showMenu
                notebooks={this.props.userInfo.notebooks}
                isUserAccount
              />
            </React.Fragment>
          ) : (
            <LetsGetStarted />
          )}
        </UserNotebooks>
      </SplashContentContainer>
    );
  }
}

/* <Table>
{
    this.props.userInfo.notebooks.map(d => (
      <tr>
        <td>{d.title}</td>
        <td>{d.latestRevision}</td>
      </tr>
      ))
}
</Table> */
