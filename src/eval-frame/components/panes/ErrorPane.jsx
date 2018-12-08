/* eslint-disable class-methods-use-this */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'

import {
  loadAutosave,
  saveNotebookToServer,
} from '../../../actions/actions'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});


class ErrorPane extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    errorInfo: PropTypes.object.isRequired,
  }

  render() {
    const { error, errorInfo } = this.props
    const { classes } = this.props;
    return (
      <div style={{
        zIndex: 100,
        margin: '150px',
      }}
      >
        <p>
          The kernel has encountered the following error:
          <br />
          <h1>{error.toString()}</h1>
          {errorInfo.componentStack}
          <br />
          <h3>
            Please file an <a href="https://github.com/iodide-project/iodide/issues">issue</a> and we will get right to fixing it.
            You can still save your changes to the editor.
          </h3>
        </p>
        <Button onClick={this.props.saveNotebook} color="primary" variant="contained" className={classes.button} >
          Save
        </Button>
        <Button onClick={this.props.loadAutosave} color="secondary" variant="contained" >
          Reload
        </Button>
        <h3>{this.props.reportOnly}</h3>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadAutosave: () => {
      dispatch(loadAutosave())
    },
    saveNotebook: () => {
      dispatch(saveNotebookToServer())
    },
  }
}

export default withStyles(styles)(connect(null, mapDispatchToProps)(ErrorPane));

