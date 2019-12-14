import parseFetchCell, {
  parseFetchCellLine,
  commentOnlyLine,
  emptyLine,
  parseAssignmentCommand,
  validFetchUrl,
  validVariableName
} from "../fetch-cell-parser";

// test commentOnlyLine /////////////////////////
describe("correctly identify when a line IS a commentOnlyLine", () => {
  const lines = [
    "       // asdfas asdf /a/ asf/ fas // ",
    "//comment fasdkfj;lj        ",
    "  ///////////// comment"
  ];
  lines.forEach(testCase => {
    it(`IS a comment only line: ${testCase}`, () => {
      expect(commentOnlyLine(testCase)).toEqual(true);
    });
  });
});

describe("correctly identify when a line IS NOT a commentOnlyLine", () => {
  const lines = [
    "  adsfa     // asdfas asdf /a/ asf/ fas // ",
    "https://comment//path/blah //fasdkfj;lj        ",
    "    / / / ////////// comment",
    "/   /",
    "      / /"
  ];
  lines.forEach(testCase => {
    it(`is NOT a commentOnlyLine: "${testCase}"`, () => {
      expect(commentOnlyLine(testCase)).toEqual(false);
    });
  });
});

// test emptyLine /////////////////////////
describe("correctly identify when a line IS an emptyLine", () => {
  const lines = ["       ", ""];
  lines.forEach(testCase => {
    it(`IS a comment only line: "${testCase}"`, () => {
      expect(emptyLine(testCase)).toEqual(true);
    });
  });
});

describe("correctly identify when a line IS NOT a emptyLine", () => {
  const lines = [
    "  adsfa     // asdfas asdf /a/ asf/ fas // ",
    "https://comment//path/blah //fasdkfj;lj        ",
    "         /     "
  ];
  lines.forEach(testCase => {
    it(`is NOT a emptyLine: "${testCase}"`, () => {
      expect(emptyLine(testCase)).toEqual(false);
    });
  });
});

// test parseAssignmentCommand /////////////////////////
describe("parseAssignmentCommand gives correct results", () => {
  const assigmentCommands = [
    {
      command: "foo =   https://d3js.org/d3.v5.min.js",
      result: {
        varName: "foo",
        filePath: "https://d3js.org/d3.v5.min.js",
        isRelPath: false
      }
    },
    {
      command: "foo=data/table.csv",
      result: {
        varName: "foo",
        filePath: "data/table.csv",
        isRelPath: true
      }
    },
    {
      command: "foo =data/table.csv",
      result: {
        varName: "foo",
        filePath: "data/table.csv",
        isRelPath: true
      }
    }
  ];
  assigmentCommands.forEach(testCase => {
    it(`command gives correct result: "${testCase.command}"`, () => {
      expect(parseAssignmentCommand(testCase.command)).toEqual(testCase.result);
    });
  });
});

// test parseFetchCellLine /////////////////////////
const validFetchLines = [
  {
    line: "js: https://d3js.org/d3.v5.min.js",
    result: {
      fetchType: "js",
      filePath: "https://d3js.org/d3.v5.min.js",
      isRelPath: false
    }
  },
  {
    line: "  js: https://d3js.org/d3.v5.min.js //comment",
    result: {
      fetchType: "js",
      filePath: "https://d3js.org/d3.v5.min.js",
      isRelPath: false
    }
  },
  {
    line: "css: files/company-report-styles.css  // comment",
    result: {
      fetchType: "css",
      filePath: "company-report-styles.css",
      isRelPath: true
    }
  },
  {
    line: " text:   foo =   https://d3js.org/d3.v5.min.js //comment",
    result: {
      fetchType: "text",
      varName: "foo",
      filePath: "https://d3js.org/d3.v5.min.js",
      isRelPath: false
    }
  },
  {
    line: " text:   $fo_o    =   /d3js.org/d3.v5.min.js //comment",
    result: {
      fetchType: "text",
      varName: "$fo_o",
      filePath: "/d3js.org/d3.v5.min.js",
      isRelPath: true
    }
  },
  {
    line: " text:   ಠ_ಠ =   https://d3js.org/d3.v5.min.js //comment",
    result: {
      fetchType: "text",
      varName: "ಠ_ಠ",
      filePath: "https://d3js.org/d3.v5.min.js",
      isRelPath: false
    }
  },
  {
    line: " json:   test =   https://d3js.org/d3.v5.min.js //comment",
    result: {
      fetchType: "json",
      varName: "test",
      filePath: "https://d3js.org/d3.v5.min.js",
      isRelPath: false
    }
  },
  {
    line: " json:   test =   https://d3js.org/d3.v5.min.js //comment",
    result: {
      fetchType: "json",
      varName: "test",
      filePath: "https://d3js.org/d3.v5.min.js",
      isRelPath: false
    }
  },
  {
    line: " blob:   test =  https://d3js.org/d3.v5.min.js //comment",
    result: {
      fetchType: "blob",
      varName: "test",
      filePath: "https://d3js.org/d3.v5.min.js",
      isRelPath: false
    }
  }
];
describe("return valid results for valid fetch lines", () => {
  validFetchLines.forEach(testCase => {
    it(`fetch line should return correct type: "${testCase.line}"`, () => {
      expect(parseFetchCellLine(testCase.line)).toEqual(testCase.result);
    });
  });
});

