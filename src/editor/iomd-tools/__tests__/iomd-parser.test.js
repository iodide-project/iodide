import { iomdParser } from "../iomd-parser";

describe("first iomd test case parses correctly to chunks", () => {
  const iomdSample = `%% js
js block 1
foo
%%      fooblock     show hide   render skip
fooblock contents`;
  it("iomdSample, has correct number of chunks", () => {
    expect(iomdParser(iomdSample).length).toEqual(2);
  });

  it("iomdSample, has correct chunk types", () => {
    expect(iomdParser(iomdSample).map(c => c.chunkType)).toEqual([
      "js",
      "fooblock"
    ]);
  });

  it("iomdSample, has correct chunk content", () => {
    expect(iomdParser(iomdSample).map(c => c.chunkContent)).toEqual([
      `js block 1
foo`,
      "fooblock contents"
    ]);
  });

  it("iomdSample, has correct chunk eval flags", () => {
    expect(iomdParser(iomdSample).map(c => c.evalFlags)).toEqual([
      [],
      ["show", "hide", "render", "skip"]
    ]);
  });

  it("iomdSample, has correct line numbers", () => {
    expect(iomdParser(iomdSample).map(c => [c.startLine, c.endLine])).toEqual([
      [1, 3],
      [4, 5]
    ]);
  });
});

describe("2nd iomd sample parses correctly to chunks", () => {
  const iomdSample = `
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
  it("iomdSample, has correct number of chunks", () => {
    expect(iomdParser(iomdSample).length).toEqual(6);
  });

  it("iomdSample, has correct chunk types", () => {
    expect(iomdParser(iomdSample).map(c => c.chunkType)).toEqual([
      "",
      "js",
      "fooblock",
      "md",
      "md",
      "fetch"
    ]);
  });

  it("iomdSample, has correct chunk content", () => {
    expect(iomdParser(iomdSample).map(c => c.chunkContent)).toEqual([
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

  it("iomdSample, has correct chunk eval flags", () => {
    expect(iomdParser(iomdSample).map(c => c.evalFlags)).toEqual([
      [],
      [],
      ["show", "hide", "render", "skip"],
      [],
      [],
      ["foo", "bat"]
    ]);
  });

  it("iomdSample, has correct line numbers", () => {
    expect(iomdParser(iomdSample).map(c => [c.startLine, c.endLine])).toEqual([
      [1, 2],
      [3, 6],
      [7, 9],
      [10, 11],
      [12, 15],
      [16, 17]
    ]);
  });
});

describe("iomd test case parses correctly to chunks when last line is a delim", () => {
  const iomdSample = `%% js
js block 1
foo
%%      fooblock     show hide   render skip`;
  it("iomdSample, has correct number of chunks", () => {
    expect(iomdParser(iomdSample).length).toEqual(2);
  });

  it("iomdSample, has correct chunk types", () => {
    expect(iomdParser(iomdSample).map(c => c.chunkType)).toEqual([
      "js",
      "fooblock"
    ]);
  });

  it("iomdSample, has correct chunk content", () => {
    expect(iomdParser(iomdSample).map(c => c.chunkContent)).toEqual([
      `js block 1
foo`,
      ""
    ]);
  });

  it("iomdSample, has correct chunk eval flags", () => {
    expect(iomdParser(iomdSample).map(c => c.evalFlags)).toEqual([
      [],
      ["show", "hide", "render", "skip"]
    ]);
  });

  it("iomdSample, has correct line numbers", () => {
    expect(iomdParser(iomdSample).map(c => [c.startLine, c.endLine])).toEqual([
      [1, 3],
      [4, 4]
    ]);
  });
});

describe("iomd test case parses correctly to chunks with consecutive delim lines", () => {
  const iomdSample = `%% js
js 1
%%      fooblock     show hide   render skip
%% js
js 2
%% js
%%md`;
  it("iomdSample, has correct number of chunks", () => {
    expect(iomdParser(iomdSample).length).toEqual(5);
  });

  it("iomdSample, has correct chunk types", () => {
    expect(iomdParser(iomdSample).map(c => c.chunkType)).toEqual([
      "js",
      "fooblock",
      "js",
      "js",
      "md"
    ]);
  });

  it("iomdSample, has correct chunk content", () => {
    expect(iomdParser(iomdSample).map(c => c.chunkContent)).toEqual([
      "js 1",
      "",
      "js 2",
      "",
      ""
    ]);
  });

  it("iomdSample, has correct chunk eval flags", () => {
    expect(iomdParser(iomdSample).map(c => c.evalFlags)).toEqual([
      [],
      ["show", "hide", "render", "skip"],
      [],
      [],
      []
    ]);
  });

  it("iomdSample, has correct line numbers", () => {
    expect(iomdParser(iomdSample).map(c => [c.startLine, c.endLine])).toEqual([
      [1, 2],
      [3, 3],
      [4, 5],
      [6, 6],
      [7, 7]
    ]);
  });
});

describe("iomd hashes are distinct", () => {
  const iomdSample = `%% js
js
%% js
js
%% js
js`;

  it("length of set of hashes is correct", () => {
    expect(new Set(iomdParser(iomdSample).map(c => c.chunkId)).size).toEqual(3);
  });

  it("hashes of identical content have correct suffixes", () => {
    expect(iomdParser(iomdSample).map(c => c.chunkId.split("_")[1])).toEqual([
      "0",
      "1",
      "2"
    ]);
  });
});

describe("iomd hashes are distinct for empty cells", () => {
  const iomdSample = `%% js
%% js
%% js
%% js`;

  it("length of set of hashes is correct", () => {
    expect(new Set(iomdParser(iomdSample).map(c => c.chunkId)).size).toEqual(4);
  });

  it("hashes of identical content have correct suffixes", () => {
    expect(iomdParser(iomdSample).map(c => c.chunkId.split("_")[1])).toEqual([
      "0",
      "1",
      "2",
      "3"
    ]);
  });
});

describe("correct chunk types in tricky cases", () => {
  const iomdSample = `%% chunk1
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
    expect(iomdParser(iomdSample).map(c => c.chunkType)).toEqual([
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
