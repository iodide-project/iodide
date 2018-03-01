import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

// import { ToolbarGroup } from 'material-ui/Toolbar'
import { connect } from 'react-redux'

import tasks from '../../task-definitions'

export class TitleUnconnected extends React.Component {
  static propTypes = {
    pageMode: PropTypes.oneOf(['command', 'edit', 'title-edit']),
    title: PropTypes.string,
    textColor: PropTypes.string,
    hoverColor: PropTypes.string,
  }
  constructor(props) {
    super(props)
    this.onBlur = this.onBlur.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.getTitle = this.getTitle.bind(this)
  }

  onBlur() {
    if (this.props.pageMode === 'title-edit') tasks.changeMode('command')
  }

  onFocus() {
    if (!this.props.pageMode !== 'title-edit') {
      tasks.changeMode.callback('title-edit')
    }
  }

  getTitle() {
    if (this.props.pageMode !== 'title-edit') {
      return `${this.props.title || 'New Notebook'} - Iodide`
    }
    return undefined
  }

  render() {
    const elem = (
      <div className="title-field">
        <div className={`title-field-contents ${this.props.pageMode !== 'title-edit' ? 'unselected-title-field' : ''}`}>
          <Helmet title={this.getTitle()} />
          <input
            onBlur={this.onBlur}
            onClick={this.onFocus}
            className={`page-title ${this.props.title === undefined ? 'unrendered-title' : ''}`}
            value={this.props.title || ''}
            placeholder="new notebook"
            onChange={(evt) => {
              tasks.changeMode.callback('title-menu');
              tasks.changeTitle.callback(evt.target.value)
            }}
          />
        </div>
      </div>
    )
    return elem
  }
}

function mapStateToProps(state) {
  return {
    title: state.title,
    pageMode: state.mode,
  }
}

export default connect(mapStateToProps)(TitleUnconnected)
