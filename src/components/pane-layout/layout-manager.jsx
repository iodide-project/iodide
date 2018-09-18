import React from 'react'
import { connect } from 'react-redux'

import GoldenLayout from 'golden-layout'

const config = {
  settings: {
    showPopoutIcon: false,
    showCloseIcon: false,
    showMaximiseIcon: false,
  },
  dimensions: {
    dragProxyWidth: 300,
    dragProxyHeight: 0,
  },
  content: [{
    type: 'row',
    content: [
      {
        type: 'column',
        content: [
          {
            title: 'Editor',
            type: 'react-component',
            component: 'Positioner',
            props: { positionerId: 'EditorPositioner' },
            isClosable: false,
          },
          {
            type: 'stack',
            content: [
              {
                title: 'Console',
                type: 'react-component',
                component: 'Positioner',
                props: { positionerId: 'ConsolePositioner' },
                isClosable: false,
              },
              {
                title: 'Workspace',
                type: 'react-component',
                component: 'Positioner',
                props: { positionerId: 'WorkspacePositioner' },
                isClosable: false,
              },
              {
                title: 'App Info',
                type: 'react-component',
                component: 'Positioner',
                props: { positionerId: 'AppInfoPositioner' },
                isClosable: false,
              },
            ],
          },
        ],
      },
      {
        title: 'Report',
        type: 'react-component',
        component: 'Positioner',
        props: { positionerId: 'ReportPositioner' },
        isClosable: false,
      },
    ],
  }],
}

class Positioner extends React.Component {
  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
        id={this.props.positionerId}
        className="layout-positioner"
      />
    )
  }
}

const positionerDefaults = {
  display: 'none', top: 0, left: 0, width: 0, height: 0,
}

function updateLayoutPositions(layout) {
  const panePositions = {
    EditorPositioner: Object.assign({}, positionerDefaults),
    ReportPositioner: Object.assign({}, positionerDefaults),
    ConsolePositioner: Object.assign({}, positionerDefaults),
    WorkspacePositioner: Object.assign({}, positionerDefaults),
    AppInfoPositioner: Object.assign({}, positionerDefaults),
  }

  layout._getAllContentItems() // eslint-disable-line no-underscore-dangle
    .filter(c => c.isComponent && !c.container.isHidden)
    .forEach((c) => {
      const rect = c.element[0].getBoundingClientRect()
      panePositions[c.config.props.positionerId] = {
        display: 'block',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }
    })

  console.log(panePositions)
  return {
    type: 'UPDATE_PANE_POSITIONS',
    panePositions,
  }
}

export class LayoutManagerUnconnected extends React.PureComponent {
  constructor(props) {
    super(props)
    this.layoutDiv = React.createRef()
    this.state = {
      goldenLayout: null,
      goldenLayoutResizer: null,
    }
  }

  componentDidMount() {
    // if (div && !this.state.goldenLayout) {
    const layout = new GoldenLayout(config, this.layoutDiv.current)
    layout.registerComponent('Positioner', Positioner)
    layout.init()
    layout.on('initialised', () => {
      if (this.state.goldenLayout === layout) return

      const goldenLayoutResizer = () => {
        layout.updateSize()
      }

      window.addEventListener('resize', goldenLayoutResizer)
      this.setState({
        goldenLayout: layout,
        goldenLayoutResizer,
      })
    })
    layout.on('stateChanged', () => {
      console.log(layout.toConfig())
      this.props.updateLayoutPositions(layout)
    })
    // }
  }

  componentDidUpdate() {
    this.state.goldenLayout.updateSize()
  }

  componentWillUnmount() {
    if (this.state.goldenLayout != null) {
      this.state.goldenLayout.destroy()
      window.removeEventListener('resize', this.state.goldenLayoutResizer)
    }
  }

  render() {
    return (
      <div
        ref={this.layoutDiv}
        className="layout-manager"
        style={{
          height: '100%',
        }}
      />
    )
  }
}

export function mapStateToProps(state) {
  return { viewMode: state.viewMode }
}

export function mapDispatchToProps(dispatch) {
  return {
    updateLayoutPositions: layout => dispatch(updateLayoutPositions(layout)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutManagerUnconnected)
