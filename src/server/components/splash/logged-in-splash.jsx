import React from 'react'

import { SplashTitle, HighlightedTitle, SplashContentContainer } from './shared-components'
import PaginatedTable from '../paginated-table'

export default class LoggedInSplash extends React.Component {
  render() {
    return (
      <SplashContentContainer>
        {/* <SplashImg width={100} src="https://camo.githubusercontent.com/b5dbd69518bd23f9eb2f9b722860e03d822fbcd6/68747470733a2f2f66696c65732e6769747465722e696d2f696f646964652d70726f6a6563742f696f646964652f7857314a2f696f646964652d737469636b65722d322e706e67" /> */}
        <SplashTitle>
            Welcome back, <HighlightedTitle>{this.props.userInfo.name}</HighlightedTitle>.
        </SplashTitle>
        <PaginatedTable
          rows={this.props.userInfo.notebooks}
          header={['TITLE', 'LAST UPDATED']}
          getRow={d => (
            <tr>
              <td>
                {d.title}
              </td>
              <td>
                {d.latestRevision}
              </td>
            </tr>
            )}
        />

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
