import React from 'react';
import PropTypes from 'prop-types';
import Table from '../components/table'
import { SmallUserName as UserName } from '../components/user-name'
import { OutlineButton } from '../../shared/components/buttons'
import NewNotebookButton from './new-notebook-button'

export class Pagination extends React.Component {
  render() {
    return (
      <div>
        <OutlineButton onClick={this.props.onPrev}>&larr; prev</OutlineButton>
        page: {this.props.currentPage}

        <OutlineButton onClick={this.props.onNext}>next &rarr;</OutlineButton>
      </div>
    )
  }
}

export const PAGE_SIZE = 15

export default class TrendingNotebooksList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { currentPage: 0 }
    this.totalPages = Math.floor(this.props.notebookList.length / PAGE_SIZE)
    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)
  }

  next() {
    const { currentPage } = this.state
    if (currentPage !== this.totalPages) {
      this.setState({
        currentPage: currentPage + 1,
      })
    }
  }

  prev() {
    const { currentPage } = this.state
    if (currentPage > 0) {
      this.setState({ currentPage: currentPage - 1 })
    }
  }

  render() {
    const { currentPage } = this.state
    const ind = currentPage * PAGE_SIZE
    const visibleNotebooks = this.props.notebookList.slice(ind, ind + PAGE_SIZE)
    return (
      <React.Fragment>
        <NewNotebookButton />

        <Table>
          <thead>
            <tr>
              <th>Notebook</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {
            visibleNotebooks.map(notebook => (
              <tr key={notebook.id}>
                <td>
                  <a href={`/notebooks/${notebook.id}/`}>{notebook.title}</a>
                </td>
                <td>
                  <UserName avatar={notebook.avatar} username={notebook.owner} />
                </td>
              </tr>
            ))
          }
          </tbody>
        </Table>
        <Pagination
          onPrev={this.prev}
          onNext={this.next}
          pages={Math.floor((this.props.notebookList.length) / PAGE_SIZE)}
          currentPage={this.state.currentPage + 1}
        />
      </React.Fragment>
    )
  }
}

TrendingNotebooksList.propTypes = {
  notebookList: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    owner: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  })),
}
