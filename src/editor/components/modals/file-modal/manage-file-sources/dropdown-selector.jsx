import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";

import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { MUI_INPUT_STYLES } from "../shared/constants";

export function DropdownInput({ inputID, onChange, value, options, classes }) {
  return (
    <TextField
      select
      fullWidth
      margin="dense"
      variant="outlined"
      classes={classes}
      label="update frequency"
      value={value}
      onChange={onChange}
      inputProps={{
        name: inputID,
        id: inputID
      }}
    >
      {options.map(opt => {
        return (
          <MenuItem key={opt.key} value={opt.key}>
            {opt.label}
          </MenuItem>
        );
      })}
    </TextField>
  );
}

DropdownInput.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  value: PropTypes.string,
  inputID: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.string)
};

export default withStyles(MUI_INPUT_STYLES)(DropdownInput);
