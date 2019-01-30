import styled from "react-emotion";

export default styled("div")`
  box-sizing: content-box;
  padding: 5px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  grid-column: ${props =>
    props.side ? `${props.side}-gutter` : "left-gutter"};
  min-height: 20px;
  min-width: 20px;
`;
