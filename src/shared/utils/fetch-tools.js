export const getResponseTypeFromFetchType = fetchEntry => {
  if (fetchEntry === "css") return "text";
  if (fetchEntry === "js") return "blob";
  if (fetchEntry === "plugin") return "text";
  return fetchEntry;
};

export function genericFetch(path, fetchType) {
  const responseType = getResponseTypeFromFetchType(fetchType);
  return fetch(path).then(r => {
    if (!r.ok) throw new Error(`${r.status} ${r.statusText} (${path})`);
    return r[responseType]();
  });
}
