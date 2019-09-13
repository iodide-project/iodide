import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import CircularProgress from "@material-ui/core/CircularProgress";

const Fader = styled.div`
  cursor: pointer;
  position: absolute;
  width: 100%;
  height: 100%;
  margin: auto;
  display: grid;
  align-content: center;
  justify-content: center;
  opacity: ${({ active }) => (active ? 1 : 0)};
  transform: ${({ active }) => (!active ? "translateY(-5px)" : "none")};
  transition: opacity 200ms, transform 250ms;
`;

function InProgress({ spinning, children }) {
  return (
    <>
      <Fader active={spinning}>
        <CircularProgress size={20} />
      </Fader>
      <Fader active={!spinning}>{children}</Fader>
    </>
  );
}

InProgress.propTypes = {
  spinning: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
};

export default InProgress;
