import styled from "react-emotion";

export default styled("div")`
  display: grid;
  grid-template-columns:
    [left-gutter] 30px
    [body] 1fr
    [right-gutter] 30px;
  align-items: baseline;
  min-height: 20px;
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
`;
