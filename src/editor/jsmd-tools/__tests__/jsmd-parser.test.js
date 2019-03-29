import { jsmdParser } from "../jsmd-parser";

describe("first jsmd test case parses correctly to chunks", () => {
  const jsmdSample = `%% js
js block 1
foo
%%      fooblock     show hide   render skip
fooblock contents`;
  it("jsmdSample, has correct number of chunks", () => {
    expect(jsmdParser(jsmdSample).length).toEqual(2);
  });

  it("jsmdSample, has correct chunk types", () => {
    expect(jsmdParser(jsmdSample).map(c => c.chunkType)).toEqual([
      "js",
      "fooblock"
    ]);
  });

  it("jsmdSample, has correct chunk content", () => {
    expect(jsmdParser(jsmdSample).map(c => c.chunkContent)).toEqual([
      `js block 1
foo`,
      "fooblock contents"
    ]);
  });

  it("jsmdSample, has correct chunk eval flags", () => {
    expect(jsmdParser(jsmdSample).map(c => c.evalFlags)).toEqual([
      [],
      ["show", "hide", "render", "skip"]
    ]);
  });

  it("jsmdSample, has correct line numbers", () => {
    expect(jsmdParser(jsmdSample).map(c => [c.startLine, c.endLine])).toEqual([
      [0, 2],
      [3, 4]
    ]);
  });
});

describe("2nd jsmd sample parses correctly to chunks", () => {
  const jsmdSample = `
blankblock
%% js
js block 1
foo

%%      fooblock     show hide   render skip
fooblock contents

%%   md
### md block 1
%%

_md block 2_

%%fetch   foo     bat       
fetch block 1`;
  it("jsmdSample, has correct number of chunks", () => {
    expect(jsmdParser(jsmdSample).length).toEqual(6);
  });

  it("jsmdSample, has correct chunk types", () => {
    expect(jsmdParser(jsmdSample).map(c => c.chunkType)).toEqual([
      "",
      "js",
      "fooblock",
      "md",
      "md",
      "fetch"
    ]);
  });

  it("jsmdSample, has correct chunk content", () => {
    expect(jsmdParser(jsmdSample).map(c => c.chunkContent)).toEqual([
      `
blankblock`,
      `js block 1
foo
`,
      `fooblock contents
`,
      "### md block 1",
      `
_md block 2_
`,
      "fetch block 1"
    ]);
  });

  it("jsmdSample, has correct chunk eval flags", () => {
    expect(jsmdParser(jsmdSample).map(c => c.evalFlags)).toEqual([
      [],
      [],
      ["show", "hide", "render", "skip"],
      [],
      [],
      ["foo", "bat"]
    ]);
  });

  it("jsmdSample, has correct line numbers", () => {
    expect(jsmdParser(jsmdSample).map(c => [c.startLine, c.endLine])).toEqual([
      [0, 1],
      [2, 5],
      [6, 8],
      [9, 10],
      [11, 14],
      [15, 16]
    ]);
  });
});

describe("jsmd test case parses correctly to chunks when last line is a delim", () => {
  const jsmdSample = `%% js
js block 1
foo
%%      fooblock     show hide   render skip`;
  it("jsmdSample, has correct number of chunks", () => {
    expect(jsmdParser(jsmdSample).length).toEqual(2);
  });

  it("jsmdSample, has correct chunk types", () => {
    expect(jsmdParser(jsmdSample).map(c => c.chunkType)).toEqual([
      "js",
      "fooblock"
    ]);
  });

  it("jsmdSample, has correct chunk content", () => {
    expect(jsmdParser(jsmdSample).map(c => c.chunkContent)).toEqual([
      `js block 1
foo`,
      ""
    ]);
  });

  it("jsmdSample, has correct chunk eval flags", () => {
    expect(jsmdParser(jsmdSample).map(c => c.evalFlags)).toEqual([
      [],
      ["show", "hide", "render", "skip"]
    ]);
  });

  it("jsmdSample, has correct line numbers", () => {
    expect(jsmdParser(jsmdSample).map(c => [c.startLine, c.endLine])).toEqual([
      [0, 2],
      [3, 3]
    ]);
  });
});

describe("jsmd test case parses correctly to chunks with consecutive delim lines", () => {
  const jsmdSample = `%% js
js 1
%%      fooblock     show hide   render skip
%% js
js 2
%% js
%%md`;
  it("jsmdSample, has correct number of chunks", () => {
    expect(jsmdParser(jsmdSample).length).toEqual(5);
  });

  it("jsmdSample, has correct chunk types", () => {
    expect(jsmdParser(jsmdSample).map(c => c.chunkType)).toEqual([
      "js",
      "fooblock",
      "js",
      "js",
      "md"
    ]);
  });

  it("jsmdSample, has correct chunk content", () => {
    expect(jsmdParser(jsmdSample).map(c => c.chunkContent)).toEqual([
      "js 1",
      "",
      "js 2",
      "",
      ""
    ]);
  });

  it("jsmdSample, has correct chunk eval flags", () => {
    expect(jsmdParser(jsmdSample).map(c => c.evalFlags)).toEqual([
      [],
      ["show", "hide", "render", "skip"],
      [],
      [],
      []
    ]);
  });

  it("jsmdSample, has correct line numbers", () => {
    expect(jsmdParser(jsmdSample).map(c => [c.startLine, c.endLine])).toEqual([
      [0, 1],
      [2, 2],
      [3, 4],
      [5, 5],
      [6, 6]
    ]);
  });
});

describe("jsmd hashes are distinct", () => {
  const jsmdSample = `%% js
js
%% js
js
%% js
js`;

  it("length of set of hashes is correct", () => {
    expect(new Set(jsmdParser(jsmdSample).map(c => c.chunkId)).size).toEqual(3);
  });

  it("hashes of identical content have correct suffixes", () => {
    expect(jsmdParser(jsmdSample).map(c => c.chunkId.split("_")[1])).toEqual([
      "0",
      "1",
      "2"
    ]);
  });
});

describe("jsmd hashes are distinct for empty cells", () => {
  const jsmdSample = `%% js
%% js
%% js
%% js`;

  it("length of set of hashes is correct", () => {
    expect(new Set(jsmdParser(jsmdSample).map(c => c.chunkId)).size).toEqual(4);
  });

  it("hashes of identical content have correct suffixes", () => {
    expect(jsmdParser(jsmdSample).map(c => c.chunkId.split("_")[1])).toEqual([
      "0",
      "1",
      "2",
      "3"
    ]);
  });
});

describe("correct chunk types in tricky cases", () => {
  const jsmdSample = `%% chunk1
%%    
%%%%%%%%%%   
% notAChunk
%%%%%%%%    chunk2
%%      chunk3
%   %% notAChunk
 %% notAChunk
     %% notAChunk
%% % chunkIsPercentSign
%%%%%%%% %%% chunkIsPercentSign`;

  it("has correct chunk types", () => {
    expect(jsmdParser(jsmdSample).map(c => c.chunkType)).toEqual([
      "chunk1",
      "chunk1",
      "chunk1",
      "chunk2",
      "chunk3",
      "%",
      "%%%"
    ]);
  });
});
