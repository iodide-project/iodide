import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import styled from "@emotion/styled";

import DropTarget from "../../../components/drop-target";
import THEME from "../../../theme";
import { ContainedButton } from "../../../components/buttons";
import { ModalContainer } from "../../../../editor/components/modals/modal-container";
import { fadeIn } from "../../../keyframes";

const hoverFadeTime = "0.25s";

const FileModalContainer = styled(ModalContainer)`
  font-family: sans-serif;
`;

const FileAppBar = styled(AppBar)`
  background: ${THEME.clientModal.background};
`;

const Title = styled(Typography)`
  /* Use greater specificity than Material to override its default styles */
  #file-manager-modal & {
    color: #fff;
  }
`;

const Body = styled.div`
  overflow: auto;
  padding: 20px;
`;

const VisualTarget = styled.div`
  align-items: center;
  background: #ededed;
  border-radius: 5px;
  border: 3px dashed transparent;
  box-sizing: border-box;
  display: grid;
  height: 150px;
  padding: 20px;
  transition: border ${hoverFadeTime};

  .dragged-over & {
    border: 3px dashed #333;
  }
`;

const VisualTargetContent = styled.div`
  align-content: center;
  align-items: center;
  display: grid;
  grid-gap: 20px;
  justify-items: center;

  &:not(.initial-render) * {
    animation: ${fadeIn} ${hoverFadeTime};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileList = styled.div`
  margin-top: 20px;

  ul {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: 0 -5px;
    padding: 0;
  }

  li {
    animation: ${fadeIn} 0.5s;
    background: #ededed;
    border-radius: 5px;
    border: 1px solid #ccc;
    display: inline;
    margin: 5px;
    padding: 5px;
  }
`;

let completedInitialRender = false;

export default function FileManager() {
  useEffect(() => {
    completedInitialRender = true;
    return function cleanup() {
      completedInitialRender = false;
    };
  }, []);

  const [numHoveredFiles, setNumHoveredFiles] = useState(0);
  const [filenames, setFilenames] = useState([]);
  const fileInput = React.useRef(null);

  const fileCollator = new Intl.Collator("en-US", {
    numeric: true,
    sensitifity: "base"
  });

  function addFilenames(newFilenames) {
    setFilenames(
      filenames
        .concat(newFilenames.filter(fn => !filenames.includes(fn)))
        .sort(fileCollator.compare)
    );
  }

  function onButtonClick() {
    fileInput.current.click();
  }

  function handleButtonFiles(e) {
    addFilenames(Array.from(e.target.files).map(f => f.name));
  }

  function onHoverStart(e) {
    setNumHoveredFiles(e.dataTransfer.items.length);
  }

  function onHoverEnd() {
    setNumHoveredFiles(0);
  }

  function onDrop(e) {
    setNumHoveredFiles(0);
    addFilenames(Array.from(e.dataTransfer.files).map(f => f.name));
  }

  return (
    <FileModalContainer id="file-manager-modal">
      <FileAppBar position="static">
        <Toolbar>
          <Title variant="title">File Manager</Title>
        </Toolbar>
      </FileAppBar>
      <Body>
        <DropTarget
          onHoverStart={onHoverStart}
          onHoverEnd={onHoverEnd}
          onDrop={onDrop}
        >
          <VisualTarget>
            <VisualTargetContent
              className={!completedInitialRender ? "initial-render" : ""}
            >
              {numHoveredFiles === 0 ? (
                <React.Fragment>
                  <ContainedButton onClick={onButtonClick}>
                    Add files
                  </ContainedButton>
                  <HiddenInput
                    ref={fileInput}
                    type="file"
                    onChange={handleButtonFiles}
                    multiple
                  />
                  <span>or drag and drop here</span>
                </React.Fragment>
              ) : (
                <span>Drop to add {numHoveredFiles} files</span>
              )}
            </VisualTargetContent>
          </VisualTarget>
        </DropTarget>
        {filenames.length !== 0 && (
          <FileList>
            <ul>
              {filenames.map(fn => (
                <li key={fn}>{fn}</li>
              ))}
            </ul>
          </FileList>
        )}
      </Body>
    </FileModalContainer>
  );
}
