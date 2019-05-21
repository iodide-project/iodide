// custom exception class which adds some extra fields and detail when
// returning errors from server -- feel free to use this in your code

export class APIError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

// Please do not use any of these methods below directly in your code! Instead, create
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
  );
}

export async function signedAPIRequest(
  url,
  otherParts,
  headers = {},
  jsonResponseExpected = true
) {
  const result = await fetchWithCSRFToken(url, otherParts, headers);
  if (!result.ok) {
    // figure out what type of error it is, then let the client
    // know
    const errorObj = await result.json();
    let status;
    switch (result.status) {
      case 400:
        status = "BAD_REQUEST";
        break;
      case 403:
        status = "FORBIDDEN";
        break;
      default:
        status = "UNKNOWN_ERROR";
        break;
    }
    throw new APIError(
      result.statusText,
      status,
      errorObj.detail ? errorObj.detail : errorObj
    );
  }
  if (jsonResponseExpected) {
    return result.json();
  }
  return result.text();
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
