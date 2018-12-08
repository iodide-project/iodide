/* eslint-disable class-methods-use-this */
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'

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

  handleReload() {
    window.reload()
  }

  handleSave() {

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
        <Button onClick={this.handleSave} color="primary" variant="contained" className={classes.button} >
          Save
        </Button>
        <Button onClick={this.handleReload} color="secondary" variant="contained" >
          Reload
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(ErrorPane);

