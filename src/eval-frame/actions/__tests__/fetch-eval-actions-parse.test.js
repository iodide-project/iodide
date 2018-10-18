import {
  parseFetchCellLine,
  commentOnlyLine,
  emptyLine,
  parseAssignmentCommand,
  parseFetchCell,
} from '../fetch-cell-parser'

// test commentOnlyLine /////////////////////////
describe('correctly identify when a line IS a commentOnlyLine', () => {
  const lines = [
    '       // asdfas asdf /a/ asf/ fas // ',
    '//comment fasdkfj;lj        ',
    '  ///////////// comment',
  ]
  lines.forEach((testCase) => {
    it(`IS a comment only line: ${testCase}`, () => {
      expect(commentOnlyLine(testCase)).toEqual(true)
    })
  })
})

describe('correctly identify when a line IS NOT a commentOnlyLine', () => {
  const lines = [
    '  adsfa     // asdfas asdf /a/ asf/ fas // ',
    'https://comment//path/blah //fasdkfj;lj        ',
    '    / / / ////////// comment',
    '/   /',
    '      / /',
  ]
  lines.forEach((testCase) => {
    it(`is NOT a commentOnlyLine: "${testCase}"`, () => {
      expect(commentOnlyLine(testCase)).toEqual(false)
    })
  })
})


// test emptyLine /////////////////////////
describe('correctly identify when a line IS an emptyLine', () => {
  const lines = [
    '       ',
    '',
  ]
  lines.forEach((testCase) => {
    it(`IS a comment only line: "${testCase}"`, () => {
      expect(emptyLine(testCase)).toEqual(true)
    })
  })
})

describe('correctly identify when a line IS NOT a emptyLine', () => {
  const lines = [
    '  adsfa     // asdfas asdf /a/ asf/ fas // ',
    'https://comment//path/blah //fasdkfj;lj        ',
    '         /     ',
  ]
  lines.forEach((testCase) => {
    it(`is NOT a emptyLine: "${testCase}"`, () => {
      expect(emptyLine(testCase)).toEqual(false)
    })
  })
})


// test parseAssignmentCommand /////////////////////////
describe('parseAssignmentCommand gives correct results', () => {
  const assigmentCommands = [
    {
      command: 'foo =   https://d3js.org/d3.v5.min.js',
      result: {
        varName: 'foo',
        filePath: 'https://d3js.org/d3.v5.min.js',
        isRelPath: false,
      },
    },
    {
      command: 'foo=data/table.csv',
      result: {
        varName: 'foo',
        filePath: 'data/table.csv',
        isRelPath: true,
      },
    },
    {
      command: 'foo =data/table.csv',
      result: {
        varName: 'foo',
        filePath: 'data/table.csv',
        isRelPath: true,
      },
    },
    {
      command: 'f o o =   https://d3js.org/d3.v5.min.js',
      result: {
        error: 'INVALID_VARIABLE_NAME',
      },
    },
    {
      command: '"foo" =   https://d3js.org/d3.v5.min.js',
      result: {
        error: 'INVALID_VARIABLE_NAME',
      },
    },
    {
      command: '*foo =   https://d3js.org/d3.v5.min.js',
      result: {
        error: 'INVALID_VARIABLE_NAME',
      },
    },
  ]
  assigmentCommands.forEach((testCase) => {
    it(`command gives correct result: "${testCase.command}"`, () => {
      expect(parseAssignmentCommand(testCase.command)).toEqual(testCase.result)
    })
  })
})


// test parseAssignmentCommand /////////////////////////
const validFetchLines = [
  {
    line: 'js: https://d3js.org/d3.v5.min.js',
    result: {
      fetchType: 'js',
      filePath: 'https://d3js.org/d3.v5.min.js',
      isRelPath: false,
    },
  },
  {
    line: '  js: https://d3js.org/d3.v5.min.js //comment',
    result: {
      fetchType: 'js',
      filePath: 'https://d3js.org/d3.v5.min.js',
      isRelPath: false,
    },
  },
  {
    line: 'css: files/company-report-styles.css  // comment',
    result: {
      fetchType: 'css',
      filePath: 'files/company-report-styles.css',
      isRelPath: true,
    },
  },
  {
    line: ' file:   foo =   https://d3js.org/d3.v5.min.js //comment',
    result: {
      fetchType: 'file',
      varName: 'foo',
      filePath: 'https://d3js.org/d3.v5.min.js',
      isRelPath: false,
    },
  },
  {
    line: ' file:   $fo_o    =   /d3js.org/d3.v5.min.js //comment',
    result: {
      fetchType: 'file',
      varName: '$fo_o',
      filePath: '/d3js.org/d3.v5.min.js',
      isRelPath: true,
    },
  },
  {
    line: ' file:   ಠ_ಠ =   https://d3js.org/d3.v5.min.js //comment',
    result: {
      fetchType: 'file',
      varName: 'ಠ_ಠ',
      filePath: 'https://d3js.org/d3.v5.min.js',
      isRelPath: false,
    },
  },
]
describe('return valid results for valid fetch lines', () => {
  validFetchLines.forEach((testCase) => {
    it(`fetch line should return correct type: "${testCase.line}"`, () => {
      expect(parseFetchCellLine(testCase.line)).toEqual(testCase.result)
    })
  })
})

const invalidFetchLines = [
  {
    line: 'just made up irrelevant text',
    result: { error: 'MISSING_FETCH_TYPE' },
  },
  {
    line: 'image: just made up irrelevant text',
    result: { error: 'INVALID_FETCH_TYPE' },
  },
  {
    line: 'js : just made up irrelevant text',
    result: { error: 'INVALID_FETCH_TYPE' },
  },
  {
    line: 'file: asd## = https://iodide.io/data/foo.csv',
    result: { error: 'INVALID_VARIABLE_NAME' },
  },
]

describe('return correct errors for invalid fetch lines', () => {
  invalidFetchLines.forEach((testCase) => {
    it(`invalid fetch lines should return correct error "${testCase.line}"`, () => {
      expect(parseFetchCellLine(testCase.line).error)
        .toEqual(testCase.result.error)
    })
  })
})


describe('return correct number of fetch cell fetches', () => {
  const fetchCellText1 = `
file: asd## = https://iodide.io/data/foo.csv


// some comment

js: http://foo.com/bar.js
css: data/style.css
`
  it('fetch cell text case 1', () => {
    expect(parseFetchCell(fetchCellText1).length)
      .toEqual(3)
  })

  const fetchCellText2 = `

//  comment
            // comment

file: foo = https://iodide.io/data/foo.csv


// some comment

`
  it('fetch cell text case 2', () => {
    expect(parseFetchCell(fetchCellText2).length)
      .toEqual(1)
  })
})
