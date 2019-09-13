import styled from "@emotion/styled";
// fixme should this be in "shared" or should the name be specified as ConsoleIcon or something?
const BaseIcon = (icon, style = {}) => styled(icon)`
  width: 14px;
  height: 14px;
  text-align: center;
  display: block;
  opacity: ${style.opacity || 1};
  color: ${style.color || "black"};
`;

export default BaseIcon;
