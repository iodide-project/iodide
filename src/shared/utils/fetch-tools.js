export const errorTypeToString = {
  MISSING_FETCH_TYPE: "fetch type not specified",
  INVALID_FETCH_TYPE: "invalid fetch type",
  INVALID_VARIABLE_NAME: "invalid variable name"
};

export function syntaxErrorToString(fetchInfo) {
  return `Syntax error, ${errorTypeToString[fetchInfo.parsed.error]} in:
      "${fetchInfo.line}"`;
}

function handleErrors(err) {
  throw new Error(err);
}

export const getResponseTypeFromFetchType = fetchEntry => {
  if (fetchEntry === "css") return "text";
  if (fetchEntry === "js") return "blob";
  if (fetchEntry === "plugin") return "text";
  return fetchEntry;
};

export function genericFetch(path, fetchType) {
  const responseType = getResponseTypeFromFetchType(fetchType);
  return fetch(path)
    .then(r => {
      if (!r.ok) throw new Error(`${r.status} ${r.statusText} (${path})`);
      return r[responseType]();
    })
    .catch(handleErrors);
}

export function successMessage(fetchInfo) {
  const ifVarSet = fetchInfo.parsed.varName
    ? `\t(var ${fetchInfo.parsed.varName})`
    : "";
  const text = `SUCCESS: ${fetchInfo.parsed.filePath} loaded${ifVarSet}`;
  return { text, id: fetchInfo.id };
}

export function errorMessage(fetchInfo, msg) {
  const firstLine = fetchInfo.parsed.filePath
    ? `${fetchInfo.parsed.filePath}\t`
    : "";
  const text = `ERROR: ${firstLine}${msg}`;
  return {
    text,
    id: fetchInfo.id
  };
}
