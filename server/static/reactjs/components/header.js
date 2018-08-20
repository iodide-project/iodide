import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar';

import AppMessage from './app-message'
import * as actions from '../actions'

export class HeaderUnconnected extends Component {
  render() {
    return (
      <div>
        <Toolbar className='header'>
          <Grid container direction="row" justify="space-around" alignItems="center">
            <Grid item sm={2} xs={1} style={{ textAlign: 'left' }}>
              <a href="/">
                <h3>Iodide</h3>
              </a>
            </Grid>
            <Grid item sm={8} xs={9} className='header-button-container'>
              <Button variant="contained" href="/notebooks/new" className='header-button'>
                New Notebook
              </Button>
              {
                this.props.isLoggedIn ?
                <React.Fragment>
                  <Button
                    variant="contained"
                    href={`/${this.props.userData.name}`}
                    className='header-button'
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="contained"
                    onClick={this.props.actions.logout}
                    className='header-button'
                  >
                    Logout
                  </Button>
                  <Avatar
                    className='header-avatar'
                    alt={this.props.userData.name}
                    src={this.props.userData.avatar}
                  />
                </React.Fragment>
                :
                <Button
                  variant="contained"
                  onClick={this.props.actions.login}
                  className='header-button'>
                  Log In
                </Button>
              }
            </Grid>
          </Grid>
        </Toolbar>
        <AppMessage />
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    isLoggedIn: Boolean(state.userData.name),
    userData: state.userData,
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderUnconnected)
