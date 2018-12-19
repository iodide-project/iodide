import React from 'react';
import styled from 'react-emotion'
import PropTypes from 'prop-types';
import Table from '../components/table'
import { SmallUserName as UserName } from '../components/user-name'
import { OutlineButton } from '../../shared/components/buttons'
import NewNotebookButton from './new-notebook-button'

const PaginationContainer = styled('div')`
  display: block;
  margin:auto;
  text-align:center;
  margin-top:20px;
`

const Number = styled('span')`
display: inline-block;
padding:5px;
width: 40px;
text-align:center;
`

const N = styled('span')`
`
const D = styled('span')`
font-weight:300;
color: gray;

`
export class Pagination extends React.Component {
  render() {
    return (
      <PaginationContainer>
        <OutlineButton onClick={this.props.onPrev}>&larr; prev</OutlineButton>
        <Number><N>{this.props.currentPage}</N> / <D>{this.props.pages}</D></Number>
        <OutlineButton onClick={this.props.onNext}>next &rarr;</OutlineButton>
      </PaginationContainer>
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
    if (visibleNotebooks.length !== PAGE_SIZE) {
      new Array(PAGE_SIZE - visibleNotebooks.length).fill(null).forEach(() => {
        visibleNotebooks.push(undefined)
      })
    }
    return (
      <React.Fragment>
        <NewNotebookButton />

        <Table>
          <thead>
            <tr>
              <th>Owner</th>
              <th>Notebook</th>
            </tr>
          </thead>
          <tbody>
            {
            visibleNotebooks.map((notebook) => {
              console.log()
              if (notebook === undefined) {
                return (
                  <tr>
                    <td />
                    <td />
                  </tr>
                )
              }
              return (
                <tr key={notebook.id}>
                  <td width={140}>
                    <UserName avatar={notebook.avatar} username={notebook.owner} />
                  </td>
                  <td>
                    <a href={`/notebooks/${notebook.id}/`}>{notebook.title}</a>
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </Table>
        <Pagination
          onPrev={this.prev}
          onNext={this.next}
          pages={Math.ceil((this.props.notebookList.length) / PAGE_SIZE)}
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
