import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import FormHelperText from "@material-ui/core/FormHelperText";

const TextInputContainer = styled.div``;
const InputElement = styled.input`
  display: block;
  margin: 0;
  padding: 0;
  padding: 5px;
  width: 100%;
`;

function TextInput({ label, value, onKey }) {
  const handleChange = evt => {
    onKey(evt.target.value);
  };
  return (
    <TextInputContainer>
      <InputElement type="text" value={value} onChange={handleChange} />
      <FormHelperText>{label}</FormHelperText>
    </TextInputContainer>
  );
}

TextInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onKey: PropTypes.func
};

export default TextInput;
