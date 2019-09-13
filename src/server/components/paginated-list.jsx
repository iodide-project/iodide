import React from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import { List, Placeholder } from "../../shared/components/list";
import { OutlineButton } from "../../shared/components/buttons";

const PaginationContainer = styled("div")`
  display: block;
  margin: auto;
  text-align: center;
  margin-top: 40px;
`;

const Number = styled("span")`
  display: inline-block;
  padding: 5px;
  width: 90px;
  text-align: center;
`;

const N = styled("span")``;
const D = styled("span")`
  font-weight: 300;
  color: gray;
`;
export class Pagination extends React.Component {
  static propTypes = {
    currentPage: PropTypes.number,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    pages: PropTypes.number
  };
  render() {
    return (
      <PaginationContainer>
        <OutlineButton onClick={this.props.onPrev}>&larr; prev</OutlineButton>
        <Number>
          <N>{this.props.currentPage}</N> / <D>{this.props.pages}</D>
        </Number>
        <OutlineButton onClick={this.props.onNext}>next &rarr;</OutlineButton>
      </PaginationContainer>
    );
  }
}

export const PAGE_SIZE = 15;

export default class PaginatedTable extends React.Component {
  static propTypes = {
    pageSize: PropTypes.number,
    rows: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
        PropTypes.object
      ])
    ),
    getRow: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = { currentPage: 0 };
    this.pageSize = props.pageSize || PAGE_SIZE;
    this.totalPages = Math.ceil(props.rows.length / this.pageSize);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
  }

  next() {
    const { currentPage } = this.state;
    if (currentPage !== this.totalPages - 1) {
      this.setState({
        currentPage: currentPage + 1
      });
    }
  }

  prev() {
    const { currentPage } = this.state;
    if (currentPage > 0) {
      this.setState({ currentPage: currentPage - 1 });
    }
  }

  render() {
    const { currentPage } = this.state;
    const ind = currentPage * this.pageSize;
    const visibleRows = this.props.rows.slice(
      ind,
      Math.min(ind + this.pageSize, this.props.rows.length)
    );
    if (this.totalPages > 1 && visibleRows.length < this.pageSize) {
      new Array(this.pageSize - visibleRows.length + 1)
        .fill(null)
        .forEach(() => {
          visibleRows.push(undefined);
        });
    }
    return (
      <React.Fragment>
        <List>
          {visibleRows.map(row =>
            row ? (
              this.props.getRow(row)
            ) : (
              <Placeholder className="list-placeholder">
                <div />
              </Placeholder>
            )
          )}
        </List>
        {this.totalPages > 1 && (
          <Pagination
            onPrev={this.prev}
            onNext={this.next}
            pages={Math.ceil(this.props.rows.length / this.pageSize)}
            currentPage={this.state.currentPage + 1}
          />
        )}
      </React.Fragment>
    );
  }
}
