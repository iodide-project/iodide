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

export default function fetchWithCSRFToken(url, otherParts) {
  const csrfToken = getCookie('csrftoken')
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
  };
  console.warn(Object.assign({}, otherParts, { headers }))
  return fetch(url, Object.assign({}, otherParts, { headers }))
}
