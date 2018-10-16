import {
  getConnectionMode,
  connectionModeIsStandalone,
  connectionModeIsServer,
} from '../server-tools'

const makeState = connectionMode => ({ notebookInfo: { connectionMode } })

describe('getConnectionMode', () => {
  it('correctly reads connection mode', () => {
    const standalone = makeState('STANDALONE')
    const server = makeState('SERVER')
    expect(getConnectionMode(standalone)).toBe('STANDALONE')
    expect(getConnectionMode(server)).toBe('SERVER')
  })
  it('throws if state.notebookInfo.connectionMode does not exist', () => {
    const malform = { notebookInfo: {} }
    expect(() => getConnectionMode(malform)).toThrow()
  })
})

describe('connectionModeIsStandalone && connectionModeIsServer', () => {
  it('returns true if connectionMode == "STANDALONE"', () => {
    const standalone = makeState('STANDALONE')
    const server = makeState('SERVER')
    expect(connectionModeIsStandalone(standalone)).toBeTruthy()
    expect(connectionModeIsStandalone(server)).toBeFalsy()
    expect(connectionModeIsServer(standalone)).toBeFalsy()
    expect(connectionModeIsServer(server)).toBeTruthy()
  })
})

