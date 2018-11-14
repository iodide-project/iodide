import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import { connect } from 'react-redux'

import tasks from '../../actions/task-definitions'

export class TitleUnconnected extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    textColor: PropTypes.string,
    hoverColor: PropTypes.string,
  }
  constructor(props) {
    super(props)
    this.getTitle = this.getTitle.bind(this)
  }

  getTitle() {
    return `${this.props.title || 'New Notebook'} - Iodide`
  }

  render() {
    const elem = (

      <div className="title-field">
        <div className={`title-field-contents ${this.props.additionalContainerClasses}`}>
          <Helmet title={this.getTitle()} />

          <input
            className={`page-title ${this.props.titleInputClasses}`}
            value={this.props.title || ''}
            placeholder="new notebook"
            onChange={(evt) => {
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
    additionalContainerClasses: '',
    titleInputClasses: state.title === undefined ? 'unrendered-title' : '',
  }
}

export default connect(mapStateToProps)(TitleUnconnected)
