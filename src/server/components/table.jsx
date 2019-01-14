import styled from "react-emotion";

export default styled("table")`
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;

  margin-top: 20px;

  td,
  th,
  tr {
    margin: 0px;
    border: none;
    border-spacing: 0;
    border-collapse: collapse;
    font-size: 0.8125rem;
  }

  th {
    font-weight: 900;
    text-transform: uppercase;
  }

  td,
  th {
    display: table-cell;
    text-align: left;
    padding: 4px 56px 4px 24px;
    border-bottom: 1px solid rgb(224, 224, 224);
  }

  a {
    text-decoration: none;
    color: black;
  }

  a:hover {
    text-decoration: underline;
  }

  tr {
    border-bottom: 1px solid gray;
    height: 48px;
  }
`;
