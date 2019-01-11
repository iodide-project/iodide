import PropTypes from "prop-types";
import React from "react";

import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import IodideLogo from "../../shared/iodide-logo";
import UserMenu from "../../shared/user-menu";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#000000" // '#004d40',
    },
    secondary: {
      main: "#00796b"
    }
  }
});

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class Header extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <MuiThemeProvider theme={theme}>
          <AppBar color="primary" position="static">
            <div>
              <Toolbar variant="dense">
                <div className={classes.flex}>
                  <IodideLogo target="_self" backLink="/" />
                </div>
                <UserMenu
                  isAuthenticated={
                    this.props.userInfo && this.props.userInfo.name
                  }
                  username={this.props.userInfo.name}
                  avatar={this.props.userInfo.avatar}
                  refreshOnLoginLogout
                />
              </Toolbar>
            </div>
          </AppBar>
        </MuiThemeProvider>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
