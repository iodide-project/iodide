import {
  getConnectionMode,
  getNotebookID,
  connectionModeIsStandalone,
  connectionModeIsServer,
} from '../server-tools'

const NOTEBOOK_ID = 100
const makeState = connectionMode => ({ notebookInfo: { connectionMode, notebook_id: NOTEBOOK_ID } })

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

describe('getNotebookID', () => {
  it('returns a noteobookID if one exists and one is on a server. Otherwise returns undefined.', () => {
    const nb = makeState('SERVER')
    expect(getNotebookID(nb)).toBe(NOTEBOOK_ID)
    nb.notebookInfo.notebook_id = undefined
    expect(getNotebookID(nb)).toBe(undefined)
  })
  it('returns undefined if the notebook is in standalone mode', () => {
    const nb = makeState('STANDALONE')
    // this is an edge case, but here
    // notebook_id is still 100 in nb.notebookInfo, and we should still return undefined.
    expect(getNotebookID(nb)).toBe(undefined)
  })
  it('throws if state.notebookInfo.notebook_id is not an integer nor undefined', () => {
    const nb = makeState('SERVER')
    nb.notebookInfo.notebook_id = 'some string'
    expect(() => getNotebookID(nb)).toThrow()
  })
})
