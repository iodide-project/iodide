import React from "react";
import styled from "@emotion/styled";

const FileFooter = styled.footer`
  align-self: end;
`;

export default () => (
  <FileFooter>
    These files can be loaded by{" "}
    <a href="https://iodide-project.github.io/docs/iomd/#fetch-chunks-fetch">
      fetch chunks
    </a>{" "}
    and manipulated via the{" "}
    <a href="https://iodide-project.github.io/docs/api/#iodidefile">file API</a>
    .
  </FileFooter>
);
