import styled from "react-emotion";
import { sharedProperties } from "../style/base";

export default styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  margin: auto;
  margin-bottom: 80px;
  width: ${sharedProperties.pageWidth}px;
`;
