import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "@emotion/styled";

import StackItem from "./error-stack-item";

const ErrorStackWrapper = styled("pre")`
  margin: 0;
`;

export const ErrorStackRendererUnconnected = ({ message, name, stack }) => {
  return (
    <ErrorStackWrapper>
      {name}: {message}
      {"\n"}
      {stack.map(stackItem => (
        <StackItem key={JSON.stringify(stackItem)} stackItem={stackItem} />
      ))}
    </ErrorStackWrapper>
  );
};

ErrorStackRendererUnconnected.propTypes = {
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  stack: PropTypes.arrayOf(PropTypes.object)
};

export function mapStateToProps(state, ownProps) {
  const { evalId } = ownProps;
  const { name, message, stack } = state.tracebackInfo.evalErrorStacks[evalId];
  return {
    name,
    message,
    stack
  };
}

export default connect(mapStateToProps)(ErrorStackRendererUnconnected);
