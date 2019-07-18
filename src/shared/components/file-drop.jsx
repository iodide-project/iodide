import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "react-emotion";
import { keyframes } from "emotion";

const FileDropArea = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  transform: ${({ isDragging }) => (isDragging ? "none" : "translateX(100vw)")};
  background-color: rgba(0, 0, 0, 0.3);
  mix-blend-mode: difference;
  opacity: ${({ isDragging }) => (isDragging ? 1 : 0)};
  transition: opacity 500ms;
  display: grid;
  align-items: center;
  justify-items: center;
  color: white;
  font-size: 40px;
  font-weight: 900;
`;

const CutoutThing = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;
  transition: transform 400ms;
  transform: ${({ isDragging }) => (isDragging ? "scale(1)" : "scale(.9)")};
`;

const preventDefaults = event => {
  event.preventDefault();
  event.stopPropagation();
};

const onDragEnter = (setDragStatus, setCandidateFiles) => event => {
  preventDefaults(event);
  const dt = event.dataTransfer;
  const { files } = dt;
  setDragStatus(true);
  setCandidateFiles(files);
};

const onDragOver = event => {
  preventDefaults(event);
};

const onDragLeave = (setDragStatus, setCandidateFile) => event => {
  preventDefaults(event);
  setDragStatus(false);
  setCandidateFile(undefined);
};

const onFileDrop = (onDrop, setCandidateFile, setDragStatus) => event => {
  preventDefaults(event);
  onDrop(event.dataTransfer.files);
  setCandidateFile(undefined);
  setDragStatus(false);
};

function FileDrop({ shrinkTarget, onDrop }) {
  const [isDragging, setDragStatus] = useState(false);
  const dragElement = useRef(null);
  const [candidates, setCandidateFile] = useState(undefined);
  const ODE = onDragEnter(setDragStatus, setCandidateFile);
  const ODL = onDragLeave(setDragStatus, setCandidateFile);
  const DROP = onFileDrop(onDrop, setCandidateFile, setDragStatus);

  useEffect(() => {
    window.addEventListener("dragenter", ODE, false);
    window.addEventListener("dragover", onDragOver);
    dragElement.current.addEventListener("dragleave", ODL, false);
    window.addEventListener("drop", DROP, false);
    return () => {
      document.body.removeEventListener("dragenter", ODE);
      window.removeEventListener("dragover", onDragOver);
      dragElement.current.removeEventListener("dragleave", ODL, false);
      dragElement.current.removeEventListener("drop", DROP);
    };
  }, []);

  useEffect(() => {
    const transitionTime = 300;
    const half = transitionTime / 2;
    const transition = `${transitionTime}ms`;
    const target = document.getElementById(shrinkTarget);
    if (target) {
      if (isDragging) {
        target.style.transition = `transform ${transition}, box-shadow ${half}ms cubic-bezier(0.075, 0.82, 0.165, 1)`;
        target.style.transform = "scale(.985)";
        target.style.boxShadow = "0px 0px 100px rgba(0,0,0,.8)";
      } else {
        target.style.transform = "none";
        target.style.boxShadow = "none";
      }
    }
  });
  const str = "explore these files in a notebook";

  return ReactDOM.createPortal(
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        transform: isDragging ? "none" : "translateX(100vw)",
        zIndex: 10000
      }}
      ref={dragElement}
    >
      <FileDropArea isDragging={isDragging}>
        <CutoutThing isDragging={isDragging}>{str}</CutoutThing>
      </FileDropArea>
    </div>,
    document.body
  );
}

FileDrop.propTypes = {
  children: PropTypes.string,
  onDrop: PropTypes.func
};

export default FileDrop;
