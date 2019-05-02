// Please do not use any of these methods directly in your code! Instead, create
// methods that use them, as is done elsewhere in this directory. This will make
// it easier to switch to different authentication methods or otherwise change
// the implementation of the API in the future.

function getCookie(name) {
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

// this adds a csrf token to requests, when available, so django
// can figure out which user the request is coming from
function fetchWithCSRFToken(url, otherParts, headers = {}) {
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

export function signedAPIRequest(
  url,
  otherParts,
  headers = {},
  jsonResponseExpected = true
) {
  return fetchWithCSRFToken(url, otherParts, headers).then(r => {
    if (!r.ok) throw new Error(r.statusText);
    if (jsonResponseExpected) {
      return r.json();
    }
    return r.text();
  });
}

// for POST, DELETE of notebooks and revisions,
// we need to assign a Content-Type when sending the CSRFToken for deleting.
export function signedAPIRequestWithJSONContent(
  url,
  otherParts,
  jsonResponseExpected = true
) {
  return signedAPIRequest(
    url,
    otherParts,
    {
      "Content-Type": "application/json"
    },
    jsonResponseExpected
  );
}
