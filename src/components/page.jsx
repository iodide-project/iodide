import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import deepEqual from 'deep-equal'

import RawCell from './cell-type-raw'
import ExternalDependencyCell from './cell-type-external-resource'
import CSSCell from './cell-type-css'
import CodeCell from './cell-type-javascript'
import MarkdownCell from './cell-type-markdown'
import PluginDefinitionCell from './cell-plugin-definition'

import NotebookHeader from './notebook-header'

import keyBinding from '../keybindings'
import * as actions from '../actions'


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
  }
  constructor(props) {
    super(props)

    keyBinding()
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

  render() {
    // console.log('Page rendered')
    const bodyContent = this.props.cellIds.map((id, i) => {
      // let id = cell.id
      switch (this.props.cellTypes[i]) {
        case 'code':
        // return <JavascriptCell cellId={id} key={id}/>
          return <CodeCell cellId={id} key={id} />
        case 'markdown':
          return <MarkdownCell cellId={id} key={id} />
        case 'raw':
          return <RawCell cellId={id} key={id} />
        case 'external dependencies':
          return <ExternalDependencyCell cellId={id} key={id} />
        case 'css':
          return <CSSCell cellId={id} key={id} />
        case 'plugin':
          return <PluginDefinitionCell cellId={id} key={id} />
        default:
          // TODO: Use better class for inline error
          return <div>Unknown cell type {this.props.cellTypes[i]}</div>
      }
    })

    return (
      <div
        id="notebook-container"
        className={this.props.viewMode === 'presentation' ? 'presentation-mode' : ''}
      >
        <NotebookHeader />
        <div id="cells" className={this.props.viewMode + (this.props.sidePane ? ' pane-open' : '')}>
          {bodyContent}
        </div>
      </div>
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
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Page)
