import React from 'react'
import MoreHoriz from '@material-ui/icons/MoreHoriz'

import Paginatedlist from './paginated-list'
import { ListItem, ListMain, ListDate, ListPrimaryText, ListSecondaryText, ListSmallLink, ListMetadata } from './list'
import NotebookActionsMenu from './notebook-actions-menu'
import { ActionsContainer, BodyIconStyle } from '../style/icon-styles'

import { monthDayYear } from '../../shared/date-formatters'

export default class UserNotebookList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { notebooks: this.props.notebooks }
    this.deleteNotebook = this.deleteNotebook.bind(this)
  }

  deleteNotebook(nbID) {
    const notebooks = this.state.notebooks.filter(nb => nb.id !== nbID)
    this.setState({ notebooks })
  }

  render() {
    return (<Paginatedlist
      pageSize={this.props.pageSize || 7}
      rows={this.state.notebooks}
      getRow={d => (
        <ListItem key={d.id} type="single">
          <ListMain>
            <ListPrimaryText>
              <a href={`/notebooks/${d.id}/`}>{d.title}</a>
            </ListPrimaryText>
            <ListSecondaryText>
              <ListSmallLink href={`/notebooks/${d.id}/`}>
                  explore
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
            <a href={`/notebooks/${d.id}/revisions`}>{monthDayYear(d.latestRevision || d.last_revision)}</a>
          </ListDate>
          {this.props.showMenu && (
            <ListMetadata>
              <ActionsContainer>
                <NotebookActionsMenu
                  isUserAccount={this.props.isUserAccount}
                  triggerElement={<MoreHoriz width={15} className={BodyIconStyle} />}
                  notebookID={d.id}
                  notebookTitle={d.title}
                  onDelete={this.deleteNotebook}
                />
              </ActionsContainer>
            </ListMetadata>
            )}
        </ListItem>
        )}
    />)
  }
}
