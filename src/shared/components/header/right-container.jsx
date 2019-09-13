import styled from "@emotion/styled";
import THEME from "../../theme";

export default styled("div")`
  grid-column: right;
  display: flex;
  justify-content: flex-end;
  margin-right: ${THEME.header.right.rightMargin};
  min-width: ${THEME.header.right.minWidth};
`;
