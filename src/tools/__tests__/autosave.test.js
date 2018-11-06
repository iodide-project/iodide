import { updateAutosave, getAutosaveKey, getAutosaveState } from '../autosave'
import { stateFromJsmd } from '../jsmd-tools'
import { newNotebook, newCell } from '../../editor-state-prototypes'

describe('updateAutosave', () => {

  function setUp() {
    const originalState = newNotebook()
    updateAutosave(originalState, true)

    // add some state
    const stateUpdate = {
      cells: [newCell(1, 'code'), newCell(2, 'markdown')],
      title: 'autosaved title'
    }
    stateUpdate.cells[0].selected = true
    const updatedState = Object.assign({}, originalState, stateUpdate)

    return {
      originalState,
      updatedState
    }
  }

  it('saves over original when asked to', () => {
    const states = setUp()

    updateAutosave(states.updatedState, true)
    const newAutosavedState = getAutosaveState(states.updatedState)
    expect(Object.keys(newAutosavedState).sort()).toEqual(['originalCopy', 'originalSaved'])

    const originalCopyState = stateFromJsmd(newAutosavedState.originalCopy)
    expect(originalCopyState.cells).toEqual(states.updatedState.cells)
    expect(originalCopyState.title).toEqual(states.updatedState.title)
  })

  it('only updates dirty copy when not asked to write over original', () => {
    const states = setUp()

    updateAutosave(states.updatedState, false)
    const newAutosavedState = getAutosaveState(states.updatedState)
    expect(Object.keys(newAutosavedState).sort()).toEqual(['dirtyCopy', 'dirtySaved',
                                                           'originalCopy', 'originalSaved'])

    const originalCopyState = stateFromJsmd(newAutosavedState.originalCopy)
    expect(originalCopyState.cells).toEqual(states.originalState.cells)
    expect(originalCopyState.title).toEqual(states.originalState.title)

    const dirtyCopyState = stateFromJsmd(newAutosavedState.dirtyCopy)
    expect(dirtyCopyState.cells).toEqual(states.updatedState.cells)
    expect(dirtyCopyState.title).toEqual(states.updatedState.title)
  })
})

describe('updateAutosave', () => {
})
