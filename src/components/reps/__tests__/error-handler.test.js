import { ValueRenderer } from '../value-renderer' // eslint-disable-line
import errorHandler, { trimStack } from '../error-handler'

describe('errorHandler shouldHandle', () => {
  it('handles the correct type', () => {
    expect(errorHandler.shouldHandle(undefined)).toBe(false)
    expect(errorHandler.shouldHandle(new Error())).toBe(true)
  })

  // FIXME: Add a test against a real throw exception once we have selenium
  // testing available.

  it('trims stack frames', async () => {
    /* eslint-disable */
    const mockFrames = [
      {
        "isEval": true,
        "columnNumber": 7,
        "lineNumber": 1,
        "fileName": "cell",
        "functionName": "eval",
        "source": "@http://localhost:8000/iodide.eval-frame.dev.js line 103208 > eval:1:7"
      },
      {
        "columnNumber": 40,
        "lineNumber": 103208,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "runCodeWithLanguage/<",
        "source": "runCodeWithLanguage/<@http://localhost:8000/iodide.eval-frame.dev.js:103208:40"
      },
      {
        "columnNumber": 10,
        "lineNumber": 103206,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "runCodeWithLanguage",
        "source": "runCodeWithLanguage@http://localhost:8000/iodide.eval-frame.dev.js:103206:10"
      },
      {
        "columnNumber": 147,
        "lineNumber": 102695,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "evaluateCode/</<",
        "source": "evaluateCode/</<@http://localhost:8000/iodide.eval-frame.dev.js:102695:147"
      },
      {
        "columnNumber": 121,
        "lineNumber": 102695,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "promise callback*evaluateCode/<",
        "source": "promise callback*evaluateCode/<@http://localhost:8000/iodide.eval-frame.dev.js:102695:121"
      },
      {
        "columnNumber": 18,
        "lineNumber": 97655,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "createThunkMiddleware/</</<",
        "source": "createThunkMiddleware/</</<@http://localhost:8000/iodide.eval-frame.dev.js:97655:18"
      },
      {
        "columnNumber": 18,
        "lineNumber": 98297,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "dispatch",
        "source": "dispatch@http://localhost:8000/iodide.eval-frame.dev.js:98297:18"
      },
      {
        "columnNumber": 52,
        "lineNumber": 102713,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "evaluateText/</evaluationQueue<",
        "source": "evaluateText/</evaluationQueue<@http://localhost:8000/iodide.eval-frame.dev.js:102713:52"
      },
      {
        "columnNumber": 25,
        "lineNumber": 102713,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "promise callback*evaluateText/<",
        "source": "promise callback*evaluateText/<@http://localhost:8000/iodide.eval-frame.dev.js:102713:25"
      },
      {
        "columnNumber": 18,
        "lineNumber": 97655,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "createThunkMiddleware/</</<",
        "source": "createThunkMiddleware/</</<@http://localhost:8000/iodide.eval-frame.dev.js:97655:18"
      },
      {
        "columnNumber": 11,
        "lineNumber": 104803,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "receiveMessage",
        "source": "receiveMessage@http://localhost:8000/iodide.eval-frame.dev.js:104803:11"
      },
      {
        "columnNumber": 1,
        "lineNumber": 104820,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "EventHandlerNonNull*./src/eval-frame/port-to-editor.js",
        "source": "EventHandlerNonNull*./src/eval-frame/port-to-editor.js@http://localhost:8000/iodide.eval-frame.dev.js:104820:1"
      },
      {
        "columnNumber": 12,
        "lineNumber": 20,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "__webpack_require__",
        "source": "__webpack_require__@http://localhost:8000/iodide.eval-frame.dev.js:20:12"
      },
      {
        "columnNumber": 73,
        "lineNumber": 102746,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "./src/eval-frame/actions/eval-frame-tasks.js",
        "source": "./src/eval-frame/actions/eval-frame-tasks.js@http://localhost:8000/iodide.eval-frame.dev.js:102746:73"
      },
      {
        "columnNumber": 12,
        "lineNumber": 20,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "__webpack_require__",
        "source": "__webpack_require__@http://localhost:8000/iodide.eval-frame.dev.js:20:12"
      },
      {
        "columnNumber": 83,
        "lineNumber": 104724,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "./src/eval-frame/keybindings.js",
        "source": "./src/eval-frame/keybindings.js@http://localhost:8000/iodide.eval-frame.dev.js:104724:83"
      },
      {
        "columnNumber": 12,
        "lineNumber": 20,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "__webpack_require__",
        "source": "__webpack_require__@http://localhost:8000/iodide.eval-frame.dev.js:20:12"
      },
      {
        "columnNumber": 71,
        "lineNumber": 104342,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "./src/eval-frame/index.jsx",
        "source": "./src/eval-frame/index.jsx@http://localhost:8000/iodide.eval-frame.dev.js:104342:71"
      },
      {
        "columnNumber": 12,
        "lineNumber": 20,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "functionName": "__webpack_require__",
        "source": "__webpack_require__@http://localhost:8000/iodide.eval-frame.dev.js:20:12"
      },
      {
        "columnNumber": 18,
        "lineNumber": 84,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "source": "@http://localhost:8000/iodide.eval-frame.dev.js:84:18"
      },
      {
        "columnNumber": 11,
        "lineNumber": 1,
        "fileName": "http://localhost:8000/iodide.eval-frame.dev.js",
        "source": "@http://localhost:8000/iodide.eval-frame.dev.js:1:11"
      }
    ]
    /* eslint-enable */

    expect(trimStack(mockFrames).split('\n').length).toBe(2)
  })
})
