import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as actions from '../../actions'
import './header.css';
import Logo from '../../assets/images/logo.png';

export class HeaderUnconnected extends Component {
  render() {
    return (
      <div className="header">
        <div>
          <span href="/">
            <img alt="Logo" src={Logo} />
          </span>
          <span className="navbar">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/dj">User</a>
            </li>
            <li>
              <a href="/dj/2">Notebook</a>
            </li>
          </span>
          <button onClick={this.props.actions.login}>Log In</button>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    userData: state.userData,
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderUnconnected)
