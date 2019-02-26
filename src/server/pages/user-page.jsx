import React from "react";
import styled from "react-emotion";
// import MoreHoriz from '@material-ui/icons/MoreHoriz'

import Header from "../components/header";
import PageBody from "../components/page-body";
import BelowFoldContainer from "../components/page-containers/below-fold-container";
// import PaginatedList from '../components/paginated-list'
import AttentionBlock from "../components/attention-block";
// import NotebookActionsMenu from '../components/notebook-actions-menu'
import NewNotebookButton from "../components/new-notebook-button";
// import { ActionsContainer, BodyIconStyle } from '../style/icon-styles'
// import { monthDayYear } from '../../shared/date-formatters'

import UserNotebookList from "../components/user-notebook-list";

const UserInformationContainer = styled("div")`
  img {
    border-radius: 5px;
  }

  h1 {
    margin-top: 20;
    margin-bottom: 0;
    font-weight: 900;
    text-transform: uppercase;
  }

  h2 {
    font-weight: 300;
    margin-top: 0;
  }

  a {
    color: black;
  }
`;

export const UserPageWithoutNotebooksPlaceholder = ({ isUserAccount }) => (
  <AttentionBlock>
    {isUserAccount ? (
      <React.Fragment>
        <div>Shall we get started?</div>
        <NewNotebookButton />
      </React.Fragment>
    ) : (
      "This user regrettably has no notebooks."
    )}
  </AttentionBlock>
);

export const isLoggedIn = userInfo => "name" in userInfo;

export default class UserPage extends React.Component {
  render() {
    const { thisUser, userInfo, notebookList } = this.props;
    return (
      <div>
        <Header userInfo={userInfo} />
        <PageBody>
          <BelowFoldContainer>
            <UserInformationContainer>
              <img
                width={150}
                src={thisUser.avatar}
                alt={`${thisUser.name}'s avatar`}
              />
              <h1>{thisUser.full_name}</h1>
              <h2>
                {thisUser.name}{" "}
                {thisUser.github_url && (
                  <a href={thisUser.github_url}>
                    <i className="fa fa-github" />
                  </a>
                )}
              </h2>
            </UserInformationContainer>
            {!notebookList.length && (
              <UserPageWithoutNotebooksPlaceholder
                isUserAccount={thisUser.name === userInfo.name}
              />
            )}
            {notebookList.length && (
              <React.Fragment>
                <NewNotebookButton />
                <h2>notebooks</h2>
                <UserNotebookList
                  showMenu
                  isUserAccount={
                    isLoggedIn(userInfo) && thisUser.name === userInfo.name
                  }
                  notebooks={notebookList}
                />
              </React.Fragment>
            )}
          </BelowFoldContainer>
        </PageBody>
      </div>
    );
  }
}
