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

const JWT_ACCESS_TOKEN_ID = "jwt-access-token";
const JWT_ACCESS_TOKEN_REFRESH_INTERVAL = 4 * 60; // 4 minutes
const JWT_REFRESH_TOKEN_ID = "jwt-refresh-token";
const JWT_REFRESH_TOKEN_REFRESH_INTERVAL = 23 * 60 * 60; // 23 hours

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

// exported for unit testing only
export function setCookie(name, value, maxAge) {
  const maxAgeStr = maxAge ? `;max-age=${maxAge}` : "";
  document.cookie = `${name}=${value}${maxAgeStr}`;
}

async function getResultError(result) {
  // figure out what type of error it is, then let the client
  // know
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
  const errorObj = await result.json();
  return new APIError(
    result.statusText,
    status,
    errorObj.detail ? errorObj.detail : errorObj
  );
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

async function getJWTAuthToken() {
  const result = await fetchWithCSRFToken("/token/", { method: "POST" });
  if (!result.ok) {
    throw getResultError(result);
  }
  const tokenData = await result.json();
  setCookie(
    JWT_ACCESS_TOKEN_ID,
    tokenData.access,
    JWT_ACCESS_TOKEN_REFRESH_INTERVAL
  );
  setCookie(
    JWT_REFRESH_TOKEN_ID,
    tokenData.refresh,
    JWT_REFRESH_TOKEN_REFRESH_INTERVAL
  );
}

async function fetchWithJWTToken(url, otherParts, headers = {}) {
  const accessToken = getCookie(JWT_ACCESS_TOKEN_ID);
  if (accessToken) {
    return fetch(
      url,
      Object.assign({}, otherParts, {
        credentials: "omit",
        headers: Object.assign(
          {},
          {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          headers
        )
      })
    );
  }

  // access token seems to have expired, do we have a refresh token we can use?
  const refresh = getCookie(JWT_REFRESH_TOKEN_ID);
  let tokenRefreshed = false;
  if (refresh) {
    try {
      const result = await fetch("/api/v1/token/refresh/", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ refresh })
      });
      if (!result.ok) {
        const error = await getResultError(result);
        throw error;
      } else {
        const newAccessTokenData = await result.json();
        if (!newAccessTokenData || !newAccessTokenData.access) {
          throw Error("Unknown error getting new access token");
        }
        // otherwise, almost certainly our new auth token is ok
        setCookie(
          JWT_ACCESS_TOKEN_ID,
          newAccessTokenData.access,
          JWT_ACCESS_TOKEN_REFRESH_INTERVAL
        );
        tokenRefreshed = true;
      }
    } catch (err) {
      // if we have some kind of error getting the refresh token, clear it
      // and assume we just have to get it again
      setCookie(JWT_ACCESS_TOKEN_ID, "", -1);
    }
  }

  if (!tokenRefreshed) {
    // no refresh token, get both a refresh token and an auth one
    await getJWTAuthToken();
  }

  // try recursively calling this function again (this should happen at most
  // once, since the refresh token functions above will throw if they encounter
  // an error)
  return fetchWithJWTToken(url, otherParts, headers);
}

export async function signedAPIRequest(
  url,
  otherParts,
  headers = {},
  jsonResponseExpected = true
) {
  const result = await fetchWithJWTToken(url, otherParts, headers);
  if (!result.ok) {
    const error = await getResultError(result);
    throw error;
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

// A request which accesses a read-only json endpoint, will use
// logged in credentials if available
export async function readJSONAPIRequest(url, loggedIn) {
  const result = loggedIn ? await fetchWithJWTToken(url) : await fetch(url);
  if (!result.ok) {
    const error = await getResultError(result);
    console.log(error);
    throw error;
  }
  return result.json();
}
