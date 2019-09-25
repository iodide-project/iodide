import styled from "@emotion/styled";

export default styled("div")`
  background-color: lightyellow;
  padding: 5px;
  border-bottom: darkgrey solid 1px;
  font-size: 14px;

  a {
    color: #0366d6;
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  a:active,
  a:hover {
    outline-width: 0;
  }
`;
