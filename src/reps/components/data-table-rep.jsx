import React from "react";
import ReactTable from "react-table";
import PropTypes from "prop-types";

import styled from "@emotion/styled";

import "react-table/react-table.css";
import "./react-table-styles.css";

import ExpandableRep from "./rep-tree";

import ValueSummaryRep from "./value-summary";

import {
  ValueSummaryPropTypes,
  PathToEntityPropTypes
} from "./rep-serialization-core-types-proptypes";

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
    focusedRowOriginalIndex: PropTypes.number,
    focusedCol: PropTypes.string,
    pathToDataFrame: PathToEntityPropTypes.isRequired,
    valueSummary: ValueSummaryPropTypes,
    requestRepInfo: PropTypes.func
  };

  render() {
    const { focusedRowOriginalIndex, focusedCol, pathToDataFrame } = this.props;

    if (focusedRowOriginalIndex !== undefined && focusedCol !== undefined) {
      const focusedPath = `[${focusedRowOriginalIndex}]["${focusedCol}"]`;
      const pathToDataFrameCell = [
        ...pathToDataFrame,
        String(focusedRowOriginalIndex),
        focusedCol
      ];
      const getChildSummary = pathToEntity =>
        this.props.requestRepInfo({
          pathToEntity,
          requestType: "CHILD_SUMMARY"
        });

      return (
        <TableDetails>
          <TableDetailsMessage pad>
            {`details for ${focusedPath}`}
          </TableDetailsMessage>
          <ExpandableRep
            pathToEntity={pathToDataFrameCell}
            valueSummary={this.props.valueSummary}
            getChildSummaries={getChildSummary}
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
    valueSummary: ValueSummaryPropTypes,
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

export default class TableRenderer extends React.Component {
  static propTypes = {
    initialDataRows: PropTypes.arrayOf(PropTypes.object).isRequired,
    pages: PropTypes.number.isRequired,
    pathToDataFrame: PathToEntityPropTypes,
    requestRepInfo: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      focusedRow: undefined,
      focusedRowOriginalIndex: undefined,
      focusedCol: undefined,
      data: this.props.initialDataRows,
      pages: this.props.pages,
      loading: false
    };
    this.fetchData = this.fetchData.bind(this);
  }

  async fetchData(fetchParams) {
    this.setState({ loading: true });

    const getDataTableSummary = (pathToEntity, pageSize, page, sorted) =>
      this.props.requestRepInfo({
        pathToEntity,
        pageSize,
        page,
        sorted,
        requestType: "ROW_TABLE_PAGE_SUMMARY"
      });

    const { rows, pages } = await getDataTableSummary(
      this.props.pathToDataFrame,
      fetchParams.pageSize,
      fetchParams.page,
      fetchParams.sorted
    );

    this.setState({
      data: rows,
      pages,
      loading: false,
      focusedRow: undefined,
      focusedRowOriginalIndex: undefined,
      focusedCol: undefined
    });
  }

  handleCellClick(rowInfo, column) {
    this.setState({
      focusedRow: rowInfo.index,
      focusedRowOriginalIndex: rowInfo.original.ORIGINAL_DATA_TABLE_ROW_INDEX,
      focusedCol: column.id
    });
  }

  render() {
    const {
      data,
      pages,
      loading,
      focusedRow,
      focusedRowOriginalIndex,
      focusedCol
    } = this.state;

    const columns = Object.keys(data[0])
      .filter(k => k !== "ORIGINAL_DATA_TABLE_ROW_INDEX")
      // .map(k => k !== "ORIGINAL_DATA_TABLE_ROW_INDEX")
      .map(k => ({
        Header: k === "" ? '""' : k,
        accessor: k === "" ? row => row[""] : k,
        id: k === "" ? "empty_string_column" : k,
        width: Math.max(k.length, MIN_CELL_CHAR_WIDTH) * PX_PER_CHAR,
        Cell: rowInfo => {
          return (
            <CellRenderer
              cellIsFocused={focusedCol === k && focusedRow === rowInfo.index}
              valueSummary={rowInfo.value}
            />
          );
        }
      }));

    const focusedValue =
      focusedCol !== undefined && focusedRow !== undefined
        ? data[focusedRow][focusedCol]
        : undefined;

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
          // resizable={false}
          sortable
          pageSizeOptions={[10, 25, 50, 100]}
          minRows={0}
          defaultPageSize={10}
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
          focusedRowOriginalIndex={focusedRowOriginalIndex}
          focusedCol={focusedCol}
          valueSummary={focusedValue}
          pathToDataFrame={this.props.pathToDataFrame}
          requestRepInfo={this.props.requestRepInfo}
        />
      </div>
    );
  }
}
