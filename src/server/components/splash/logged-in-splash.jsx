import React from 'react'
import styled from 'react-emotion'
import { SplashTitle, HighlightedTitle, SplashContentContainer } from './shared-components'
import Paginatedlist from '../paginated-list'
import { ListItem, ListMain, ListDate, ListPrimaryText } from '../list'
import { monthDayYear } from '../../../shared/date-formatters'
import NewNotebookButton from '../new-notebook-button'
import AttentionBlock from '../attention-block'
import PageHeader from '../page-header'


const UserNotebooks = styled('div')`
  width: 600px;
  margin:auto;
`
const LetsGetStarted = () => (
  <AttentionBlock>
    <div>Shall we get started?</div>
    <NewNotebookButton />
  </AttentionBlock>
)

export default class LoggedInSplash extends React.Component {
  render() {
    return (
      <SplashContentContainer>
        <UserNotebooks>
          <SplashTitle>
            Welcome back, <HighlightedTitle>{this.props.userInfo.name}</HighlightedTitle>.
          </SplashTitle>
          {
            this.props.userInfo.notebooks.length &&
            <React.Fragment>
              <NewNotebookButton />
              <PageHeader>Your Notebooks</PageHeader>
              <Paginatedlist
                pageSize={7}
                rows={this.props.userInfo.notebooks}
                header={['LAST UPDATED', 'TITLE']}
                getRow={d => (
                  <ListItem key={d.id}>
                    <ListMain>
                      <ListPrimaryText>
                        <a href={`/notebooks/${d.id}/`}>{d.title}</a>
                      </ListPrimaryText>
                    </ListMain>
                    <ListDate>
                      {monthDayYear(d.latestRevision)}
                    </ListDate>
                  </ListItem>
            )}
              />
            </React.Fragment>
          }
          {
            !this.props.userInfo.notebooks.length &&
            <LetsGetStarted />
          }

        </UserNotebooks>
      </SplashContentContainer>
    )
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
