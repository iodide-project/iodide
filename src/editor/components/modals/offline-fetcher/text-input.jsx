import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";

const TextInputContainer = styled.div``;
const InputElement = styled.input`
  --marg: 10px;
  display: block;
  margin: 0;
  padding: 0;
  padding: 5px;
  margin-left: var(--marg);
  margin-right: var(--marg);
  width: calc(100% - var(--marg) * 2);
`;

const Label = styled.label`
  display: block;
  margin-left: 15px;
  font-size: 13px;
`;

function TextInput({ label, value, onKey }) {
  const handleChange = evt => {
    onKey(evt.target.value);
  };
  return (
    <TextInputContainer>
      <InputElement type="text" value={value} onChange={handleChange} />
      <Label>{label}</Label>
    </TextInputContainer>
  );
}

TextInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onKey: PropTypes.func
};

export default TextInput;
