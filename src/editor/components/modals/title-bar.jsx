import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import styled from "@emotion/styled";

import THEME from "../../../shared/theme";

const TitleBar = styled(AppBar)`
  background: ${THEME.clientModal.background};
`;

const RenderedTitleBar = props => (
  <TitleBar position="static">
    <Toolbar>
      <Typography variant="title" style={{ color: "#fff" }}>
        {props.title}
      </Typography>
    </Toolbar>
  </TitleBar>
);

RenderedTitleBar.propTypes = {
  title: PropTypes.string.isRequired
};

export default RenderedTitleBar;
