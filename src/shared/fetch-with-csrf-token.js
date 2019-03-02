export function getCookie(name) {
  if (!document.cookie) {
    return null;
  }
  const token = document.cookie
    .split(";")
    .map(c => c.trim())
    .filter(c => c.startsWith(`${name}=`));

  if (token.length === 0) {
    return null;
  }
  return decodeURIComponent(token[0].split("=")[1]);
}

// for POST of files, primarily
export default function fetchWithCSRFToken(url, otherParts, headers = {}) {
  const csrfToken = getCookie("csrftoken");
  const defaultHeaders = {
    "X-CSRFToken": csrfToken
  };
  const combinedHeaders = Object.assign({}, defaultHeaders, headers);
  return fetch(
    url,
    Object.assign({}, otherParts, { headers: combinedHeaders })
  ).catch(err => {
    throw Error(err);
  });
}

// for POST, DELETE of notebooks and revisions,
// we need to assign a Content-Type for sending the CSRFToken for deleting.
export function fetchWithCSRFTokenAndJSONContent(
  url,
  otherParts,
  headers = {}
) {
  const combinedHeaders = Object.assign({}, headers, {
    "Content-Type": "application/json"
  });
  return fetchWithCSRFToken(url, otherParts, combinedHeaders);
}
