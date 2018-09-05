import PropTypes from 'prop-types';
import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: props.userInfo && props.userInfo.name };
  }

  login() {
    const url = '/oauth/login/github'
    const name = 'github_login'
    const specs = 'width=500,height=600'
    const authWindow = window.open(url, name, specs)
    authWindow.focus()

    window.loginSuccess = () => {
      this.setState({ isLoggedIn: true })
    }
    window.loginFailure = () => {
      // do something smart here (probably pop up a notification)
    }
  }

  logout() {
    fetch('/logout/')
      .then((response) => {
        if (response.ok) {
          this.setState({ isLoggedIn: false })
        } else {
          // do something smart here (probably pop up a notification)
        }
      });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Iodide
            </Typography>
            {
              this.state.isLoggedIn && (
                <React.Fragment>
                  <Button
                    variant="contained"
                    className="header-button"
                    onClick={() => this.logout()}
                  >
                    Logout
                  </Button>
                </React.Fragment>
              )
            }
            {
              !this.state.isLoggedIn && (
                <Button
                  variant="contained"
                  className="header-button"
                  href={`/oauth/login/github/?next=${window.location.pathname}`}
                >
                  Log In
                </Button>
              )
            }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
