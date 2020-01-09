import {
  parseFFOrSafari,
  parseChromeOld,
  parseChromeNew,
  chromeStackLineHeadRe
} from "../eval-by-script-tag-stack-summary";

const firefoxStacks = [
  {
    stack: `@blob:http://localhost:8000/d6da3813-192b-468c-aee0-0eacc32bb464 line 2 > eval:2:4
@blob:http://localhost:8000/d6da3813-192b-468c-aee0-0eacc32bb464:2:33`,
    parsed: [
      {
        functionName: "",
        tracebackId: "d6da3813-192b-468c-aee0-0eacc32bb464",
        lineNumber: 2,
        columnNumber: 4
      }
    ]
  },
  {
    stack: `@blob:http://localhost:8000/a600a746-031f-46fb-8c67-a48557466867 line 2 > eval:4:13
@blob:http://localhost:8000/a600a746-031f-46fb-8c67-a48557466867 line 2 > eval:4:6
@blob:http://localhost:8000/a600a746-031f-46fb-8c67-a48557466867:2:33`,
    parsed: [
      {
        functionName: "",
        tracebackId: "a600a746-031f-46fb-8c67-a48557466867",
        lineNumber: 4,
        columnNumber: 13
      },
      {
        functionName: "",
        tracebackId: "a600a746-031f-46fb-8c67-a48557466867",
        lineNumber: 4,
        columnNumber: 6
      }
    ]
  },
  {
    stack: `failTest@blob:http://localhost:8000/d666d25c-6b52-4cb6-a3c9-0d6f30d59e84:3:18
@blob:http://localhost:8000/ddef1bb2-3561-4d41-9500-917a5fdecc9f line 2 > eval:1:9
@blob:http://localhost:8000/ddef1bb2-3561-4d41-9500-917a5fdecc9f:2:33`,
    parsed: [
      {
        functionName: "failTest",
        tracebackId: "d666d25c-6b52-4cb6-a3c9-0d6f30d59e84",
        lineNumber: 3,
        columnNumber: 18
      },
      {
        functionName: "",
        tracebackId: "ddef1bb2-3561-4d41-9500-917a5fdecc9f",
        lineNumber: 1,
        columnNumber: 9
      }
    ]
  },
  {
    stack: `failTest@blob:http://localhost:8000/d666d25c-6b52-4cb6-a3c9-0d6f30d59e84:3:18
failTest2@blob:http://localhost:8000/67eddeb7-42f8-4b78-9ef8-abc36889bdd7 line 2 > eval:2:24
failTest3@blob:http://localhost:8000/67eddeb7-42f8-4b78-9ef8-abc36889bdd7 line 2 > eval:16:16
@blob:http://localhost:8000/c7af4998-6e4a-4049-920d-13b4b3624d9c line 2 > eval:3:12
@blob:http://localhost:8000/c7af4998-6e4a-4049-920d-13b4b3624d9c:2:33`,
    parsed: [
      {
        functionName: "failTest",
        tracebackId: "d666d25c-6b52-4cb6-a3c9-0d6f30d59e84",
        lineNumber: 3,
        columnNumber: 18
      },
      {
        functionName: "failTest2",
        tracebackId: "67eddeb7-42f8-4b78-9ef8-abc36889bdd7",
        lineNumber: 2,
        columnNumber: 24
      },
      {
        functionName: "failTest3",
        tracebackId: "67eddeb7-42f8-4b78-9ef8-abc36889bdd7",
        lineNumber: 16,
        columnNumber: 16
      },
      {
        functionName: "",
        tracebackId: "c7af4998-6e4a-4049-920d-13b4b3624d9c",
        lineNumber: 3,
        columnNumber: 12
      }
    ]
  },
  {
    stack: `failTest@blob:http://localhost:8000/d666d25c-6b52-4cb6-a3c9-0d6f30d59e84:3:18
@blob:http://localhost:8000/4ef5e1c2-dbf7-4cca-80b5-939a45ee5ded line 2 > eval line 1 > eval line 5 > eval:4:14
@blob:http://localhost:8000/4ef5e1c2-dbf7-4cca-80b5-939a45ee5ded line 2 > eval line 1 > eval:5:3
@blob:http://localhost:8000/4ef5e1c2-dbf7-4cca-80b5-939a45ee5ded line 2 > eval:1:13
@blob:http://localhost:8000/4ef5e1c2-dbf7-4cca-80b5-939a45ee5ded:2:33`,
    parsed: [
      {
        functionName: "failTest",
        tracebackId: "d666d25c-6b52-4cb6-a3c9-0d6f30d59e84",
        lineNumber: 3,
        columnNumber: 18
      },
      {
        functionName: "",
        tracebackId: "4ef5e1c2-dbf7-4cca-80b5-939a45ee5ded",
        lineNumber: 4,
        columnNumber: 14,
        evalInUserCode: true
      },
      {
        functionName: "",
        tracebackId: "4ef5e1c2-dbf7-4cca-80b5-939a45ee5ded",
        lineNumber: 5,
        columnNumber: 3,
        evalInUserCode: true
      },
      {
        functionName: "",
        tracebackId: "4ef5e1c2-dbf7-4cca-80b5-939a45ee5ded",
        lineNumber: 1,
        columnNumber: 13
      }
    ]
  },
  {
    stack: `failTest@blob:http://localhost:8000/d666d25c-6b52-4cb6-a3c9-0d6f30d59e84:3:18
failTest2@blob:http://localhost:8000/13fccf0f-4b5f-42a8-9e31-55cd2b604b70 line 2 > eval:3:24
memoized@blob:http://localhost:8000/533ead26-ded8-4613-bd69-de650bde5bb7:10552:27
@blob:http://localhost:8000/7cf46998-8771-4016-b940-8c92aec65441 line 2 > eval:3:22
@blob:http://localhost:8000/7cf46998-8771-4016-b940-8c92aec65441:2:33`,
    parsed: [
      {
        functionName: "failTest",
        tracebackId: "d666d25c-6b52-4cb6-a3c9-0d6f30d59e84",
        lineNumber: 3,
        columnNumber: 18
      },
      {
        functionName: "failTest2",
        tracebackId: "13fccf0f-4b5f-42a8-9e31-55cd2b604b70",
        lineNumber: 3,
        columnNumber: 24
      },
      {
        functionName: "memoized",
        tracebackId: "533ead26-ded8-4613-bd69-de650bde5bb7",
        lineNumber: 10552,
        columnNumber: 27
      },
      {
        functionName: "",
        tracebackId: "7cf46998-8771-4016-b940-8c92aec65441",
        lineNumber: 3,
        columnNumber: 22
      }
    ]
  },
  {
    stack: `failTest2@blob:http://localhost:8000/13fccf0f-4b5f-42a8-9e31-55cd2b604b70 line 2 > eval:6:18
memoized@blob:http://localhost:8000/533ead26-ded8-4613-bd69-de650bde5bb7:10552:27
memff@blob:http://localhost:8000/dfeb3e06-b116-407f-80de-a09ec84fd0b2 line 2 > eval:5:18
@blob:http://localhost:8000/b4cb21b0-4004-4721-b62f-320b93a5dee9 line 2 > eval line 1 > eval:1:6
@blob:http://localhost:8000/b4cb21b0-4004-4721-b62f-320b93a5dee9 line 2 > eval:1:1
@blob:http://localhost:8000/b4cb21b0-4004-4721-b62f-320b93a5dee9:2:33`,
    parsed: [
      {
        functionName: "failTest2",
        tracebackId: "13fccf0f-4b5f-42a8-9e31-55cd2b604b70",
        lineNumber: 6,
        columnNumber: 18
      },
      {
        functionName: "memoized",
        tracebackId: "533ead26-ded8-4613-bd69-de650bde5bb7",
        lineNumber: 10552,
        columnNumber: 27
      },
      {
        functionName: "memff",
        tracebackId: "dfeb3e06-b116-407f-80de-a09ec84fd0b2",
        lineNumber: 5,
        columnNumber: 18
      },
      {
        functionName: "",
        tracebackId: "b4cb21b0-4004-4721-b62f-320b93a5dee9",
        lineNumber: 1,
        columnNumber: 6,
        evalInUserCode: true
      },
      {
        functionName: "",
        tracebackId: "b4cb21b0-4004-4721-b62f-320b93a5dee9",
        lineNumber: 1,
        columnNumber: 1
      }
    ]
  }
];

