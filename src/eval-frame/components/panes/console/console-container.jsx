import styled from "react-emotion";
import THEME from "../../../../shared/theme";

export default styled("div")`
  font-family: monospace;
  display: grid;
  grid-template-columns:
    [left-gutter] 30px
    [body] 1fr
    [right-gutter] 30px
    [deadspace] 0px;
  align-items: baseline;
  min-height: 20px;
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
  align-items: stretch;
  color: ${props => props.textColor || THEME.client.pane.defaultTextColor};
  background-color: ${props =>
    props.backgroundColor || THEME.client.pane.backgroundColor};
`;
