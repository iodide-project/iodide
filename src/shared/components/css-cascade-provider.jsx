import React from "react";
import PropTypes from "prop-types";
import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";

const styleNode = document.createElement("style");
styleNode.id = "insertion-point-jss";
document.head.insertBefore(styleNode, document.head.firstChild);

// Configure JSS
const jss = create(jssPreset());
jss.options.createGenerateClassName = createGenerateClassName;
jss.options.insertionPoint = document.getElementById("insertion-point-jss");

const CSSCascadeProvider = ({ children }) => {
  return <JssProvider jss={jss}>{children}</JssProvider>;
};
CSSCascadeProvider.propTypes = {
  children: PropTypes.element
};
export default CSSCascadeProvider;
