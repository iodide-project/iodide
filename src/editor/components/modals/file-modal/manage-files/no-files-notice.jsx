import React from "react";
import styled from "@emotion/styled";

const NoFilesNotice = styled.span`
  align-items: center;
  color: #666;
  display: grid;
  font-size: 1.5em;
  font-weight: bold;
  height: 100%;
  text-align: center;
`;

export default () => (
  <NoFilesNotice>No files are attached to this notebook</NoFilesNotice>
);
