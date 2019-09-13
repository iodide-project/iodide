import styled from "@emotion/styled";
import THEME from "../../theme";

export default styled("div")`
  grid-column: left;
  margin-left: ${THEME.header.left.leftMargin};
  display: flex;
  align-items: center;
  min-width: 300px;
  min-width: ${THEME.header.left.minWidth};
`;
