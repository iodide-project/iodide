import React from 'react'
import styled from 'react-emotion'
import { SplashTitle, HighlightedTitle, SplashContentContainer } from './shared-components'
import PaginatedTable from '../paginated-table'
import { formatServerDate } from '../../../shared/date-formatters'
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
        {/* <SplashImg width={100} src="https://camo.githubusercontent.com/b5dbd69518bd23f9eb2f9b722860e03d822fbcd6/68747470733a2f2f66696c65732e6769747465722e696d2f696f646964652d70726f6a6563742f696f646964652f7857314a2f696f646964652d737469636b65722d322e706e67" /> */}

        <UserNotebooks>
          <SplashTitle>
            Welcome back, <HighlightedTitle>{this.props.userInfo.name}</HighlightedTitle>.
          </SplashTitle>
          {
            this.props.userInfo.notebooks.length &&
            <React.Fragment>
              <PageHeader>Your Notebooks</PageHeader>
              <NewNotebookButton />
              <PaginatedTable
                pageSize={7}
                rows={this.props.userInfo.notebooks}
                header={['LAST UPDATED', 'TITLE']}
                getRow={d => (
                  <tr>
                    <td width={120}>
                      {formatServerDate(d.latestRevision)}
                    </td>
                    <td><a href={`/notebooks/${d.id}/`}>{d.title}</a></td>


                  </tr>
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
