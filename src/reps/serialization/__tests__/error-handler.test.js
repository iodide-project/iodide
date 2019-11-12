import { getErrorStackString } from "../get-error-stack-summary";

describe("errorHandler getErrorStackString trims stacks as expected", () => {
  // FIXME: Add a test against a real throw exception once we have selenium
  // testing available.
  it("trims stack frames", async () => {
    const mockFrames = [
      {
        isEval: true,
        columnNumber: 7,
        lineNumber: 1,
        fileName: "cell",
        functionName: "eval",
        source:
          "@http://localhost:8000/iodide.eval-frame.js line 103208 > eval:1:7"
      },
      {
        columnNumber: 40,
        lineNumber: 103208,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "runCodeWithLanguage/<",
        source:
          "runCodeWithLanguage/<@http://localhost:8000/iodide.eval-frame.js:103208:40"
      },
      {
        columnNumber: 10,
        lineNumber: 103206,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "runCodeWithLanguage",
        source:
          "runCodeWithLanguage@http://localhost:8000/iodide.eval-frame.js:103206:10"
      },
      {
        columnNumber: 147,
        lineNumber: 102695,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "evaluateCode/</<",
        source:
          "evaluateCode/</<@http://localhost:8000/iodide.eval-frame.js:102695:147"
      },
      {
        columnNumber: 121,
        lineNumber: 102695,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "promise callback*evaluateCode/<",
        source:
          "promise callback*evaluateCode/<@http://localhost:8000/iodide.eval-frame.js:102695:121"
      },
      {
        columnNumber: 18,
        lineNumber: 97655,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "createThunkMiddleware/</</<",
        source:
          "createThunkMiddleware/</</<@http://localhost:8000/iodide.eval-frame.js:97655:18"
      },
      {
        columnNumber: 18,
        lineNumber: 98297,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "dispatch",
        source: "dispatch@http://localhost:8000/iodide.eval-frame.js:98297:18"
      },
      {
        columnNumber: 52,
        lineNumber: 102713,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "evaluateText/</evaluationQueue<",
        source:
          "evaluateText/</evaluationQueue<@http://localhost:8000/iodide.eval-frame.js:102713:52"
      },
      {
        columnNumber: 25,
        lineNumber: 102713,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "promise callback*evaluateText/<",
        source:
          "promise callback*evaluateText/<@http://localhost:8000/iodide.eval-frame.js:102713:25"
      },
      {
        columnNumber: 18,
        lineNumber: 97655,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "createThunkMiddleware/</</<",
        source:
          "createThunkMiddleware/</</<@http://localhost:8000/iodide.eval-frame.js:97655:18"
      },
      {
        columnNumber: 11,
        lineNumber: 104803,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "receiveMessage",
        source:
          "receiveMessage@http://localhost:8000/iodide.eval-frame.js:104803:11"
      },
      {
        columnNumber: 1,
        lineNumber: 104820,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "EventHandlerNonNull*./src/eval-frame/port-to-editor.js",
        source:
          "EventHandlerNonNull*./src/eval-frame/port-to-editor.js@http://localhost:8000/iodide.eval-frame.js:104820:1"
      },
      {
        columnNumber: 12,
        lineNumber: 20,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "__webpack_require__",
        source:
          "__webpack_require__@http://localhost:8000/iodide.eval-frame.js:20:12"
      },
      {
        columnNumber: 73,
        lineNumber: 102746,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "./src/eval-frame/actions/eval-frame-tasks.js",
        source:
          "./src/eval-frame/actions/eval-frame-tasks.js@http://localhost:8000/iodide.eval-frame.js:102746:73"
      },
      {
        columnNumber: 12,
        lineNumber: 20,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "__webpack_require__",
        source:
          "__webpack_require__@http://localhost:8000/iodide.eval-frame.js:20:12"
      },
      {
        columnNumber: 83,
        lineNumber: 104724,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "./src/eval-frame/keybindings.js",
        source:
          "./src/eval-frame/keybindings.js@http://localhost:8000/iodide.eval-frame.js:104724:83"
      },
      {
        columnNumber: 12,
        lineNumber: 20,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "__webpack_require__",
        source:
          "__webpack_require__@http://localhost:8000/iodide.eval-frame.js:20:12"
      },
      {
        columnNumber: 71,
        lineNumber: 104342,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "./src/eval-frame/index.jsx",
        source:
          "./src/eval-frame/index.jsx@http://localhost:8000/iodide.eval-frame.js:104342:71"
      },
      {
        columnNumber: 12,
        lineNumber: 20,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        functionName: "__webpack_require__",
        source:
          "__webpack_require__@http://localhost:8000/iodide.eval-frame.js:20:12"
      },
      {
        columnNumber: 18,
        lineNumber: 84,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        source: "@http://localhost:8000/iodide.eval-frame.js:84:18"
      },
      {
        columnNumber: 11,
        lineNumber: 1,
        fileName: "http://localhost:8000/iodide.eval-frame.js",
        source: "@http://localhost:8000/iodide.eval-frame.js:1:11"
      }
    ];

    expect(getErrorStackString(mockFrames).split("\n").length).toBe(2);
  });
});
