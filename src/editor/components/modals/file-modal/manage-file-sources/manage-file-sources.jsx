import React from "react";
import styled from "@emotion/styled";
import AddNewFileSource from "./add-new-file-source";
import FileSourceList from "./file-source-list";

const FileSourceContainer = styled.div`
  /* this css variable is used in the children of FileSourceContainer */
  padding: 20px;
  overflow: auto;
`;

function ManageFileSources() {
  return (
    <FileSourceContainer>
      <AddNewFileSource />
      <FileSourceList />
    </FileSourceContainer>
  );
}

export default ManageFileSources;
