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

global.IODIDE_EDITOR_ORIGIN = "http://localhost";

global.IODIDE_JS_PATH = "testing IODIDE_JS_PATH";
global.IODIDE_CSS_PATH = "testing IODIDE_CSS_PATH";
global.IODIDE_VERSION = "testing IODIDE_VERSION";
global.IODIDE_EVAL_FRAME_ORIGIN = "testing IODIDE_EVAL_FRAME_ORIGIN";
global.PYODIDE_VERSION = "testing PYODIDE_VERSION";

Enzyme.configure({ adapter: new Adapter() });
