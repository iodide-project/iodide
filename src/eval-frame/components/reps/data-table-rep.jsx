import React from "react";
import ReactTable from "react-table";
import PropTypes from "prop-types";
import { get } from "lodash";

import { tinyRepSerializer } from "./rep-utils/tiny-rep-serializer";

import DefaultRenderer from "./default-handler";
import tinyRep from "./tiny-reps";

export default class TableRenderer extends React.Component {
  static propTypes = {
    value: PropTypes.any.isRequired
  };
  constructor(props) {
    super(props);
    this.state = { focusedPath: undefined };
  }

  handleCellClick(rowInfo, column) {
    this.setState({ focusedPath: [rowInfo.index, column.id] });
  }

  render() {
    const { value } = this.props;

    const columns = Object.keys(value[0]).map(k => ({
      Header: k,
      accessor: k,
      Cell: cell => {
        // return <span>{JSON.stringify(cell.value)}</span>;
        console.log(cell);
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
        {this.state.focusedPath ? (
          <DefaultRenderer value={get(value, this.state.focusedPath)} />
        ) : (
          ""
        )}
      </div>
    );
  }
}
