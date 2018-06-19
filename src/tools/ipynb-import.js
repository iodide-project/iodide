function importIpynb(url, json) {
  if (json.nbformat !== 4) {
    throw new Error('Iodide can only import version 4 of the .ipynb format')
  }

  const title = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'))

  const { metadata, cells } = json;
  const languageInfo = metadata.language_info;
  if (languageInfo.name !== 'python') {
    throw new Error(`Iodide can only import Python .ipynb notebooks at this time.  Found ${languageInfo.name}.`)
  }

  let jsmd = `
%% meta
{
  "title": "${title}",
  "languages": {
    "js": {
      "pluginType": "language",
      "languageId": "js",
      "displayName": "Javascript",
      "codeMirrorMode": "javascript",
      "module": "window",
      "evaluator": "eval",
      "keybinding": "j",
      "url": ""
    },
    "py": {
      "languageId": "py",
      "displayName": "python",
      "codeMirrorMode": "python",
      "keybinding": "p",
      "url": "https://iodide.io/pyodide-demo/pyodide.js",
      "module": "pyodide",
      "evaluator": "runPython",
      "pluginType": "language"
    }
  },
  "lastExport": "${new Date().toISOString()}"
}

%% md

Imported automatically from [${url}](${encodeURI(url)}).

Support for importing Jupyter notebooks into Iodide is experimental.  In particular, the following things are known not to work:

- IPython magics (lines starting with \`%\`)

%% plugin
{
  "languageId": "py",
  "displayName": "python",
  "codeMirrorMode": "python",
  "keybinding": "p",
  "url": "https://iodide.io/pyodide-demo/pyodide.js",
  "module": "pyodide",
  "evaluator": "runPython",
  "pluginType": "language"
}

%% js
pyodide.loadPackage('matplotlib')
`;

  cells.forEach((cell) => {
    if (cell.cell_type === 'markdown') {
      jsmd += '\n%% md\n\n'
    } else if (cell.cell_type === 'code') {
      jsmd += '\n%% code {"language":"py"}\n\n'
    }
    cell.source.forEach((line) => {
      jsmd += line
    })
  })

  // Set the base URL of the page to the url of the source document, so links to
  // image content in markdown will work.
  const base = document.createElement('base')
  base.href = url
  document.body.appendChild(base)

  return jsmd
}

export { importIpynb };
