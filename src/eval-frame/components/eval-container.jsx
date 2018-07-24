import React from 'react'

import CellsList from './cells-list'
import PaneContainer from './panes/pane-container'
import EditorLinkButton from './controls/editor-link-button'

export default class EvalContainer extends React.Component {
  // static propTypes = {
  //   // viewMode: PropTypes.oneOf(['EXPLORE_VIEW', 'REPORT_VIEW']),
  //   // title: PropTypes.string,
  //   cellIds: PropTypes.array,
  //   cellTypes: PropTypes.array,
  // }

  // shouldComponentUpdate(nextProps) {
  //   return !deepEqual(this.props, nextProps)
  // }

  render() {
    return (
      <React.Fragment>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
        }}
        >
          <EditorLinkButton />
        </div>
        <CellsList id="cells" containingPane="REPORT_PANE" />
        <PaneContainer />
      </React.Fragment>
    )
  }
}

// function mapStateToProps(state) {
//   return {
//     cellIds: state.cells.map(c => c.id),
//     cellTypes: state.cells.map(c => c.cellType),
//   }
// }

// export default connect(mapStateToProps)(EvalContainer)
