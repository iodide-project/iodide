import React from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import UserTask from "../../user-tasks/user-task";
import ExternalLinkTask from "../../user-tasks/external-link-task";

export default class NotebookMenuItem extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    submenuOnClick: PropTypes.func,
    task: PropTypes.oneOfType([
      PropTypes.instanceOf(UserTask),
      PropTypes.instanceOf(ExternalLinkTask)
    ])
  };

  constructor(props) {
    super(props);
    this.extraMenuProps = {};
    Object.keys(this.props).forEach(k => {
      if (!["task", "submenuOnClick", "onClick"].includes(k)) {
        this.extraMenuProps[k] = this.props[k];
      }
    });
  }

  static muiName = "MenuItem";

  render() {
    return (
      <MenuItem
        {...this.extraMenuProps}
        classes={{ root: "iodide-menu-item" }}
        key={this.props.task.title}
        onClick={() => {
          this.props.task.callback();
          if (this.props.onClick) this.props.onClick();
          if (this.props.submenuOnClick) this.props.submenuOnClick();
          document
            .querySelectorAll('div[class^="MuiBackdrop-"]')
            .forEach(backdrop => {
              backdrop.click();
            });
        }}
      >
        <ListItemText
          classes={{ root: "primary-menu-item" }}
          primary={this.props.task.menuTitle}
        />
        <ListItemText
          style={{ marginRight: 5 }}
          classes={{ root: "secondary-menu-item" }}
          primary={
            this.props.task.displayKeybinding || this.props.task.secondaryText
          }
        />
      </MenuItem>
    );
  }
}
