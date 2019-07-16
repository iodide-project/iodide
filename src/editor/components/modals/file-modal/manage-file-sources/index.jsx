import React from "react";
import styled from "react-emotion";
import AddNewFileSource from "./add-new-file-source";
import FileSourceList from "./file-source-list";

const FileSourceContainer = styled.div`
  --marg: 20px;
  padding: var(--marg);
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
