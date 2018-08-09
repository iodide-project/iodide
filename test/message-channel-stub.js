global.MessageChannel = function() { //eslint-disable-line
  this.port1 = { onmessage: jest.fn(), postMessage: jest.fn() }
  this.port2 = { onmessage: jest.fn(), postMessage: jest.fn() }
}
