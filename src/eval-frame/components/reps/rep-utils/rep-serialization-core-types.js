// THIS FILE SHOULD NOT IMPORT ANYTHING.
// It acts as top-level type definitions, and shouldn't rely on
// other code for functionality... because it shouldn't really have
// "functionality" per se

// These are just a container classes to clarify semantics and
// to clarify code by not putting plain objects everywhere.
// All of these containers need to be serializable, so they
// should not have methods, and definitely no internal state
// or internal state mutation.
// They are really basically to be used as type definitions,
// since the rep serialization machinery benefits from precise types.

// one day we'll move to typescript and replace all this with proper types/interfaces/whatever.

const nonExpandableTypes = [
  "Function",
  "GeneratorFunction",
  "Date",
  "RegExp",
  "ArrayBuffer",
  "DataView"
];

function checkTypes(keyedArgs, argTypes, fnName) {
  Object.keys(keyedArgs).forEach(key => {
    const arg = keyedArgs[key];
    const expectedType = argTypes[key];

    // eslint-disable-next-line valid-typeof
    if (typeof arg !== expectedType) {
      const actualType = typeof arg;
      throw new TypeError(
        `invalid inputs types for ${fnName} ${JSON.stringify({
          arg,
          expectedType,
          actualType
        })}; (full args${JSON.stringify(keyedArgs)})`
      );
    }
  });
}

export class ValueSummary {
  // Contains top-level summary info about an object/value,
  // but without info about child objects.
  // This info is sufficient to produce a "tiny rep"
  constructor(objType, size, stringValue, isTruncated) {
    if (process.env.NODE_ENV !== "production") {
      checkTypes(
        { objType, size, stringValue, isTruncated },
        {
          objType: "string",
          size: "number",
          stringValue: "string",
          isTruncated: "boolean"
        },
        "ValueSummary"
      );
    }
    this.objType = objType; // string
    this.size = size; // number
    this.stringValue = stringValue; // string
    this.isTruncated = isTruncated; // bool

    let isExpandable;
    if (nonExpandableTypes.includes(this.objType)) {
      isExpandable = false;
    } else if (this.objType === "String") {
      isExpandable = this.isTruncated;
    } else {
      isExpandable = this.size > 0;
    }
    this.isExpandable = isExpandable;
  }
}

export class RangeDescriptor {
  // Describes a range of indices among the children of an object.
  // IMPORTANT: these ranges are INCLUSIVE of their endpoints.
  constructor(min, max, type = "ARRAY_RANGE") {
    if (process.env.NODE_ENV !== "production") {
      checkTypes(
        { min, max, type },
        {
          max: "number",
          min: "number",
          type: "string"
        },
        "RangeDescriptor"
      );

      if (
        max < min ||
        min < 0 ||
        max < 0 ||
        !Number.isFinite(min) ||
        !Number.isFinite(max)
      ) {
        // note: can technically be equal since the ranges are inclusive
        throw new TypeError(
          `invalid range endpoints to RangeDescriptor ${JSON.stringify({
            max,
            min,
            type
          })}`
        );
      }
    }
    this.min = min; // numeric, required
    this.max = max; // numeric, required
    this.type = type;
  }
}

export class ChildSummaryItem {
  // an item in a ChildSummary. Contains
  // (1) a path, which can be a a key in an object, or a
  // RangeDescriptor to narrow in on a range
  // (2) a summary, which is null IFF the path is a RangeDescriptor
  constructor(path, summary) {
    this.path = path; // String or RangeDescriptor
    this.summary = summary; // ValueSummary or null
  }
}

export class SubstringRangeSummaryItem extends ChildSummaryItem {
  // a SubstringRangeSummaryItem always has `path` of class
  // RangeDescriptor and `summary` of class ValueSummary.
  // In this case, the ValueSummary is a substring of the
  // parent string
  constructor(path, summary) {
    super();
    this.path = path; // RangeDescriptor
    this.summary = summary; // ValueSummary
  }
}

export class MapPairSummaryItem extends ChildSummaryItem {
  constructor(mapEntryIndex, keySummary, valSummary) {
    super();
    this.path = mapEntryIndex; // int
    this.keySummary = keySummary; // ValueSummary
    this.valSummary = valSummary; // ValueSummary
  }
}

export class ChildSummary {
  // an instance of this class summarizes information about the children
  // of an object. These can be either values or ranges of indices.
  constructor(childItems) {
    if (process.env.NODE_ENV !== "production") {
      childItems.forEach(item => {
        if (!(item instanceof ChildSummaryItem)) {
          // note: can technically be equal since the ranges are inclusive
          throw new TypeError(`invalid range endpoints to RangeDescriptor`);
        }
      });
    }
    this.childItems = childItems;
  }
}
