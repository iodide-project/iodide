import React from "react";
import PropTypes from "prop-types";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import Tooltip from "@material-ui/core/Tooltip";

export default class NotebookIconMenu extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  constructor(props) {
    super(props);
    this.state = {
      anchorElement: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleIconButtonClose = this.handleIconButtonClose.bind(this);
  }

  handleClick(event) {
    this.setState({ anchorElement: event.currentTarget });
  }

  handleIconButtonClose() {
    this.setState({ anchorElement: null });
    document
      .querySelectorAll('div[class^="MuiBackdrop-"]')
      .forEach(backdrop => {
        backdrop.click();
      });
  }

  render() {
    const { anchorElement } = this.state;
    const children = React.Children.map(
      this.props.children.filter(c => c),
      c => React.cloneElement(c, { onClick: this.handleIconButtonClose })
    );
    return (
      <Tooltip classes={{ tooltip: "iodide-tooltip" }} title="Menu">
        <React.Fragment>
          <Menu
            id="main-menu"
            anchorEl={document.getElementById("editor-mode-controls")}
            open={Boolean(anchorElement)}
            onClose={this.handleIconButtonClose}
            anchorReference="anchorPosition"
            anchorPosition={{ top: 50, left: 0 }}
          >
            {children}
          </Menu>
          <IconButton
            aria-label="more"
            aria-owns={anchorElement ? "main-menu" : null}
            aria-haspopup="true"
            onClick={this.handleClick}
            style={{ color: "white" }}
            classes={{ root: "editor-icon-menu" }}
          >
            <MenuIcon />
          </IconButton>
        </React.Fragment>
      </Tooltip>
    );
  }
}
