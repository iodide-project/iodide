export const simpleTypes = {
  number_int: 232937,
  number_float: 453.12312312,
  number_zero: 0,
  number_negative: -534.23,
  number_exp: 10e55,
  number_nan: NaN,
  number_inf: Infinity,
  string_empty: "",
  string_short: "asjhdflkdskfhla",
  string_medium: "abcd ".repeat(100),
  boolean_true: true,
  boolean_false: false,
  simple_undef: undefined,
  simple_null: null,
  symbol: Symbol.for("test_symbol"),
  symbol_long: Symbol.for("test_symbol_with_a_very_long_symbol_name")
};

// ==================== longStrings

const stringCountToN = (N, sep = "") =>
  Array(N)
    .fill(0)
    .map((x, i) => String(i))
    .join(sep);

export const longStrings = {
  string_withSpaces_countTo100: stringCountToN(100, " "),
  string_withSpaces_countTo2000: stringCountToN(2000, " "),
  string_withSpaces_countTo30000: stringCountToN(30000, " "),
  string_noSpaces_countTo100: stringCountToN(100, "and"),
  string_noSpaces_countTo2000: stringCountToN(2000, "and"),
  string_noSpaces_countTo30000: stringCountToN(30000, "and")
};

// ==================== arrays

const N_ARRAY = 10000;

export const longValueArrays = {};
Object.keys(simpleTypes).forEach(type => {
  longValueArrays[`array_long_${type}`] = new Array(N_ARRAY).fill(
    simpleTypes[type]
  );
});
longValueArrays.array_long_mixed = new Array(1000)
  .fill(Object.values(simpleTypes))
  .reduce((a, b) => a.concat(b), []);

// array lengths chosen to show different collpse behavior
export const arrayBuffers = {
  buffer_arrayBuffer: new ArrayBuffer(18462),
  buffer_dataView: new DataView(new ArrayBuffer(76172), 0),
  typedArray_Int8Array: new Int8Array(109472).map((_, i) => i),
  typedArray_Uint8Array: new Uint8Array(21618).map((_, i) => i),
  typedArray_Uint8ClampedArray: new Uint8ClampedArray(9321).map((_, i) => i),
  typedArray_Int16Array: new Int16Array(39123).map((_, i) => i),
  typedArray_Uint16Array: new Uint16Array(9373).map((_, i) => i),
  typedArray_Int32Array: new Int32Array(8172).map((_, i) => i),
  typedArray_Uint32Array: new Uint32Array(13090).map((_, i) => i),
  typedArray_Float32Array: new Float32Array(27021).map(
    (_, i) => Math.cos(i) ** 2 + i
  ),
  typedArray_Float64Array: new Float64Array(8725).map(
    (_, i) => Math.cos(i) ** 2 + i
  )
  // spec-ed, not yet implemented
  // BigInt64Array: new BigInt64Array(1000),
  // BigUint64Array: new BigUint64Array(1000)
};

// ==================== functions

function doublerFn(x) {
  return x * 2;
}

function aFunctionWithAnExcessivelyLongName(a, b, c, d, e, f, g) {
  return [a, b, c, d, e, f, g];
}

function nuller() {
  return null;
}

function arrayer(a, b, c, d, e) {
  return [a, b, c, d, e];
}

function* doublerGen(x, y, z) {
  for (let i = 0; i < 10; i++) {
    yield 2 * x + y + z;
  }
}
async function asyncDoublerFn(x) {
  return 2 * x;
}

export const functions = {
  // eslint-disable-next-line
  fn_anonymous: function(x) {
    return x * 2;
  },
  fn_arrow: x => x * 2,
  fn_named: doublerFn,
  fn_namedLong: aFunctionWithAnExcessivelyLongName,
  fn_namedNoArgs: nuller,
  fn_namedManyArgs: arrayer,
  fn_namedGenerator: doublerGen,
  fn_namedAsync: asyncDoublerFn
};

// ==================== errors

class UserDefinedError extends Error {}
class UserDefinedErrorWithANameThatIsCrazyLong extends Error {}

export const errors = {
  error_baseError: new Error("test error message"),
  error_EvalError: new EvalError("test error message"),
  error_RangeError: new RangeError("test error message"),
  error_ReferenceError: new ReferenceError("test error message"),
  error_SyntaxError: new SyntaxError("test error message"),
  error_TypeError: new TypeError("test error message"),
  error_URIError: new URIError("test error message"),
  error_custom: new UserDefinedError("test error message"),
  error_customLong: new UserDefinedErrorWithANameThatIsCrazyLong(
    "test error message"
  )
};

// ==================== base objects

