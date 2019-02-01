import styled from "react-emotion";

export default styled("div")`
  box-sizing: content-box;
  padding: 5px;
  text-align: center;
  grid-column: ${props =>
    props.side ? `${props.side}-gutter` : "left-gutter"};
  min-width: 20px;
  display: grid;
`;
