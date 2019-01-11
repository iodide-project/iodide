/* global IODIDE_JS_PATH IODIDE_CSS_PATH IODIDE_VERSION IODIDE_EVAL_FRAME_ORIGIN */
import _ from "lodash";
import htmlTemplate from "../html-template";

export function exportJsmdBundle(jsmd, title) {
  const htmlTemplateCompiler = _.template(htmlTemplate);
  return htmlTemplateCompiler({
    NOTEBOOK_TITLE: title,
    APP_PATH_STRING: IODIDE_JS_PATH,
    CSS_PATH_STRING: IODIDE_CSS_PATH,
    APP_VERSION_STRING: IODIDE_VERSION,
    EVAL_FRAME_ORIGIN: IODIDE_EVAL_FRAME_ORIGIN,
    JSMD: jsmd
  });
}

export function titleToHtmlFilename(title) {
  return `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.html`;
}
