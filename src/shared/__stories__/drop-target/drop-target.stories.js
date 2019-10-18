import React from "react";
import { storiesOf } from "@storybook/react";

import FileManager from "./components/FileManager";
import ImageGallery from "./components/ImageGallery";

const stories = storiesOf("DropTarget", module);
stories.add("File manager", () => <FileManager />);
stories.add("Image gallery", () => <ImageGallery />);
