console.log(`import "./monaco-env-init";`);

// eslint-disable-next-line no-restricted-globals
self.MonacoEnvironment = {
  baseUrl: "http://www.mycdn.com/monaco-editor/min/",
  getWorker(moduleId, label) {
    console.log(
      "getWorker ==== moduleId, label\n",
      moduleId,
      "----",
      label,
      "----"
    );
  },
  getWorkerUrl(moduleId, label) {
    console.log(
      "getWorkerUrl ========= moduleId, label\n",
      moduleId,
      "----",
      label,
      "----"
    );
    if (label === "json") {
      return "monaco.json.worker.dev.js";
    }
    if (label === "css") {
      return "monaco.css.worker.dev.js";
    }
    if (label === "html") {
      return "monaco.html.worker.dev.js";
    }
    if (label === "typescript" || label === "javascript") {
      return "monaco.ts.worker.dev.js";
    }
    return "monaco.editor.worker.dev.js";
  }
};
