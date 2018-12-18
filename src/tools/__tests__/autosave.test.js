import { updateAutosave, getAutosaveState } from '../autosave'
import { newNotebook } from '../../editor-state-prototypes'

let states
const jsmdContent = `%% js
var x = 10

%% md

# the title
`

describe('updateAutosave', () => {
  beforeEach(() => {
    const originalState = newNotebook()
    updateAutosave(originalState, true)

    // add some state
    const stateUpdate = {
      jsmd: jsmdContent,
      title: 'autosaved title',
    }
    const updatedState = Object.assign({}, originalState, stateUpdate)

    states = {
      originalState,
      updatedState,
    }
  })

  it('saves over original when asked to', () => {
    updateAutosave(states.updatedState, true)
    const newAutosavedState = getAutosaveState(states.updatedState)
    expect(Object.keys(newAutosavedState).sort()).toEqual(['originalCopy', 'originalSaved'])

    const originalCopyState = newAutosavedState.originalCopy
    expect(originalCopyState).toEqual(states.updatedState.jsmd)
    // FIXME: deprecating the meta tag where we receive title.
    // expect(originalCopyState.title).toEqual(states.updatedState.title)
  })

  it('only updates dirty copy when not asked to write over original', () => {
    updateAutosave(states.updatedState, false)
    const newAutosavedState = getAutosaveState(states.updatedState)
    expect(Object.keys(newAutosavedState).sort())
      .toEqual(['dirtyCopy', 'dirtySaved', 'originalCopy', 'originalSaved'])

    const originalCopyState = newAutosavedState.originalCopy
    expect(originalCopyState).toEqual(states.originalState.jsmd)
    // FIXME: deprecating the meta tag where we receive title. Will this test be relevant?
    // expect(originalCopyState.title).toEqual(states.originalState.title)

    const dirtyCopyState = newAutosavedState.dirtyCopy
    expect(dirtyCopyState).toEqual(states.updatedState.jsmd)
    // FIXME: deprecating the meta tag where we receive title.
    // expect(dirtyCopyState.title).toEqual(states.updatedState.title)
  })
})

describe('updateAutosave', () => {
})
