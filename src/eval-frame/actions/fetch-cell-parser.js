import { isValidIdentifier } from "../../shared/utils/is-valid-js-identifier";

export function isRelPath(path) {
  // super dumb check -- just see if it has http or https at the front
  return !(
    path.toLowerCase().indexOf("http://") === 0 ||
    path.toLowerCase().indexOf("https://") === 0
  );
}

export function parseFileLine(fetchCommand) {
  return { filePath: fetchCommand, isRelPath: isRelPath(fetchCommand) };
}

export function parseAssignmentCommand(fetchCommand) {
  const varName = fetchCommand.substring(0, fetchCommand.indexOf("=")).trim();
  if (!isValidIdentifier(varName)) {
    return { error: "INVALID_VARIABLE_NAME" };
  }
  const filePath = fetchCommand.substring(fetchCommand.indexOf("=") + 1).trim();
  return { varName, filePath, isRelPath: isRelPath(filePath) };
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

export function parseFetchCellLine(line) {
  // intitial sketch of syntax at:
  // https://github.com/iodide-project/iodide/issues/1009
  // syntax is:
  // ${fetchType}:${one or more whitespace}...
  // ...${fetch command (var name, path, etc)}...
  // ...${optional comment: zero or more spaces,
  //     followed by ' //' (which includes a space),
  //     followed by anything}
  if (emptyLine(line)) return undefined;
  if (commentOnlyLine(line)) return undefined;

  const [fetchType, fetchContent] = line.trim().split(": "); // .map(s => s.)
  if (fetchContent) {
    // this switch is only entered if the line contains ': ', in which case
    // fetchContent is defined

    // first, strip out comment from the end of line (if it exists)
    const fetchCommand = fetchContent
      .trim()
      .split(" //")[0]
      .trim();
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
        return Object.assign({}, { fetchType }, parseFileLine(fetchCommand));
      default:
        return { error: "INVALID_FETCH_TYPE" };
    }
  }
  return { error: "MISSING_FETCH_TYPE" };
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
