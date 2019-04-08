import React from "react";
import ReactTable from "react-table";
import PropTypes from "prop-types";
import { get } from "lodash";
import styled from "react-emotion";

import "./react-table-styles.css";

import { tinyRepSerializer } from "./rep-utils/tiny-rep-serializer";

import DefaultRenderer from "./default-handler";
import tinyRep from "./tiny-reps";

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

const CellDetails = props => {
  if (props.focusedPath) {
    return (
      <TableDetails>
        <TableDetailsMessage pad>
          {`details for ${props.focusedPath}`}
        </TableDetailsMessage>
        <DefaultRenderer value={get(props.value, props.focusedPath)} />
      </TableDetails>
    );
  }
  return (
    <TableDetails>
      <TableDetailsMessage>Click a table cell for details</TableDetailsMessage>
    </TableDetails>
  );
};

export default class TableRenderer extends React.Component {
  static propTypes = {
    value: PropTypes.any.isRequired
  };
  constructor(props) {
    super(props);
    this.state = { focusedPath: undefined };
  }

  handleCellClick(rowInfo, column) {
    this.setState({ focusedPath: `[${rowInfo.index}]["${column.id}"]` });
  }

  render() {
    const { value } = this.props;

    const columns = Object.keys(value[0]).map(k => ({
      Header: k,
      accessor: k,
      Cell: cell => {
        return tinyRep(tinyRepSerializer(cell.value));
      }
    }));

    const pageSize = value.length > 10 ? 10 : value.length;
    return (
      <div>
        <ReactTable
          data={value}
          columns={columns}
          showPaginationTop
          showPaginationBottom={false}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          minRows={0}
          defaultPageSize={pageSize}
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
        <CellDetails value={value} focusedPath={this.state.focusedPath} />
      </div>
    );
  }
}
