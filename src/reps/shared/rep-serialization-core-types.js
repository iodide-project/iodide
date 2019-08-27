// this file acts as top-level type definitions, and shouldn't rely on
// other code for functionality... because it shouldn't really have
// "functionality" per se

// These are just helper functions meant
// to clarify code by not putting plain objects everywhere.
// They are really basically to be used as type definitions,
// since the rep serialization machinery benefits from precise types.

// one day we'll move to typescript and replace all this with proper types/interfaces/whatever.

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
        })};

full args:
${JSON.stringify(keyedArgs)}
`
      );
    }
  });
}

export function newValueSummary(
  objType,
  size,
  stringValue,
  isTruncated,
  isExpandable
) {
  // Contains top-level summary info about an object/value,
  // but without info about child objects.
  // This info is sufficient to produce a "tiny rep"
  if (process.env.NODE_ENV !== "production") {
    checkTypes(
      { objType, size, stringValue, isTruncated, isExpandable },
      {
        objType: "string",
        size: "number",
        stringValue: "string",
        isTruncated: "boolean",
        isExpandable: "boolean"
      },
      "ValueSummary"
    );
  }

  return {
    objType,
    size,
    stringValue,
    isTruncated,
    isExpandable,
    DESC_TYPE: "ValueSummary"
  };
}

export function isValueSummary(obj) {
  return obj !== null && obj !== undefined && obj.DESC_TYPE === "ValueSummary";
}

export function newRangeDescriptor(min, max, type = "ARRAY_RANGE") {
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
  return {
    min,
    max,
    type,
    DESC_TYPE: "RangeDescriptor"
  };
}

export function isRangeDescriptor(obj) {
  return obj.DESC_TYPE === "RangeDescriptor";
}

export function newChildSummaryItem(path, summary) {
  return { path, summary, DESC_TYPE: "ChildSummaryItem" };
}

export function isChildSummaryItem(obj) {
  return (
    obj.DESC_TYPE === "ChildSummaryItem" ||
    obj.DESC_TYPE === "SubstringRangeSummaryItem" ||
    obj.DESC_TYPE === "MapPairSummaryItem"
  );
}

export function newSubstringRangeSummaryItem(path, summary) {
  return { path, summary, DESC_TYPE: "SubstringRangeSummaryItem" };
}

export function isSubstringRangeSummaryItem(obj) {
  return obj.DESC_TYPE === "SubstringRangeSummaryItem";
}

export const newMapPairSummaryItem = (
  mapEntryIndex,
  keySummary,
  valSummary
) => ({
  path: mapEntryIndex,
  keySummary,
  valSummary,
  DESC_TYPE: "MapPairSummaryItem"
});
export function isMapPairSummaryItem(obj) {
  return obj.DESC_TYPE === "MapPairSummaryItem";
}

export function newChildSummary(childItems) {
  if (process.env.NODE_ENV !== "production") {
    childItems.forEach(item => {
      if (!isChildSummaryItem(item)) {
        // note: can technically be equal since the ranges are inclusive
        throw new TypeError(`invalid range endpoints to RangeDescriptor`);
      }
    });
  }
  return { childItems, DESC_TYPE: "ChildSummary" };
}

export function isChildSummary(obj) {
  return obj.DESC_TYPE === "ChildSummary";
}
