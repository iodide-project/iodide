import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import deepEqual from 'deep-equal'

import RawCell from './cell-type-raw'
import ExternalDependencyCell from './cell-type-external-resource'
import CSSCell from './cell-type-css'
import JsCell from './cell-type-javascript'
import MarkdownCell from './cell-type-markdown'

import { NotebookHeader } from './notebook-header'

import settings from '../settings'
import keyBinding from '../keybindings'
import actions from '../actions'


const { AUTOSAVE } = settings.labels

class Page extends React.Component {
  constructor(props) {
    super(props)
    // this.props.actions.newNotebook()
    this.enterCommandModeOnClickOutOfCell = this.enterCommandModeOnClickOutOfCell.bind(this)

    keyBinding('jupyter', this)
    setInterval(() => {
      // clear whatever notebook is defined w/ "AUTOSAVE " as front tag
      const notebooks = Object.keys(localStorage)
      const autos = notebooks.filter(n => n.includes(AUTOSAVE))
      if (autos.length) {
        autos.forEach((n) => {
          this.props.actions.deleteNotebook(n)
        })
      }
      this.props.actions.saveNotebook(
        AUTOSAVE + (this.props.title === undefined ? 'new notebook' : this.props.title),
        true,
      )
    }, 1000 * 60)
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps)
  }

  enterCommandModeOnClickOutOfCell(e) {
    // check whther the click is (1) directly in div#cells (2) in any element
    // contained in the notebook header
    if (e.target.id.includes('cells') ||
        document.querySelector('.notebook-header').contains(e.target)) {
      if (this.props.mode !== 'command') this.props.actions.changeMode('command')
    }
  }

  render() {
    const bodyContent = this.props.cellIds.map((id, i) => {
      // let id = cell.id
      switch (this.props.cellTypes[i]) {
        case 'javascript':
        // return <JavascriptCell cellId={id} key={id}/>
          return <JsCell cellId={id} key={id} />
        case 'markdown':
          return <MarkdownCell cellId={id} key={id} />
        case 'raw':
          return <RawCell cellId={id} key={id} />
        case 'external dependencies':
          return <ExternalDependencyCell cellId={id} key={id} />
        case 'css':
          return <CSSCell cellId={id} key={id} />
        default:
          // TODO: Use better class for inline error
          return <div>Unknown cell type {this.props.cellTypes[i]}</div>
      }
    })

    return (
      <div
        id="notebook-container"
        className={this.props.viewMode === 'presentation' ? 'presentation-mode' : ''}
        onMouseDown={this.enterCommandModeOnClickOutOfCell}
      >
        <NotebookHeader />
        <div id="cells" className={this.props.viewMode}>
          {bodyContent}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    mode: state.mode,
    cellIds: state.cells.map(c => c.id),
    cellTypes: state.cells.map(c => c.cellType),
    viewMode: state.viewMode,
    title: state.title,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Page)