describe("correctly parse Firefox stacks", () => {
  firefoxStacks.forEach(({ stack, parsed }, i) => {
    const caseParsed = parseFFOrSafari(stack.split("\n"));
    it(`correctly parse Firefox stack case ${i}; stack:\n\`${stack}\``, () => {
      expect(caseParsed).toEqual(parsed);
    });
  });
});

// ====================================
// chrome
// ====================================

// const chromeStackLines = [
//   {
//     line:
//       "    at eval (eval at <anonymous> (blob:http://localhost:8000/2aebdf4e-1787-404c-8704-81107742bca8:2:33), <anonymous>:4:17)",
//     groups: [
//       "eval",
//       " (eval at <anonymous> ",
//       "ee06386b-3b4a-44a7-a939-44199384f43f",
//       "4",
//       "17"
//     ]
//   },
//   {
//     line:
//       "    at eval (eval at <anonymous> (ee06386b-3b4a-44a7-a939-44199384f43f:2), <anonymous>:4:15)",
//     groups: [
//       "eval",
//       " (eval at <anonymous> ",
//       "ee06386b-3b4a-44a7-a939-44199384f43f",
//       "4",
//       "17"
//     ]
//   }
// ];

// //    at failTest (blob:http://localhost:8000/6c90e86d-9878-4a25-9dee-f2c7c6fb2c4f:4:18)
// //    at eval (eval at <anonymous> (blob:http://localhost:8000/b16301fd-c279-496b-95ed-bd38ce9e1921:2:33), <anonymous>:1:1)

