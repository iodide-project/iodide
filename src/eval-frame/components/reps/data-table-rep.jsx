import React from "react";
import ReactTable from "react-table";
import PropTypes from "prop-types";

import styled from "react-emotion";

import "./react-table-styles.css";

// import { serializeForValueSummary } from "./rep-utils/value-summary-serializer";

import ExpandableRep from "./rep-tree";

import { getChildSummary } from "./rep-utils/get-child-summaries";
import { getDataTableSummary } from "./rep-utils/get-data-table-summary";
import { getValueSummary } from "./rep-utils/get-value-summary";

import { RangeDescriptor } from "./rep-utils/rep-serialization-core-types";

import ValueSummaryRep from "./value-summary";

const TableDetails = styled.div`
  border: solid #e5e5e5;
  border-width: 0px 1px 1px 1px;
  padding: 5px;
`;
const TableDetailsMessage = styled.div`
  color: #999;
  font-style: italic;
  font-family: "Open Sans", sans-serif;
  padding-bottom: ${props => (props.pad ? "3px" : "0px")};
`;

class CellDetails extends React.Component {
  static propTypes = {
    // value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    focusedRow: PropTypes.number,
    focusedCol: PropTypes.string,
    pathToDataFrame: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(RangeDescriptor)
      ])
    ).isRequired,
    rootObjName: PropTypes.string
  };

  render() {
    const { focusedRow, focusedCol, rootObjName, pathToDataFrame } = this.props;

    if (focusedRow !== undefined && focusedCol !== undefined) {
      const focusedPath = `[${focusedRow}]["${focusedCol}"]`;
      const pathToDataFrameCell = [
        ...pathToDataFrame,
        String(focusedRow),
        focusedCol
      ];
      const valueSummary = getValueSummary(rootObjName, pathToDataFrameCell);
      return (
        <TableDetails>
          <TableDetailsMessage pad>
            {`details for ${focusedPath}`}
          </TableDetailsMessage>
          <ExpandableRep
            pathToEntity={pathToDataFrameCell}
            valueSummary={valueSummary}
            getChildSummaries={getChildSummary}
            rootObjName={rootObjName}
          />
        </TableDetails>
      );
    }
    return (
      <TableDetails>
        <TableDetailsMessage>
          Click a table cell for details
        </TableDetailsMessage>
      </TableDetails>
    );
  }
}

class CellRenderer extends React.PureComponent {
  static propTypes = {
    valueSummary: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    cellIsFocused: PropTypes.bool.isRequired
  };
  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "1px 5px",
          backgroundColor: this.props.cellIsFocused
            ? "rgb(230, 230, 230)"
            : "none"
        }}
      >
        <ValueSummaryRep tiny {...this.props.valueSummary} />
      </div>
    );
  }
}

const PX_PER_CHAR = 7;
const MIN_CELL_CHAR_WIDTH = 22;

const requestData = (rootObjName, path, pageSize, page) =>
  getDataTableSummary(rootObjName, path, pageSize, page);

export default class TableRenderer extends React.Component {
  static propTypes = {
    initialDataRows: PropTypes.arrayOf(PropTypes.object).isRequired,
    pages: PropTypes.number.isRequired,
    pathToDataFrame: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(RangeDescriptor)
      ])
    ).isRequired,
    rootObjName: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      focusedRow: undefined,
      focusedCol: undefined,
      data: this.props.initialDataRows,
      pages: this.props.pages,
      loading: false
    };
    this.fetchData = this.fetchData.bind(this);
  }

  async fetchData(state) {
    // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
    // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
    this.setState({ loading: true });

    const { rows, pages } = await requestData(
      this.props.rootObjName,
      this.props.pathToDataFrame,
      state.pageSize,
      state.page
    );

    this.setState({
      data: rows,
      pages,
      loading: false
    });
  }

  handleCellClick(rowInfo, column) {
    this.setState({ focusedRow: rowInfo.index, focusedCol: column.id });
  }

  render() {
    const { data, pages, loading } = this.state;

    const columns = Object.keys(data[0]).map(k => ({
      Header: k,
      accessor: k,
      width: Math.max(k.length, MIN_CELL_CHAR_WIDTH) * PX_PER_CHAR,
      Cell: rowInfo => {
        return (
          <CellRenderer
            cellIsFocused={
              this.state.focusedCol === k &&
              this.state.focusedRow === rowInfo.index
            }
            valueSummary={rowInfo.value}
          />
        );
      }
    }));

    return (
      <div>
        <ReactTable
          manual
          data={data}
          pages={pages}
          loading={loading}
          onFetchData={this.fetchData}
          columns={columns}
          showPaginationTop
          showPaginationBottom={false}
          resizable={false}
          sortable={false}
          pageSizeOptions={[10, 25, 50, 100]}
          defaultPageSize={10}
          minRows={0}
          getTdProps={(state, rowInfo, column) => {
            return {
              onClick: (e, handleOriginal) => {
                this.handleCellClick(rowInfo, column);
                if (handleOriginal) {
                  handleOriginal();
                }
              }
            };
          }}
        />
        <CellDetails
          // value={value}
          focusedRow={this.state.focusedRow}
          focusedCol={this.state.focusedCol}
          rootObjName={this.props.rootObjName}
          pathToDataFrame={this.props.pathToDataFrame}
        />
      </div>
    );
  }
}
