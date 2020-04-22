const intOrUndefined = x => {
  const y = Number.parseInt(x, 10);
  return Number.isNaN(y) ? undefined : y;
};

const firefoxStackLineRe = /^(.*)@blob.*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(.*):([0-9]+):([0-9]+)$/;

// because the inner eval in the script-based js evaluator begins
// on line 2, in case of a stack including a plain user code chunk
// evaluation, *exactly* this text will always appear in third match
// group of the firefoxStackLineRe. If the third match group is an
// empty string, its an external file; if the group is anything else,
// it implies an `eval` in the user's code
const firefoxPlainChunkMatch = " line 2 > eval";

export const parseFFOrSafari = splitStack => {
  const parsed = splitStack
    .slice(0, -1)
    .map(line => line.match(firefoxStackLineRe))
    .filter(matches => matches !== null)
    .map(matches => {
      const [
        functionName,
        jsScriptTagBlobId,
        maybeUserEvals,
        lineNumber,
        columnNumber
      ] = matches.slice(1);
      const evalInUserCode =
        maybeUserEvals !== "" && maybeUserEvals !== firefoxPlainChunkMatch
          ? true
          : undefined;

      return {
        functionName,
        jsScriptTagBlobId,
        lineNumber: intOrUndefined(lineNumber),
        columnNumber: intOrUndefined(columnNumber),
        evalInUserCode
      };
    });

  return parsed;
};

const chromeStackLineHeadRe = /^ {4}at ([.\S]*)(.*)\(([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}):([0-9]+)\)(.*)$/;

const chromeOldStackLineHeadRe = chromeStackLineHeadRe;

const chromeStackLineTailRe = /.*:([0-9]+):([0-9]+)\)$/;

// see note above about plain chunk match for FF
const chromePlainChunkMatch = " (eval at <anonymous> ";

export const parseChromeOld = splitStack => {
  const parsed = splitStack
    .slice(1, -2)
    .map(line => line.match(chromeOldStackLineHeadRe))
    .filter(matches => matches !== null)
    .map(matches => {
      const [
        functionName,
        maybeUserEvals,
        jsScriptTagBlobId,
        maybeLineNumber,
        lineTail
      ] = matches.slice(1);

      const [lineNumber, columnNumber] =
        lineTail !== ""
          ? lineTail.match(chromeStackLineTailRe).slice(1)
          : [undefined, undefined];

      const evalInUserCode =
        maybeUserEvals !== " " && maybeUserEvals !== chromePlainChunkMatch
          ? true
          : undefined;

      return {
        functionName: functionName !== "eval" ? functionName : "",
        jsScriptTagBlobId,
        lineNumber: intOrUndefined(lineNumber || maybeLineNumber),
        columnNumber: intOrUndefined(columnNumber),
        evalInUserCode
      };
    });

  return parsed;
};

export const chromeNewStackRe = /^ {4}at ([.\S]*)(.*)\(blob.*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}):.*([0-9]+):([0-9]+)\)$/;

export const parseChromeNew = splitStack => {
  const parsed = splitStack
    .slice(1, -2)
    .map(line => line.match(chromeNewStackRe))
    .filter(matches => matches !== null)
    .map(matches => {
      const [
        functionName,
        maybeUserEvals,
        jsScriptTagBlobId,
        lineNumber,
        columnNumber
      ] = matches.slice(1);

      const evalInUserCode =
        maybeUserEvals !== " " && maybeUserEvals !== chromePlainChunkMatch
          ? true
          : undefined;

      return {
        functionName: functionName !== "eval" ? functionName : "",
        jsScriptTagBlobId,
        lineNumber: intOrUndefined(lineNumber),
        columnNumber: intOrUndefined(columnNumber),
        evalInUserCode
      };
    });

  return parsed;
};

export function getErrorStackFrame(e) {
  const splitStack = e.stack.split("\n").filter(line => line !== "");

  let stack;
  if (splitStack[0].match(firefoxStackLineRe)) {
    stack = parseFFOrSafari(splitStack);
  } else if (splitStack[1].match(chromeOldStackLineHeadRe)) {
    stack = parseChromeOld(splitStack);
  } else if (splitStack[1].match(chromeNewStackRe)) {
    stack = parseChromeNew(splitStack);
  } else {
    console.warn(
      "Error stack parsing not available for this browser, please file an issue."
    );
  }

  const { name, message } = e;
  return { name, message, stack };
}