// describe("chrome regex returns correct groups", () => {
//   chromeStackLines.forEach(({ line, groups }, i) => {
//     const matchedGroups = line.match(chromeStackLineHeadRe).slice(1);
//     it(`correctly chrome regex for case ${i}; line:\n\`${line}\``, () => {
//       expect(matchedGroups).toEqual(groups);
//     });
//   });
// });

const chromeStacksOld = [
  {
    stack: `ReferenceError: bb is not defined
    at eval (eval at <anonymous> (9ecd3231-b49f-44fa-b5be-f671f37310a9:2), <anonymous>:2:4)
    at eval (<anonymous>)
    at 9ecd3231-b49f-44fa-b5be-f671f37310a9:2`,
    parsed: [
      {
        functionName: "",
        tracebackId: "9ecd3231-b49f-44fa-b5be-f671f37310a9",
        lineNumber: 2,
        columnNumber: 4
      }
    ]
  },
  {
    stack: `TypeError: Cannot read property 'trim' of undefined
    at eval (eval at <anonymous> (ee06386b-3b4a-44a7-a939-44199384f43f:2), <anonymous>:4:15)
    at Array.map (<anonymous>)
    at eval (eval at <anonymous> (ee06386b-3b4a-44a7-a939-44199384f43f:2), <anonymous>:4:6)
    at eval (<anonymous>)
    at ee06386b-3b4a-44a7-a939-44199384f43f:2`,
    parsed: [
      {
        functionName: "",
        tracebackId: "ee06386b-3b4a-44a7-a939-44199384f43f",
        lineNumber: 4,
        columnNumber: 15
      },
      {
        functionName: "",
        tracebackId: "ee06386b-3b4a-44a7-a939-44199384f43f",
        lineNumber: 4,
        columnNumber: 6
      }
    ]
  },
  {
    stack: `TypeError: x.fakeMethod is not a function
    at failTest (b81ec193-9a86-44f0-9a77-801a451ecc94:3)
    at eval (eval at <anonymous> (25148751-415f-452d-8e24-d27a07fc5b3c:2), <anonymous>:1:1)
    at eval (<anonymous>)
    at 25148751-415f-452d-8e24-d27a07fc5b3c:2`,
    parsed: [
      {
        functionName: "failTest",
        tracebackId: "b81ec193-9a86-44f0-9a77-801a451ecc94",
        lineNumber: 3
      },
      {
        functionName: "",
        tracebackId: "25148751-415f-452d-8e24-d27a07fc5b3c",
        lineNumber: 1,
        columnNumber: 1
      }
    ]
  },
  {
    stack: `TypeError: x.fakeMethod is not a function
    at failTest (b81ec193-9a86-44f0-9a77-801a451ecc94:3)
    at failTest2 (eval at <anonymous> (6ce0d6a8-c976-4129-9618-9204fff00ada:2), <anonymous>:3:16)
    at failTest3 (eval at <anonymous> (6ce0d6a8-c976-4129-9618-9204fff00ada:2), <anonymous>:17:16)
    at eval (eval at <anonymous> (de90461d-fe44-4944-bce3-2afe0b6c1d8a:2), <anonymous>:3:3)
    at eval (<anonymous>)
    at de90461d-fe44-4944-bce3-2afe0b6c1d8a:2`,
    parsed: [
      {
        functionName: "failTest",
        tracebackId: "b81ec193-9a86-44f0-9a77-801a451ecc94",
        lineNumber: 3
      },
      {
        functionName: "failTest2",
        tracebackId: "6ce0d6a8-c976-4129-9618-9204fff00ada",
        lineNumber: 3,
        columnNumber: 16
      },
      {
        functionName: "failTest3",
        tracebackId: "6ce0d6a8-c976-4129-9618-9204fff00ada",
        lineNumber: 17,
        columnNumber: 16
      },
      {
        functionName: "",
        tracebackId: "de90461d-fe44-4944-bce3-2afe0b6c1d8a",
        lineNumber: 3,
        columnNumber: 3
      }
    ]
  },
  {
    stack: `TypeError: x.fakeMethod is not a function
    at failTest (b81ec193-9a86-44f0-9a77-801a451ecc94:3)
    at eval (eval at <anonymous> (eval at <anonymous> (eval at <anonymous> (fa39f3b8-a303-4908-906e-a2cc633c8768:2))), <anonymous>:4:6)
    at eval (eval at <anonymous> (eval at <anonymous> (fa39f3b8-a303-4908-906e-a2cc633c8768:2)), <anonymous>:5:3)
    at eval (eval at <anonymous> (fa39f3b8-a303-4908-906e-a2cc633c8768:2), <anonymous>:1:13)
    at eval (<anonymous>)
    at fa39f3b8-a303-4908-906e-a2cc633c8768:2`,
    parsed: [
      {
        functionName: "failTest",
        tracebackId: "b81ec193-9a86-44f0-9a77-801a451ecc94",
        lineNumber: 3
      },
      {
        functionName: "",
        tracebackId: "fa39f3b8-a303-4908-906e-a2cc633c8768",
        lineNumber: 4,
        columnNumber: 6,
        evalInUserCode: true
      },
      {
        functionName: "",
        tracebackId: "fa39f3b8-a303-4908-906e-a2cc633c8768",
        lineNumber: 5,
        columnNumber: 3,
        evalInUserCode: true
      },
      {
        functionName: "",
        tracebackId: "fa39f3b8-a303-4908-906e-a2cc633c8768",
        lineNumber: 1,
        columnNumber: 13
      }
    ]
  },
  {
    stack: `TypeError: x.fakeMethod is not a function
    at failTest (b81ec193-9a86-44f0-9a77-801a451ecc94:3)
    at failTest2 (eval at <anonymous> (6ce0d6a8-c976-4129-9618-9204fff00ada:2), <anonymous>:3:16)
    at memoized (0d071643-65d2-41b5-a002-78be6a6673fa:10552)
    at eval (eval at <anonymous> (afb94ea0-f618-4d65-856c-5d8ab2fbd1f0:2), <anonymous>:3:20)
    at eval (<anonymous>)
    at afb94ea0-f618-4d65-856c-5d8ab2fbd1f0:2`,
    parsed: [
      {
        functionName: "failTest",
        tracebackId: "b81ec193-9a86-44f0-9a77-801a451ecc94",
        lineNumber: 3
      },
      {
        functionName: "failTest2",
        tracebackId: "6ce0d6a8-c976-4129-9618-9204fff00ada",
        lineNumber: 3,
        columnNumber: 16
      },
      {
        functionName: "memoized",
        tracebackId: "0d071643-65d2-41b5-a002-78be6a6673fa",
        lineNumber: 10552
      },
      {
        functionName: "",
        tracebackId: "afb94ea0-f618-4d65-856c-5d8ab2fbd1f0",
        lineNumber: 3,
        columnNumber: 20
      }
    ]
  },
  {
    stack: `TypeError: x.fakeMethod_4 is not a function
    at failTest2 (eval at <anonymous> (6ce0d6a8-c976-4129-9618-9204fff00ada:2), <anonymous>:6:18)
    at memoized (0d071643-65d2-41b5-a002-78be6a6673fa:10552)
    at memff (eval at <anonymous> (db9dc30a-5f19-4c59-b57a-661917246598:2), <anonymous>:5:16)
    at eval (eval at <anonymous> (eval at <anonymous> (df482ed2-2b32-4dfa-85fc-0b109a2a6752:2)), <anonymous>:1:1)
    at eval (eval at <anonymous> (df482ed2-2b32-4dfa-85fc-0b109a2a6752:2), <anonymous>:1:1)
    at eval (<anonymous>)
    at df482ed2-2b32-4dfa-85fc-0b109a2a6752:2`,
    parsed: [
      {
        functionName: "failTest2",
        tracebackId: "6ce0d6a8-c976-4129-9618-9204fff00ada",
        lineNumber: 6,
        columnNumber: 18
      },
      {
        functionName: "memoized",
        tracebackId: "0d071643-65d2-41b5-a002-78be6a6673fa",
        lineNumber: 10552
      },
      {
        functionName: "memff",
        tracebackId: "db9dc30a-5f19-4c59-b57a-661917246598",
        lineNumber: 5,
        columnNumber: 16
      },
      {
        functionName: "",
        tracebackId: "df482ed2-2b32-4dfa-85fc-0b109a2a6752",
        lineNumber: 1,
        columnNumber: 1,
        evalInUserCode: true
      },
      {
        functionName: "",
        tracebackId: "df482ed2-2b32-4dfa-85fc-0b109a2a6752",
        lineNumber: 1,
        columnNumber: 1
      }
    ]
  }
];

