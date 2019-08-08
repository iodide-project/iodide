import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";

import "./message-channel-stub";

global.fetch = require("jest-fetch-mock");

global.$ = $;
global.jQuery = $;
global.jquery = $;

global.React = React;
global.ReactDOM = ReactDOM;

global.editorOrigin = "http://localhost";
global.evalFrameOrigin = "testing EVAL_FRAME_ORIGIN";

global.IODIDE_JS_PATH = "testing IODIDE_JS_PATH";
global.IODIDE_CSS_PATH = "testing IODIDE_CSS_PATH";
global.IODIDE_VERSION = "testing IODIDE_VERSION";
global.PYODIDE_VERSION = "testing PYODIDE_VERSION";
process.env.NODE_ENV = "test";

Enzyme.configure({ adapter: new Adapter() });
