import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import { MUI_INPUT_STYLES } from "../shared/constants";

function TextInput({ isValid, label, value, onKey, classes }) {
  const handleChange = event => {
    const text = event.target.value;
    onKey(text);
  };
  return (
    <TextField
      error={!isValid}
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
  isValid: PropTypes.bool,
  onKey: PropTypes.func,
  classes: PropTypes.objectOf(PropTypes.string)
};

export default withStyles(MUI_INPUT_STYLES)(TextInput);
