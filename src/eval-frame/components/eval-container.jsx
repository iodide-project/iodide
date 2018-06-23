import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import deepEqual from 'deep-equal'

import RawOutput from './outputs/raw-output'
import ExternalDependencyOutput from './outputs/external-resource-output'
import CSSOutput from './outputs/css-output'
import CodeOutput from './outputs/code-output'
import MarkdownOutput from './outputs/markdown-output'
import PluginDefinitionOutput from './outputs/plugin-definition-output'

import { initializeDefaultKeybindings } from '../keybindings'
import * as actions from '../actions/actions'

class EvalContainer extends React.Component {
  static propTypes = {
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    title: PropTypes.string,
    cellIds: PropTypes.array,
    cellTypes: PropTypes.array,
  }
  constructor(props) {
    super(props)

    initializeDefaultKeybindings()
    this.getPageWidth = this.getPageWidth.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps)
  }

  getPageWidth() {
    let width = '100%'
    if (this.props.viewMode === 'presentation') width = 'undefined'
    else if (this.props.sidePane) width = `calc(100% - ${this.props.sidePaneWidth}px)`
    return { width }
  }

  render() {
    const bodyContent = this.props.cellIds.map((id, i) => {
      switch (this.props.cellTypes[i]) {
        case 'code':
          return <CodeOutput cellId={id} key={id} />
        case 'markdown':
          return <MarkdownOutput cellId={id} key={id} />
        case 'raw':
          return <RawOutput cellId={id} key={id} />
        case 'external dependencies':
          return <ExternalDependencyOutput cellId={id} key={id} />
        case 'css':
          return <CSSOutput cellId={id} key={id} />
        case 'plugin':
          return <PluginDefinitionOutput cellId={id} key={id} />
        default:
          // TODO: Use better class for inline error
          return <div>Unknown cell type {this.props.cellTypes[i]}</div>
      }
    })

    return (
      <div
        id="eval-container"
        className={this.props.viewMode === 'presentation' ? 'presentation-mode' : ''}
      >
        <div
          id="cells"
          className={this.props.viewMode}
          style={this.getPageWidth()}
        >
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
    sidePaneWidth: state.sidePaneWidth,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(EvalContainer)
