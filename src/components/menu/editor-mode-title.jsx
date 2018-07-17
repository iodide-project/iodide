import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import { connect } from 'react-redux'

import tasks from '../../actions/task-definitions'

export class TitleUnconnected extends React.Component {
  static propTypes = {
    pageMode: PropTypes.oneOf(['COMMAND_MODE', 'EDIT_MODE', 'APP_MODE']),
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
    if (this.props.pageMode === 'APP_MODE') tasks.changeMode.callback('command')
  }

  onFocus() {
    if (!this.props.pageMode !== 'APP_MODE') {
      tasks.changeMode.callback('APP_MODE')
    }
  }

  getTitle() {
    if (this.props.pageMode !== 'APP_MODE') {
      return `${this.props.title || 'New Notebook'} - Iodide`
    }
    return undefined
  }

  render() {
    const elem = (

      <div className="title-field">
        <div className={`title-field-contents ${this.props.additionalContainerClasses}`}>
          <Helmet title={this.getTitle()} />

          <input
            onBlur={this.onBlur}
            onClick={this.onFocus}
            className={`page-title ${this.props.titleInputClasses}`}
            value={this.props.title || ''}
            placeholder="new notebook"
            onChange={(evt) => {
              tasks.changeMode.callback('APP_MODE');
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
    additionalContainerClasses: state.mode !== 'APP_MODE' ? 'unselected-title-field' : '',
    titleInputClasses: state.title === undefined ? 'unrendered-title' : '',
  }
}

export default connect(mapStateToProps)(TitleUnconnected)