describe("correctly parse old Chrome stacks", () => {
  chromeStacksOld.forEach(({ stack, parsed }, i) => {
    const caseParsed = parseChromeOld(stack.split("\n"));
    it(`correctly parse Chrome stack case ${i}; stack:\n\`${stack}\``, () => {
      expect(caseParsed).toEqual(parsed);
    });
  });
});

const chromeStacksNew = [
  {
    stack: `TypeError: Cannot read property 'trim' of undefined
    at eval (eval at <anonymous> (blob:http://localhost:8000/2aebdf4e-1787-404c-8704-81107742bca8:2:33), <anonymous>:4:17)
    at Array.map (<anonymous>)
    at eval (eval at <anonymous> (blob:http://localhost:8000/2aebdf4e-1787-404c-8704-81107742bca8:2:33), <anonymous>:4:6)
    at eval (<anonymous>)
    at blob:http://localhost:8000/2aebdf4e-1787-404c-8704-81107742bca8:2:33`,
    parsed: [
      {
        functionName: "",
        tracebackId: "2aebdf4e-1787-404c-8704-81107742bca8",
        lineNumber: 4,
        columnNumber: 17
      },
      {
        functionName: "",
        tracebackId: "2aebdf4e-1787-404c-8704-81107742bca8",
        lineNumber: 4,
        columnNumber: 6
      }
    ]
  },
  {
    stack: ` TypeError: x.fakeMethod is not a function
    at failTest (blob:http://localhost:8000/6c90e86d-9878-4a25-9dee-f2c7c6fb2c4f:4:18)
    at eval (eval at <anonymous> (blob:http://localhost:8000/b16301fd-c279-496b-95ed-bd38ce9e1921:2:33), <anonymous>:1:1)
    at eval (<anonymous>)
    at blob:http://localhost:8000/b16301fd-c279-496b-95ed-bd38ce9e1921:2:33`,
    parsed: [
      {
        functionName: "failTest",
        tracebackId: "6c90e86d-9878-4a25-9dee-f2c7c6fb2c4f",
        lineNumber: 4,
        columnNumber: 18
      },
      {
        functionName: "",
        tracebackId: "b16301fd-c279-496b-95ed-bd38ce9e1921",
        lineNumber: 1,
        columnNumber: 1
      }
    ]
  }
];

describe("correctly parse new Chrome stacks", () => {
  chromeStacksNew.forEach(({ stack, parsed }, i) => {
    const caseParsed = parseChromeNew(stack.split("\n"));
    it(`correctly parse Chrome stack case ${i}; stack:\n\`${stack}\``, () => {
      expect(caseParsed).toEqual(parsed);
    });
  });
});
