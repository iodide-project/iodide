import styled from "@emotion/styled";
import PropTypes from "prop-types";
import THEME from "../../../../shared/theme";

const ConsoleContainer = styled("div")`
  display: grid;
  grid-template-columns:
    [left-gutter] 30px
    [body] 1fr;
  align-items: baseline;
  min-height: 20px;
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
  align-items: start;
  color: ${props => props.textColor || THEME.client.pane.defaultTextColor};
  background-color: ${props =>
    props.backgroundColor || THEME.client.pane.backgroundColor};
`;

ConsoleContainer.propTypes = {
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string
};

export default ConsoleContainer;
