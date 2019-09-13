import styled from "@emotion/styled";
import THEME from "../../theme";

export const ElementTitle = styled("h3")`
  font-weight: 300;
  margin: 0;
  padding: calc(var(--element-pad) * 3) calc(var(--element-pad) * 2)
    calc(var(--element-pad)) calc(var(--element-pad) * 3);
  border-bottom: 1px solid grainsboro;
  margin-bottom: var(--element-pad);
`;

export default styled("div")`
  border: 1px solid var(--element-border);
  border-radius: 5px;
  background: ${THEME.elementBackground};
  color: var(--element-color);
  transition: 300ms;

  :hover {
    box-shadow: 2px 2px 0px rgba(104, 40, 96, 0.1);
  }
`;
