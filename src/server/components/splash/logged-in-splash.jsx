import React from 'react'
import styled from 'react-emotion'
import { SplashTitle, HighlightedTitle, SplashContentContainer } from './shared-components'
import Paginatedlist from '../paginated-list'
import { ListItem, ListMain, ListDate, ListPrimaryText, ListSecondaryText, ListSmallLink } from '../list'
import { monthDayYear } from '../../../shared/date-formatters'
import NewNotebookButton from '../new-notebook-button'
import AttentionBlock from '../attention-block'
import PageHeader from '../page-header'
import { sharedProperties } from '../../style/base'


const UserNotebooks = styled('div')`
  width: ${sharedProperties.pageWidth}px;
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
                  <ListItem key={d.id} type="single">
                    <ListMain>
                      <ListPrimaryText>
                        <a href={`/notebooks/${d.id}/`}>{d.title}</a>
                      </ListPrimaryText>
                      <ListSecondaryText>
                        <ListSmallLink href={`/notebooks/${d.id}/`}>
                            source
                        </ListSmallLink>
                        <ListSmallLink href={`/notebooks/${d.id}/?viewMode=report`}>
                            report
                        </ListSmallLink>
                        <ListSmallLink href={`/notebooks/${d.id}/revisions/`}>
                            revisions
                        </ListSmallLink>
                      </ListSecondaryText>
                    </ListMain>
                    <ListDate>
                      <a href={`/notebooks/${d.id}/revisions`}>{monthDayYear(d.latestRevision)}</a>
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
