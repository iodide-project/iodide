import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
// import MoreHoriz from '@material-ui/icons/MoreHoriz'

import Header from "../components/header";
import PageBody from "../components/page-body";
import BelowFoldContainer from "../components/page-containers/below-fold-container";
// import PaginatedList from '../components/paginated-list'
import AttentionBlock from "../components/attention-block";
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
    font-size: 1em;
    margin-top: 0;
  }

  a.github-link {
    color: black;
    text-decoration: none;
  }

  .github-link i {
    padding-right: 2.5px;
  }
`;

const UserPageWithoutNotebooksPlaceholder = ({ isUserAccount }) => (
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

UserPageWithoutNotebooksPlaceholder.propTypes = {
  isUserAccount: PropTypes.bool
};

export const isLoggedIn = userInfo => "name" in userInfo;

export default class UserPage extends React.Component {
  static propTypes = {
    thisUser: PropTypes.shape({
      avatar: PropTypes.string,
      full_name: PropTypes.string,
      github_url: PropTypes.string,
      name: PropTypes.string
    }),
    userInfo: PropTypes.shape({
      avatar: PropTypes.string,
      full_name: PropTypes.string,
      github_url: PropTypes.string,
      name: PropTypes.string
    }),
    notebookList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        latestRevision: PropTypes.string,
        last_revision: PropTypes.string
      })
    ),
    headerMessage: PropTypes.string
  };
  render() {
    const { thisUser, userInfo, notebookList, headerMessage } = this.props;
    const isUserAccount =
      isLoggedIn(userInfo) && thisUser.name === userInfo.name;
    return (
      <div>
        <Header userInfo={userInfo} headerMessage={headerMessage} />
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
                {thisUser.github_url ? (
                  <a
                    className="github-link"
                    target="blank_"
                    href={thisUser.github_url}
                  >
                    <i className="fa fa-github" />
                    {thisUser.name}
                  </a>
                ) : (
                  thisUser.name
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
                {isUserAccount && <NewNotebookButton />}
                <h2>notebooks</h2>
                <UserNotebookList
                  showMenu
                  isUserAccount={isUserAccount}
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

export { UserPageWithoutNotebooksPlaceholder };