// test error handling /////////////////////////

const invalidFetchLines = [
  {
    line: "just made up irrelevant text",
    result: { error: "MISSING_FETCH_TYPE" }
  },
  {
    line: "image: just made up irrelevant text",
    result: { error: "INVALID_FETCH_TYPE" }
  },
  {
    line: "js : just made up irrelevant text",
    result: { error: "INVALID_FETCH_TYPE" }
  },
  {
    line: "js: js: https://d3js.org/d3.v5.min.js",
    result: { error: "INVALID_FETCH_URL" }
  },
  {
    line: "https://some-host.com/styles.css",
    result: { error: "MISSING_FETCH_TYPE" }
  },
  {
    line: "text: asd## = https://iodide.io/data/foo.csv",
    result: { error: "INVALID_VARIABLE_NAME" }
  },
  {
    line: "json: ---asd## = https://iodide.io/data/foo.csv",
    result: { error: "INVALID_VARIABLE_NAME" }
  },
  {
    line: "blob: 1234567890 = https://iodide.io/data/foo.csv",
    result: { error: "INVALID_VARIABLE_NAME" }
  }
];

describe("return correct errors for invalid fetch lines", () => {
  invalidFetchLines.forEach(testCase => {
    it(`invalid fetch lines should return correct error "${testCase.line}"`, () => {
      expect(parseFetchCellLine(testCase.line).error).toEqual(
        testCase.result.error
      );
    });
  });
});

// test parseFetchCell (integration-ish test) /////////////////////////

describe("return correct number of fetch cell fetches", () => {
  const fetchCellText1 = `
file: asd## = https://iodide.io/data/foo.csv


// some comment

js: http://foo.com/bar.js
css: data/style.css
`;
  it("fetch cell text case 1", () => {
    expect(parseFetchCell(fetchCellText1).length).toEqual(3);
  });

  const fetchCellText2 = `

//  comment
            // comment

text: foo = https://iodide.io/data/foo.csv


// some comment

`;
  it("fetch cell text case 2", () => {
    expect(parseFetchCell(fetchCellText2).length).toEqual(1);
  });
});

describe("validate fetch url", () => {
  const validLines = [
    "js: https://valid-host.com/file.js",
    "css: /path/to/file.css",
    "json: varname = path/to/file.json",
    "text: varname=path/to/file.text",
    "arrayBuffer: varname = https://valid-ホスト.com/file.arrow",
    "bytes: varname = https://valid-ホスト.com/file.arrow"
  ];
  validLines.forEach(testCase => {
    it(`IS a valid fetch url"${testCase}"`, () => {
      expect(validFetchUrl(testCase)).toBe(true);
    });
  });

  const invalidLines = ["js: js: https://valid-host.com/file.js"];
  invalidLines.forEach(testCase => {
    it(`IS NOT a valid fetch url "${testCase}"`, () => {
      expect(validFetchUrl(testCase)).toBe(false);
    });
  });
});

describe("validate data fetch variable name", () => {
  const validLines = [
    "json:   foo  =   https://valid-host.com/file.json",
    `text: foo123 =   https://valid-host.com/file.txt`,
    "arrayBuffer: 変数  =   https://valid-host.com/file.arrow"
  ];
  validLines.forEach(testCase => {
    it(`has a VALID variable name "${testCase}"`, () => {
      expect(validVariableName(testCase)).toBe(true);
    });
  });

  const invalidLines = [
    "json: f o o = https://valid-host.com/file.json",
    `json: "foo" = https://valid-host.com/file.json`,
    "json: *foo = https://valid-host.com/file.json",
    "json: 1foo = https://valid-host.com/file.json"
  ];
  invalidLines.forEach(testCase => {
    it(`has an INVALID variable name "${testCase}"`, () => {
      expect(validVariableName(testCase)).toBe(false);
    });
  });
});
