import styled from "@emotion/styled";
import THEME from "../../theme";

// NB: the slight margin-bottom is there to accomodate the notebook pane margin size,
// which Golden Layout sets to 5px.
export default styled("div")`
  height: ${THEME.header.height};
  background: ${THEME.header.background};
  display: grid;
  grid-template-columns: [left-start] auto [left-end middle-start] 1fr [middle-end right-start] auto [right-end];
  justify-content: space-between;
  align-items: center;
  margin: 0;
  margin-bottom: ${THEME.header.bottomMargin};
`;