export const baseObjects = {
  array_empty: [],
  array_emptyWithLength: new Array(100),
  object_empty: {},
  date: new Date("2000-01-01"),
  regex: /^.*$/,
  regex_long: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  map: new Map([[1, "one"], [2, "two"], [3, "three"]]),
  map_big: new Map([
    [1, "one"],
    [2, "two"],
    [Math.random, "three"],
    [{ a: 1, b: 2 }, 54321],
    ["6453423", { c: 654, g: 76543 }],
    ...new Array(1000)
      .fill(0)
      .map((_, i) => [{ [i]: `string ${i}` }, { sinPlusI: i + Math.sin(i) }])
  ]),
  map_empty: new Map(),
  set: new Set([1, 2, 3, 4, 5]),
  set_long: new Set(
    new Array(1000).fill(0).map((_, i) => i + Math.sin(i) ** 2)
  ),
  set_empty: new Set(),
  weakSet_empty: new WeakSet(),
  weakMap_empty: new WeakMap()
};

// ==================== arrays of base objects

export const arraysOfBaseObjects = {};
Object.keys(baseObjects).forEach(k => {
  arraysOfBaseObjects[`arrayOfObj_${k}`] = new Array(1000).fill(baseObjects[k]);
});

// ==================== composite objects

export const compositeObjects = {
  object_plainComposite1: {
    id: 2,
    name: "An ice sculpture",
    price: 12.5,
    tags: ["cold", "ice"],
    time: new Date("2005-04-03"),
    description: "a very long description string ... ".repeat(1000),
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

  object_plainComposite2: {
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

  object_plainComposite3: {
    a_super_long_property_name_for_the_smallest_value: -Infinity,
    "1long :string;= prop name for the biggest value": Infinity,
    a1: 1,
    a2: "A2",
    a3: true,
    a4: undefined,
    a5: {
      "a5-1": null,
      "a5-2": ["a5-2-1", "a5-2-2"],
      "a5-3": {}
    },
    a6: () => Math.sin(Math.random()),
    a7: new Date("2005-04-03"),
    [Symbol("a symbol key")]: Symbol("a symbol value"),
    [Symbol(
      "a symbol key whose name is longer than is even reasonable"
    )]: new Array(100).fill(7),
    1234: "a prop with a numeric key",
    embbiggenString(s) {
      return s + s;
    }
  }
};

// ==================== custom classes

class Animal {
  constructor(name) {
    this.name = name;
    this.isMortal = true;
  }
  speak() {
    return `${this.name} makes an animal noise.`;
  }
}

class Dog extends Animal {
  constructor(name) {
    super(`${name} the dog`);
    this.wagging = false;
  }

  speak() {
    return `${this.name} makes a "woofing" noise.`;
  }

  toggleWag() {
    this.wagging = !this.wagging;
  }
}

class AVeryLongKindOfDogLikeADachsundProbably extends Dog {
  constructor(name, length) {
    super(`${name} the dog`);
    this.wagging = false;
    this.length = length;
  }

  speak() {
    return `${this.name} emits a shrill chirp.`;
  }

  toggleWag() {
    this.wagging = !this.wagging;
  }
}

export const customClassCases = {
  class_1: new Animal("Socrates"),
  class_subclass: new Dog("Fido"),
  class_longClassName: new AVeryLongKindOfDogLikeADachsundProbably(
    "Fido",
    "43cm"
  )
};

// ==================== built-ins

export const builtInObjectCases = {
  builtin_math: Math,
  builtin_json: JSON,
  builtin_window: window
};
if (window.document !== undefined) {
  builtInObjectCases.builtin_document = window.document;
  builtInObjectCases.builtin_documentBody = window.document.body;
}

// ==================== Promise

export const promiseCases = {
  promise: new Promise(() => "resolve", () => "reject"),
  // this cause problems with node that show up in jest when testing
  // see: https://github.com/facebook/jest/issues/5311
  // uncomment this for storybook testing, but be sure to comment it
  // before committing
  // promise_reject: Promise.reject(
  //   new Error("REPS_VALUE_TEST_CASE:_PROMISE_REJECT")
  // ),
  promise_resolve: Promise.resolve()
};

// ==================== tabular

export const rowTableCases = {
  rowsTable_plainObjects: new Array(100).fill(0).map((x, i) => ({
    index: i,
    time: new Date(),
    id: Math.sin(i)
  })),
  rowsTable_compositeObjects: new Array(100).fill(compositeObjects),
  rowsTable_objectsContainingSimpleTypes: new Array(100).fill(simpleTypes),
  rowsTable_objectsContainingBaseObjects: new Array(364).fill(baseObjects)
};

export const rowTableFails = {
  array_oneEmptyObject: [{}],
  array_justOneObject: [{ a: 1, b: 2, c: 3 }],
  array_classInstances: new Array(100).fill(new Dog("Fido")),
  array_objectsWithAllDifferentKeys: new Array(100)
    .fill(0)
    .map((x, i) => ({ [`key_${i}`]: i, b: i, c: i })),
  array_objectsWithSomeDifferentKeys: new Array(100)
    .fill(0)
    .map((x, i) => ({ [`key_${i % 2}`]: i, b: i, c: i }))
};

// ==================== blobs

export const blobObjects = {
  blob_fromJson: new Blob([JSON.stringify({ hello: "world" }, null, 2)], {
    type: "application/json"
  })
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
  customClassCases,
  builtInObjectCases,
  promiseCases,
  rowTableCases,
  rowTableFails,
  blobObjects
);
