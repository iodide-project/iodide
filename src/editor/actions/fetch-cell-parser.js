import { isValidIdentifier } from "../../shared/utils/is-valid-js-identifier";

const URL_FETCH_TYPES = ["css", "js"];
const VALID_FETCH_TYPES = URL_FETCH_TYPES.concat([
  "arrayBuffer",
  "blob",
  "json",
  "text",
  "plugin"
]);

export function isRelPath(path) {
  // super dumb check -- just see if it has http or https at the front
  return !(
    path.toLowerCase().indexOf("http://") === 0 ||
    path.toLowerCase().indexOf("https://") === 0
  );
}

// this supports the legacy use of the "files/" prefix in fetch cells
const extractFileNameFromLocalFilePath = filepath => {
  if (filepath.slice(0, 6) === "files/") {
    // FIXME: this warning should be printed to the *Iodide* console when that ability exists
    console.warn(`The \`files\` prefix is not required when fetching files saved to the Iodide server.
This prefix will be deprecated in a future version`);
    return filepath.slice(6);
  }
  return filepath;
};

export function parseFileLine(fetchCommand) {
  const isRel = isRelPath(fetchCommand);
  const filePath = isRel
    ? extractFileNameFromLocalFilePath(fetchCommand)
    : fetchCommand;
  return { filePath, isRelPath: isRel };
}

export function parseAssignmentCommand(fetchCommand) {
  const varName = fetchCommand.substring(0, fetchCommand.indexOf("=")).trim();
  const filePath = parseFileLine(
    fetchCommand.substring(fetchCommand.indexOf("=") + 1).trim()
  );
  return Object.assign(filePath, { varName });
}

export function commentOnlyLine(line) {
  // if, after trimming the whitespace, the first two
  // chars are '//', then it's a comment line
  return line.trim().substr(0, 2) === "//";
}

export function emptyLine(line) {
  // if, after stripping all the whitespace it's empty
  return line.replace(/\s+/g, "") === "";
}

export function missingFetchType(line) {
  return !line.trim().match(/^\w+\s*: /);
}

export function validFetchType(line) {
  const fetchType = line.trim().split(": ")[0];
  return VALID_FETCH_TYPES.includes(fetchType.trimLeft());
}

export function validVariableName(line) {
  const fetchType = line
    .trim()
    .split(": ")[0]
    .trim();
  const fetchCommand = line
    .trim()
    .split(": ")
    .slice(1)
    .join(": ");
  if (fetchType.match(/^(css|js)$/)) {
    return true;
  }
  const varName = fetchCommand.substring(0, fetchCommand.indexOf("=")).trim();
  return isValidIdentifier(varName);
}

export function validFetchUrl(line) {
  /*
    Assume fetch type and variable name are valid,
    For script fetch (css & js), valid fetch content is:
      "<fetch-url>"
    For data fetch (arrayBuffer, blob, json & text), valid fetch content is:
      "<variable-name> = <fetch-url>"
  */
  const fetchType = line.split(": ")[0];
  const fetchContent = line.replace(new RegExp(`^${fetchType}: `), "").trim();

  let fetchUrl;
  if (URL_FETCH_TYPES.includes(fetchType)) {
    fetchUrl = fetchContent;
  } else {
    fetchUrl = fetchContent.split("=");
    fetchUrl.shift();
    fetchUrl = fetchUrl.join("=").trim();
  }

  return (
    // valid script fetch url
    !!fetchUrl.match(/^(ftp|http)s?:\/\/[^ "]+$/) ||
    // valid script fetch local url
    !!fetchUrl.match(/^[^ "]*$/)
  );
}

export function parseFetchCellLine(lineWithComments) {
  // intitial sketch of syntax at:
  // https://github.com/iodide-project/iodide/issues/1009
  // syntax is:
  // ${fetchType}:${one or more whitespace}...
  // ...${fetch command (var name, path, etc)}...
  // ...${optional comment: zero or more spaces,
  //     followed by ' //' (which includes a space),
  //     followed by anything}
  if (emptyLine(lineWithComments)) return undefined;
  if (commentOnlyLine(lineWithComments)) return undefined;

  // First, strip out comment from the end of line (if it exists)
  const line = lineWithComments
    .trim()
    .split(" //")[0]
    .trim();

  // Report errors in fetch lines early on
  if (missingFetchType(line)) {
    return { error: "MISSING_FETCH_TYPE" };
  }
  if (!validFetchType(line)) {
    return { error: "INVALID_FETCH_TYPE" };
  }
  if (!validFetchUrl(line)) {
    return { error: "INVALID_FETCH_URL" };
  }
  if (!validVariableName(line)) {
    return { error: "INVALID_VARIABLE_NAME" };
  }

  const [fetchType, ...fetchContents] = line.trim().split(": ");
  const fetchContent = fetchContents.join(": ");

  const fetchCommand = fetchContent;
  switch (fetchType) {
    case "text":
    case "json":
    case "arrayBuffer":
    case "blob":
      return Object.assign(
        {},
        { fetchType },
        parseAssignmentCommand(fetchCommand)
      );
    case "js":
    case "css":
    case "plugin":
      return Object.assign({}, { fetchType }, parseFileLine(fetchCommand));
    default:
      throw Error("Should never reach here");
  }
}

export default function parseFetchCell(cellText) {
  // idea: parses the text in the cell, then returns an array of objects
  // encoding the kinds of fetches that need to be carried out

  /*
  the fetches will have one of the following formats:
  { error: 'error type string'}
  { fetchType: 'file',
    varName: 'varname string',
    filePath: 'file path string',
    isRelPath: bool }
  { fetchType: 'js',
    filePath: 'file path string',
    isRelPath: bool }
  { fetchType: 'css',
    filePath: 'file path string,
    isRelPath: bool' }
  */
  const fetches = cellText
    .split("\n")
    .map((line, i) => ({
      line,
      parsed: parseFetchCellLine(line),
      id: `fetchSpec-${i}`
    }))
    .filter(l => l.parsed !== undefined);
  return fetches;
}
