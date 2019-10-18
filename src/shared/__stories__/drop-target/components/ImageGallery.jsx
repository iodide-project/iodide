import React, { useState } from "react";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "@emotion/styled";

import DropTarget from "../../../components/drop-target";
import THEME from "../../../theme";
import { fadeIn, bounce } from "../../../keyframes";

const Overlay = styled.div`
  animation: ${fadeIn} 0.25s;
  background: ${THEME.header.backgroundLeft};
  font-family: sans-serif;
  z-index: 10;

  /* Expand to fill the Storybook iframe */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  &.inactive {
    display: none;
  }
`;

const OverlayContent = styled.div`
  align-items: center;
  color: #fff;
  display: grid;
  font-weight: bold;
  height: 100%;
  justify-items: center;
  width: 100%;

  &.uploading {
    align-content: center;
    grid-gap: 50px;
  }

  span {
    font-size: 3rem;
  }

  #upload-arrow {
    animation: ${bounce} 1s ease-in-out infinite alternate;
    font-size: 10rem;
  }
`;

const Gallery = styled.div`
  display: grid;
  font-family: sans-serif;
  grid-template-rows: min-content;

  /* Expand to fill the Storybook iframe */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Header = styled.header`
  background: ${THEME.header.background};
  color: #fff;
  display: grid;
  grid-gap: 10px;
  padding: 20px;

  h1 {
    margin: 0;
  }
`;

const Title = styled.h1`
  color: #fff;
  font-size: 1.3em;
`;

const Instructions = styled.span`
  font-size: 0.9em;
`;

const Body = styled.main`
  align-items: center;
  display: grid;
  justify-items: center;
  overflow: auto;
  padding: 20px;

  &.has-images {
    align-items: start;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fill, 200px);
    justify-items: start;
  }

  img {
    animation: ${fadeIn} 1s;
  }
`;

export default function ImageGallery() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);

  function onHoverStart() {
    setOverlayVisible(true);
  }

  function onHoverEnd() {
    setOverlayVisible(false);
  }

  function onDrop(e) {
    e.persist();

    const handleSuccessfulUpload = () => {
      setOverlayVisible(false);
      setUploading(false);

      const imagesCopy = [...images];

      Array.from(e.dataTransfer.files).forEach(f => {
        const alreadyUploaded = imagesCopy.find(i => i.name === f.name);
        if (!alreadyUploaded) {
          const image = new Image();
          image.src = window.URL.createObjectURL(f);
          image.name = f.name;
          imagesCopy.push(image);
        }
      });

      setImages(imagesCopy);
    };

    // Simulate an upload
    setUploading(true);
    setTimeout(handleSuccessfulUpload, 3000);
  }

  return (
    <DropTarget
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onDrop={onDrop}
    >
      <Overlay className={overlayVisible ? "active" : "inactive"}>
        <OverlayContent className={uploading ? "uploading" : ""}>
          {uploading ? (
            <React.Fragment>
              <span>Uploading...</span>
              <CircularProgress size={100} color="inherit" />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span>Drop images anywhere to upload</span>
              <ArrowUpward id="upload-arrow" />
            </React.Fragment>
          )}
        </OverlayContent>
      </Overlay>
      <Gallery>
        <Header>
          <Title>Image Gallery</Title>
          <Instructions>
            Drop images anywhere to add them to your library
          </Instructions>
        </Header>
        <Body className={images.length ? "has-images" : ""}>
          {images.length === 0 ? (
            <span>No images</span>
          ) : (
            images.map(i => (
              <img key={i.name} src={i.src} alt={i.name} width={200} />
            ))
          )}
        </Body>
      </Gallery>
    </DropTarget>
  );
}
