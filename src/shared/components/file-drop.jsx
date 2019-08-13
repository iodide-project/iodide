import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "react-emotion";

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

const onDragEnterCreator = (setDragStatus, setCandidateFiles) => event => {
  preventDefaults(event);
  const dt = event.dataTransfer;
  const { files } = dt;
  setDragStatus(true);
  setCandidateFiles(files);
};

const onDragOver = event => {
  preventDefaults(event);
};

const onDragLeaveCreator = (setDragStatus, setCandidateFile) => event => {
  preventDefaults(event);
  setDragStatus(false);
  setCandidateFile(undefined);
};

const onFileDropCreator = (
  onDrop,
  setCandidateFile,
  setDragStatus
) => event => {
  preventDefaults(event);
  onDrop(event.dataTransfer.files);
  setCandidateFile(undefined);
  setDragStatus(false);
};

// In this demo, FileDrop has a shrinkTarget, which I used for the animation
// that shrinks down the window. This is not necessary in the actual
// implementation, so feel free to ditch it.
function FileDrop({ shrinkTarget, onDrop }) {
  const [isDragging, setDragStatus] = useState(false);
  const dragElement = useRef(null);
  // atm candidates and setCandidateFile aren't really used I think, since
  // I didn't add the interstitial that would show the candidate files
  // being loaded.
  const [candidates, setCandidateFile] = useState(undefined);
  const onDragEnter = onDragEnterCreator(setDragStatus, setCandidateFile);
  const onDragLeave = onDragLeaveCreator(setDragStatus, setCandidateFile);
  const onFileDrop = onFileDropCreator(onDrop, setCandidateFile, setDragStatus);

  // this useEffect runs when the component is initially mounted.
  // In this particular example, we'll add the event listeners to
  // window itself instead of a particular element.
  // The idea is the dragElement pops into place when onDragEnter is fired,
  // and once it is available, you want to listen for dragleave on
  // the dragElement (since it takes up the whole window).

  // this is probably substantially easier if you're only allowing the drag and
  // drop on an individual element vs. the entire window, so I would update this
  // accordingly.
  useEffect(() => {
    window.addEventListener("dragenter", onDragEnter, false);
    window.addEventListener("dragover", onDragOver);
    dragElement.current.addEventListener("dragleave", onDragLeave, false);
    window.addEventListener("drop", onFileDrop, false);
    return () => {
      document.body.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      dragElement.current.removeEventListener("dragleave", onDragLeave, false);
      dragElement.current.removeEventListener("drop", onFileDrop);
    };
  }, []);

  // This is used primarily to transition the shrinkTarget.
  // It is not by any means necessary in the actual version, but here is
  // how one might attempt to animate something.
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
  // This may also not be necessary, depending on how you approach
  // the implementation of the drag and drop functionality. Here,
  // we actually use ReactDOM.createPortal to inject outside of the
  // immediate DOM tree another element. This is also how modals
  // are typically built in React. You'll notice that we set the transform
  // to 100vw off to the right, and then pop it into place if isDragging.
  // There are other ways of achieving this effect.

  // And of course, you're free to ignore using ReactDOM.createPortal if you
  // choose to keep the drag-and-drop over an element area.
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
