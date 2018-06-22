import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toolbar from 'material-ui/Toolbar';
import EditorModeControls from './editor-mode-controls';
import ViewControls from './view-controls';

import EditorModeTitle from './editor-mode-title';

export class EditorModeToolbarUnconnected extends React.Component {
  static propTypes = {
    viewMode: PropTypes.string,
  }
  render() {
    return (
      <div
        className="notebook-toolbar-container"
        style={{ display: this.props.viewMode === 'editor' ? 'block' : 'none' }}
      >
        <Toolbar classes={{ root: 'notebook-toolbar' }}>
          <EditorModeControls isFirstChild />
          <EditorModeTitle />
          <ViewControls />
        </Toolbar>
      </div>

    );
  }
}

export function mapStateToProps(state) {
  return { viewMode: state.viewMode };
}

const EditorModeToolbar = connect(mapStateToProps)(EditorModeToolbarUnconnected);
export default EditorModeToolbar;
