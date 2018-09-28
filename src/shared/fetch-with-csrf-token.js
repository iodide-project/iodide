export function getCookie(name) {
  if (!document.cookie) {
    return null
  }
  const token = document.cookie.split(';')
    .map(c => c.trim())
    .filter(c => c.startsWith(`${name}=`))

  if (token.length === 0) {
    return null;
  }
  return decodeURIComponent(token[0].split('=')[1])
}

export default function fetchWithCSRFToken(url, otherParts, headers = {}) {
  const csrfToken = getCookie('csrftoken')
  const defaultHeaders = {
    'Content-Type': 'application/json', // THIS NEEDS TO BE REPLACED NOW!
    'X-CSRFToken': csrfToken,
  };
  const combinedHeaders = Object.assign({}, defaultHeaders, headers)
  console.warn(combinedHeaders)
  return fetch(url, Object.assign({}, otherParts, { headers: combinedHeaders }))
}
