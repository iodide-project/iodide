import generateRandomId from "../../shared/utils/generate-random-id";
import { getErrorStackFrame } from "./eval-by-script-tag-stack-summary";

const evalJavaScript = codeString => {
  // for async script loading from blobs, see:
  // https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts
  const tempId = generateRandomId();
  // temporarily saving the raw string object on `window` removes the
  // need for complicated string escaping in the eval in the script
  window[`code-${tempId}`] = codeString;

  const enhancedString = `try {
  window["${tempId}"] = window.eval(window["code-${tempId}"])
} catch (err) {
  window["${tempId}"] = err
}`;
  return new Promise(resolve => {
    const blob = new Blob([enhancedString]);
    const script = document.createElement("script");
    const url = URL.createObjectURL(blob);
    script.src = url;
    document.head.appendChild(script);
    const jsScriptTagBlobId = url.toString().slice(-36);
    script.onload = () => {
      URL.revokeObjectURL(url);
      const value = window[tempId];
      delete window[tempId];
      delete window[`code-${tempId}`];
      const errorStack =
        value instanceof Error ? getErrorStackFrame(value) : undefined;
      resolve({ value, jsScriptTagBlobId, errorStack });
    };
  });
};

const remapErrorStackIds = (
  { name, message, stack },
  blobIdToEvalIdMapping
) => {
  return {
    name,
    message,
    stack: stack.map(stackItem => ({
      ...stackItem,
      jsScriptTagBlobId: blobIdToEvalIdMapping[stackItem.jsScriptTagBlobId]
    }))
  };
};

class JavascriptKernel {
  blobIdToEvalIdMapping = {};

  constructor() {
    this.evalJavaScript = this.evalJavaScript.bind(this);
    // this.blobIdToEvalIdMapping = {};
    console.log("jskern constructor", { this: this });
  }

  async evalJavaScript(codeString, { evalId }) {
    console.log("in kenr.evalJS - before eval", {
      codeString,
      evalId,
      this: this
    });

    const { value, jsScriptTagBlobId, errorStack } = await evalJavaScript(
      codeString
    );
    console.log("in kenr.evalJS - after eval", {
      value,
      jsScriptTagBlobId,
      errorStack
    });
    this.blobIdToEvalIdMapping[jsScriptTagBlobId] = evalId;
    return {
      value,
      errorStack:
        errorStack && remapErrorStackIds(errorStack, this.blobIdToEvalIdMapping)
    };
  }
}

const kernel = new JavascriptKernel();
export default kernel;
