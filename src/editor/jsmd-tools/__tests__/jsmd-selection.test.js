// import CodeMirror from 'codemirror'

import {
  selectionToChunks,
  removeDuplicatePluginChunksInSelectionSet,
  padOutFetchChunk
} from "../jsmd-selection";

import { jsmdParser } from "../jsmd-parser";

document.body.innerHTML = "";

const NOTEBOOK = `
%% js

var x = 10
var y = 20
var z = 30

%% fetch

js: https://whatever.com
css: https://another-domain.biz
file: /files/gritty-data.csv

%% py
import numpy
x = [1,2,3,4,5]

%% plugin

{
  "languageId": "jsx",
  "displayName": "jsx",
  "codeMirrorMode": "jsx",
  "keybinding": "x",
  "url": "https://raw.githubusercontent.com/hamilton/iodide-jsx/master/docs/evaluate-jsx.js",
  "module": "jsx",
  "evaluator": "evaluateJSX",
  "pluginType": "language"
}

%% js

var x = 10
var y = 20
var z = 30

%% plugin

{
  "languageId": "blahblah",
  "displayName": "blahblah",
  "codeMirrorMode": "blahblah",
  "keybinding": "b",
  "url": "blah.com/language.json",
  "module": "bla",
  "evaluator": "evaluateBlahBlah",
  "pluginType": "language"
}

`;

const fetchSelections = [
  {
    start: 9,
    end: 9,
    selectedText: ": https",
    expectedValue: "js: https://whatever.com"
  },
  {
    start: 10,
    end: 10,
    selectedText: ": https",
    expectedValue: "css: https://another-domain.biz"
  },
  {
    start: 11,
    end: 11,
    selectedText: ": https",
    expectedValue: "file: /files/gritty-data.csv"
  },
  {
    start: 9,
    end: 10,
    selectedText: "s://whatever.com\ncss: ht",
    expectedValue: "js: https://whatever.com\ncss: https://another-domain.biz"
  },
  {
    start: 10,
    end: 11,
    selectedText: "//another-domain.biz\nfile: /file",
    expectedValue:
      "css: https://another-domain.biz\nfile: /files/gritty-data.csv"
  }
];

// line 11.
const SELECTION_A = `https://another-domain.biz
file: /files/gritty-data.csv

%% py
import numpy
x = [1,2,3,4,5]

`;

// lines 5-10. fetch as end chunk needs to go to end of line.
const SELECTION_B = `var y = 20
var z = 30

%% fetch

js: h`;

// lines 16-24. start of plugin chunk
const SELECTION_C = `[1,2,3,4,5]

%% plugin

{
  "languageId": "jsx",
  "displayName": "jsx",
  "codeMirrorMode": "jsx",
  "key`;

// lines 27-36. end of plugin chunk
const SELECTION_D = `"url": "https://raw.githubusercontent.com/hamilton/iodide-jsx/master/docs/evaluate-jsx.js",
"module": "jsx",
"evaluator": "evaluateJSX",
"pluginType": "language"
}

%% js

var x = 10
var y = 20`;

const FULL_PLUGIN_CHUNK = `
{
  "languageId": "jsx",
  "displayName": "jsx",
  "codeMirrorMode": "jsx",
  "keybinding": "x",
  "url": "https://raw.githubusercontent.com/hamilton/iodide-jsx/master/docs/evaluate-jsx.js",
  "module": "jsx",
  "evaluator": "evaluateJSX",
  "pluginType": "language"
}
`;

const partialPluginSelections = [
  {
    start: 22,
    end: 22,
    selectedText: 'orMode": "j',
    expectedValue: FULL_PLUGIN_CHUNK
  }
];

const jsmdChunks = jsmdParser(NOTEBOOK);

