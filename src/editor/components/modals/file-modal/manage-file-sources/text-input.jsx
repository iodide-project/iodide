import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import { MUI_INPUT_STYLES } from "../shared/constants";

function TextInput({ label, value, onKey, classes }) {
  const handleChange = evt => {
    onKey(evt.target.value);
  };
  return (
    <TextField
      label={label}
      type="search"
      classes={{ root: classes.root, input: classes.input }}
      value={value}
      fullWidth
      onChange={handleChange}
      margin="dense"
      variant="outlined"
    />
  );
}

TextInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onKey: PropTypes.func,
  classes: PropTypes.objectOf(PropTypes.object)
};

export default withStyles(MUI_INPUT_STYLES)(TextInput);
