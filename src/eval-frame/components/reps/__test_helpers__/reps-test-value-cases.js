export const simpleTypes = {
  int: 232937,
  float: 453.12312312,
  zero: 0,
  negative: -534.23,
  exp: 10e55,
  nan: NaN,
  inf: Infinity,
  emptyString: "",
  string: "asjhdflkdskfhla",
  boolTrue: true,
  boolFalse: false,
  undef: undefined,
  null: null,
  symbol: Symbol.for("test")
};

// ==================== longStrings

export const longStrings = {
  stringWithSpaces_100: "1234  ".repeat(20),
  stringWithSpaces_1000: "1234 ".repeat(200),
  stringWithSpaces_100000: "1234 ".repeat(20000),
  stringNoSpaces_100: "12345".repeat(20),
  stringNoSpaces_1000: "12345".repeat(200),
  stringNoSpaces_100000: "12345".repeat(20000)
};

// ==================== arrays

const N_ARRAY = 10000;

export const longValueArrays = {};
Object.keys(simpleTypes).forEach(type => {
  longValueArrays[`longArray_${type}`] = new Array(N_ARRAY).fill(
    simpleTypes[type]
  );
});
longValueArrays.longArray_mixed = new Array(1000)
  .fill(Object.values(simpleTypes))
  .reduce((a, b) => a.concat(b), []);

export const arrayBuffers = {
  arrayBuffer: new ArrayBuffer(N_ARRAY),
  dataView: new DataView(new ArrayBuffer(N_ARRAY), 0),
  Int8Array: new Int8Array(N_ARRAY),
  Uint8Array: new Uint8Array(N_ARRAY),
  Uint8ClampedArray: new Uint8ClampedArray(N_ARRAY),
  Int16Array: new Int16Array(N_ARRAY),
  Uint16Array: new Uint16Array(N_ARRAY),
  Int32Array: new Int32Array(N_ARRAY),
  Uint32Array: new Uint32Array(N_ARRAY),
  Float32Array: new Float32Array(N_ARRAY),
  Float64Array: new Float64Array(N_ARRAY)
  // spec-ed, not yet implemented
  // BigInt64Array: new BigInt64Array(1000),
  // BigUint64Array: new BigUint64Array(1000)
};

// ==================== functions

function doublerFn(x) {
  return x * 2;
}

function* doublerGen(x) {
  for (let i = 0; i < 10; i++) {
    yield 2 * x;
  }
}
async function asyncDoublerFn(x) {
  return 2 * x;
}

export const functions = {
  // eslint-disable-next-line
  fn: function(x) {
    return x * 2;
  },
  arrowFn: x => x * 2,
  namedFn: doublerFn,
  namedGenerator: doublerGen,
  namedAsyncFn: asyncDoublerFn
};

// ==================== errors

export const errors = {
  Error: new Error("test error message"),
  EvalError: new EvalError("test error message"),
  RangeError: new RangeError("test error message"),
  ReferenceError: new ReferenceError("test error message"),
  SyntaxError: new SyntaxError("test error message"),
  TypeError: new TypeError("test error message"),
  URIError: new URIError("test error message")
};

// ==================== base objects

export const baseObjects = {
  emptyArray: [],
  emptyObject: {},
  date: new Date("2000-01-01"),
  regex: /^.*$/,
  map: new Map([[1, "one"], [2, "two"], [3, "three"]]),
  emptyMap: new Map(),
  weakMap: new WeakMap(),
  set: new Set([1, 2, 3, 4, 5]),
  emptySet: new Set(),
  weakSet: new WeakSet()
};

// ==================== arrays of base objects

export const arraysOfBaseObjects = {};
Object.keys(baseObjects).forEach(k => {
  arraysOfBaseObjects[`arrayOfObj_${k}`] = new Array(1000).fill(baseObjects[k]);
});

// ==================== composite objects

export const compositeObjects = {
  compositeObject: {
    id: 2,
    name: "An ice sculpture",
    // "price": 12.50,
    tags: ["cold", "ice"],
    dimensions: {
      length: 7.0,
      width: 12.0,
      height: 9.5
    },
    warehouseLocation: {
      latitude: -78.75,
      longitude: 20.4
    }
  },

  compositeObject2: {
    glossary: {
      title: "example glossary",
      GlossDiv: {
        title: "S",
        GlossList: {
          GlossEntry: {
            ID: "SGML",
            SortAs: "SGML",
            GlossTerm: "Standard Generalized Markup Language",
            Acronym: "SGML",
            Abbrev: "ISO 8879:1986",
            GlossDef: {
              para:
                "A meta-markup language, used to create markup languages such as DocBook.",
              GlossSeeAlso: ["GML", "XML"]
            },
            GlossSee: "markup"
          }
        }
      }
    }
  },

  compositeObject3: {
    a1: 1,
    a2: "A2",
    a3: true,
    a4: undefined,
    a5: {
      "a5-1": null,
      "a5-2": ["a5-2-1", "a5-2-2"],
      "a5-3": {}
    },
    a6: () => {
      console.log("hello world");
    },
    a7: new Date("2005-04-03")
  }
};

// ==================== tabular

export const rowTableCases = {
  rowsWithSimpleObject: new Array(100)
    .fill(0)
    .map((x, i) => ({ a: i, b: i, c: i })),
  rowsWithSimpleTypes: new Array(100).fill(simpleTypes),
  rowsWithBaseObjects: new Array(100).fill(baseObjects),
  rowsWithCompositeObjects: new Array(100).fill(compositeObjects)
};

export const rowTableFails = {
  arrayWithOneEmptyObject: [{}],
  arrayWithJustOneObject: [{ a: 1, b: 2, c: 3 }],
  rowsWithAllDifferentKeys: new Array(100)
    .fill(0)
    .map((x, i) => ({ [`key_${i}`]: i, b: i, c: i })),
  rowsWithSomeDifferentKeys: new Array(100)
    .fill(0)
    .map((x, i) => ({ [`key_${i % 2}`]: i, b: i, c: i }))
};

// ==================== tests

export const allCases = Object.assign(
  {},
  simpleTypes,
  longStrings,
  longValueArrays,
  arrayBuffers,
  functions,
  errors,
  baseObjects,
  compositeObjects,
  rowTableCases,
  rowTableFails
);
