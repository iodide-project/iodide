export default {
  shouldHandle: value => Object.prototype.toString.call(value) === '[object Date]',
  render: value => value.toString(),
}
