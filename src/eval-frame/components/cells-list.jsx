import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'

import CSSOutput from './outputs/css-output'
import CodeOutput from './outputs/code-output'
import MarkdownOutput from './outputs/markdown-output'

class CellsList extends React.Component {
  static propTypes = {
    cellIds: PropTypes.array,
    cellTypes: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.cellListRef = React.createRef()
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps)
  }


  render() {
    return (
      <div
        id={this.props.id}
        className="cells-list"
        style={this.props.style}
        ref={this.cellListRef}
      >
        { this.props.cellIds.map((id, i) => {
          switch (this.props.cellTypes[i]) {
            case 'code':
              return (<CodeOutput
                cellId={id}
                key={id}
              />)
            case 'markdown':
              return <MarkdownOutput cellId={id} key={id} />
            case 'css':
              return <CSSOutput cellId={id} key={id} />
            default:
              // TODO: Use better class for inline error
              return <div>Unknown cell type {this.props.cellTypes[i]}</div>
          }
        })}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const cellsList = state.cells
    .slice()
    .filter(cell => ['code', 'markdown', 'css'].includes(cell.cellType))

  return {
    cellIds: cellsList.map(c => c.id),
    cellTypes: cellsList.map(c => c.cellType),
  }
}

export default connect(mapStateToProps)(CellsList)
