import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import deepEqual from 'deep-equal'
import Resizable from 're-resizable'

import CellContainer from './cells/cell-container'
import EvalFrame from './eval-frame'
import NotebookHeader from './menu/notebook-header'
import AppMessages from './app-messages/app-messages'
import FullScreenEditorButton from './full-screen-editor-button'

import { initializeDefaultKeybindings } from '../keybindings'
import * as actions from '../actions/actions'

const AUTOSAVE = 'AUTOSAVE: '

class Page extends React.Component {
  static propTypes = {
    viewMode: PropTypes.oneOf(['EXPLORE_VIEW', 'REPORT_VIEW']),
    actions: PropTypes.shape({
      deleteNotebook: PropTypes.func.isRequired,
      saveNotebook: PropTypes.func.isRequired,
      changeMode: PropTypes.func.isRequired,
    }).isRequired,
    title: PropTypes.string,
    cellIds: PropTypes.array,
    cellTypes: PropTypes.array,
    showFrame: PropTypes.bool,
  }
  constructor(props) {
    super(props)

    initializeDefaultKeybindings()
    this.changeEditorWidth = this.changeEditorWidth.bind(this)
    setInterval(() => {
      // clear whatever notebook is defined w/ "AUTOSAVE " as front tag
      const notebooks = Object.keys(localStorage)
      const autos = notebooks.filter(n => n.includes(AUTOSAVE))
      if (autos.length) {
        autos.forEach((n) => {
          this.props.actions.deleteNotebook(n)
        })
      }
      this.props.actions.saveNotebook(true)
    }, 1000 * 60)
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps)
  }

  changeEditorWidth(width) {
    this.props.actions.changeEditorWidth(width)
  }

  render() {
    const cellInputComponents = this.props.cellIds.map(id =>
      <CellContainer cellId={id} key={id} />)

    return (
      <React.Fragment>
        <NotebookHeader />
        <FullScreenEditorButton />

        <div
          id="panes-container"
        >
          <Resizable
            enable={{
              bottom: false,
              top: false,
              right: this.props.showFrame,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
              left: false,
            }}
            handleClasses={{ right: 'resizer' }}
            maxWidth="100%"
            minWidth={300}
            onResizeStop={(e, direction, ref, d) => {
              this.changeEditorWidth(d.width)
            }}
            size={{ width: this.props.showFrame ? this.props.editorWidth : '100%' }}
            defaultSize={{ height: '100%' }}
            style={{
              display: this.props.viewMode === 'REPORT_VIEW' ||
                !this.props.showEditor ? 'none' : undefined,
            }}
          >
            <div id="cells">
              {cellInputComponents}
            </div>
          </Resizable>
          <div style={{ flexGrow: '1', minWidth: '300px', display: this.props.showFrame ? 'block' : 'none' }}><EvalFrame /></div>
        </div>
        <AppMessages />
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    cellIds: state.cells.map(c => c.id),
    cellTypes: state.cells.map(c => c.cellType),
    viewMode: state.viewMode,
    title: state.title,
    sidePane: state.sidePaneMode,
    sidePaneWidth: state.sidePaneWidth,
    showFrame: state.showFrame,
    showEditor: state.showEditor,
    editorWidth: state.editorWidth,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Page)
