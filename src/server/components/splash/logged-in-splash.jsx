import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
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
const LetsGetStarted = () => (
  <AttentionBlock>
    <div>Shall we get started?</div>
    <NewNotebookButton />
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
              <NewNotebookButton />
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
