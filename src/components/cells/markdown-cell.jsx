import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import CellRow from './cell-row';
import { CellContainer } from './cell-container';

import CellEditor from './cell-editor';

import * as actions from '../../actions/actions';
import { getCellById } from '../../tools/notebook-utils';


export class MarkdownCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.string,
    showMarkdown: PropTypes.bool.isRequired,
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
  }

  enterEditMode = () => {
    if (this.props.viewMode === 'editor') {
      this.props.actions.changeMode('edit');
      this.props.actions.markCellNotRendered();
    }
  }

  render() {
    let resultDisplayStyle;
    let editorDisplayStyle;
    if (this.props.showMarkdown) {
      resultDisplayStyle = 'block';
      editorDisplayStyle = 'none';
    } else {
      resultDisplayStyle = 'none';
      editorDisplayStyle = 'block';
    }

    return (
      <CellContainer cellId={this.props.cellId}>
        <CellRow cellId={this.props.cellId} rowType="input">
          <CellEditor
            cellId={this.props.cellId}
            containerStyle={{ display: editorDisplayStyle }}
            editorOptions={{
              lineWrapping: true,
              matchBrackets: false,
              autoCloseBrackets: false,
              lineNumbers: false,
            }}
          />
        </CellRow>
        <CellRow cellId={this.props.cellId} rowType="output">
          <div
            className="user-markdown"
            onDoubleClick={this.enterEditMode}
            style={{ display: resultDisplayStyle }}
            dangerouslySetInnerHTML={{ __html: this.props.value }} // eslint-disable-line
          />
        </CellRow>
      </CellContainer>
    );
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId);
  const beingEdited = cell.selected && state.mode === 'edit';
  return {
    value: cell.value,
    showMarkdown: cell.rendered && !beingEdited,
    viewMode: state.viewMode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MarkdownCellUnconnected);
