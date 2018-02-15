const localStorage = {}

export default {
  setItem(key, value) {
    return Object.assign(localStorage, { [key]: value })
  },
  getItem(key) {
    return localStorage[key]
  },
  removeItem(key) {
    delete localStorage[key]
    return localStorage
  },
  hasOwnProperty(key) {
    return Object.prototype.hasOwnProperty.call(localStorage, key)
  },
  clear() {
    Object.keys(localStorage).forEach(k => delete localStorage[k])
  },
}

export { localStorage }
