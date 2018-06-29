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
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
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

  render() {
    const cellInputComponents = this.props.cellIds.map((id, i) => {
      let editorOptions
      switch (this.props.cellTypes[i]) {
        case 'code':
        case 'external dependencies':
        case 'css':
          editorOptions = {}
          break

        case 'markdown':
          editorOptions = {
            lineWrapping: true,
            matchBrackets: false,
            autoCloseBrackets: false,
            lineNumbers: false,
          }
          break

        case 'raw':
        case 'plugin':
          editorOptions = {
            matchBrackets: false,
            autoCloseBrackets: false,
          }
          break

        default:
          editorOptions = {}
      }

      return <CellContainer cellId={id} key={id} editorOptions={editorOptions} />
    })

    const resizerStyle = this.props.viewMode === 'presentation' ? { display: 'none' } : {}

    return (
      <React.Fragment>
        <NotebookHeader />
        <div
          id="panes-container"
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: 'calc(100% - 50px)',
          }}
        >
          <Resizable
            enable={{
              bottom: false,
              top: false,
              right: true,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
              left: false,
            }}
            handleClasses={{ right: 'resizer' }}
            maxWidth="100%"
            minWidth={300}
            defaultSize={{ width: '60%', height: '100%' }}
            style={resizerStyle}
          >
            <div id="cells">
              {cellInputComponents}
              <FullScreenEditorButton />
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
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Page)