describe("selectionToChunks", () => {
  it("correctly backs out various fetch selections and plugin chunks", () => {
    [...fetchSelections, ...partialPluginSelections].forEach(line => {
      const [chunk] = selectionToChunks(line, jsmdChunks);
      expect(chunk.chunkContent).toBe(line.expectedValue);
    });
  });

  const selectionParamsA = {
    start: 10,
    end: 16,
    selectedText: SELECTION_A
  };

  const selectedChunksA = selectionToChunks(selectionParamsA, jsmdChunks);
  const [firstChunkA, secondChunkA] = selectedChunksA;
  it("partial %% fetch ... %% py selection, properly backs out first chunk type + full content", () => {
    expect(firstChunkA.chunkType).toBe("fetch");
    expect(firstChunkA.chunkContent).toBe(
      "css: https://another-domain.biz\nfile: /files/gritty-data.csv\n"
    );
  });
  it("partial %% fetch ... %% py selection, second chunk type + content identified", () => {
    expect(secondChunkA.chunkType).toBe("py");
    expect(secondChunkA.chunkContent).toBe("import numpy\nx = [1,2,3,4,5]\n\n");
  });

  const selectionParamsB = {
    start: 5,
    end: 9,
    selectedText: SELECTION_B
  };

  const selectedChunksB = selectionToChunks(selectionParamsB, jsmdChunks);
  const [firstChunkB, secondChunkB] = selectedChunksB;
  it("%%js  ... %% fetch ... selection, properly backs out first chunk type + full content", () => {
    expect(firstChunkB.chunkType).toBe("js");
    expect(firstChunkB.chunkContent).toBe("var y = 20\nvar z = 30\n");
  });
  it("%% js ... %% fetch ... selection, properly completes fetch chunk line", () => {
    expect(secondChunkB.chunkType).toBe("fetch");
    expect(secondChunkB.chunkContent).toBe("\njs: https://whatever.com");
  });

  const selectionParamsC = {
    start: 16,
    end: 24,
    selectedText: SELECTION_C
  };
  const selectedChunksC = selectionToChunks(selectionParamsC, jsmdChunks);
  const [firstChunkC, secondChunkC] = selectedChunksC;
  it("correctly infers the first chunk type from the partial selection", () => {
    expect(firstChunkC.chunkType).toBe("py");
    expect(firstChunkC.chunkContent).toBe("[1,2,3,4,5]\n");
  });
  it("correctly identifies the second (declared) chunk type from the selection", () => {
    expect(secondChunkC.chunkType).toBe("plugin");
    expect(secondChunkC.chunkContent).toBe(FULL_PLUGIN_CHUNK);
  });

  const selectionParamsD = {
    start: 25,
    end: 34,
    selectedText: SELECTION_D
  };
  const selectedChunksD = selectionToChunks(selectionParamsD, jsmdChunks);
  const [firstChunkD, secondChunkD] = selectedChunksD;
  it("correctly infers the first chunk type from the partial selection", () => {
    expect(firstChunkD.chunkType).toBe("plugin");
    expect(firstChunkD.chunkContent).toBe(FULL_PLUGIN_CHUNK);
  });
  it("correctly identifies the second (declared) chunk type from the selection", () => {
    expect(secondChunkD.chunkType).toBe("js");
    expect(secondChunkD.chunkContent).toBe("\nvar x = 10\nvar y = 20");
  });
});

const pluginChunkA = {
  start: 20,
  end: 20,
  selectedText: 'geId": "js'
};

const pluginChunkB = {
  start: 21,
  end: 39,
  selectedText: `Name": "jsx",
  "codeMirrorMode": "jsx",
  "keybinding": "x",
  "url": "https://raw.githubusercontent.com/hamilton/iodide-jsx/master/docs/evaluate-jsx.js",
  "module": "jsx",
  "evaluator": "evaluateJSX",
  "pluginType": "language"
}

%% js

var x = 10
var y = 20
var z = 30

%% plugin

{
  "language`
};

describe("removeDuplicatePluginChunksInSelectionSet", () => {
  it("removes duplicates in selection set", () => {
    const [chunk1, chunk2] = [pluginChunkA, pluginChunkB]
      .map(selection => selectionToChunks(selection, jsmdChunks))
      .map(removeDuplicatePluginChunksInSelectionSet());
    expect(chunk1.length).toBe(1);
    expect(
      chunk1.filter(c => c.chunkContent === FULL_PLUGIN_CHUNK).length
    ).toBe(1);
    expect(chunk1[0].chunkContent).toBe(FULL_PLUGIN_CHUNK);
    expect(
      chunk2.filter(c => c.chunkContent === FULL_PLUGIN_CHUNK).length
    ).toBe(0);
    expect(chunk2.filter(c => c.chunkType === "plugin").length).toBe(1);
  });
});
const FULL_FETCH_CHUNK = `js: https://whatever.com
css: https://another-domain.biz
file: /files/gritty-data.csv`;

const moreFetchSelections = [
  {
    start: 3,
    selectedText: `js: https://whatever.com
css: https://another-domain.biz
file: /files/gri`,
    expectedValue: FULL_FETCH_CHUNK,
    side: "end"
  },
  {
    start: 1,
    selectedText: `hatever.com
css: https://another-domain.biz
file: /files/gritty-data.csv`,
    expectedValue: FULL_FETCH_CHUNK,
    side: "start"
  }
];

describe("padOutFetchChunk", () => {
  const fullText = jsmdChunks[2].chunkContent;
  it("pads out the selection area of a fetch chunk selection to go to start / end of line", () => {
    moreFetchSelections.forEach(selection => {
      const { selectedText, side, start } = selection;
      const editedChunk = padOutFetchChunk(selectedText, fullText, start, side);
      expect(editedChunk).toBe(selection.expectedValue);
    });
  });
});
