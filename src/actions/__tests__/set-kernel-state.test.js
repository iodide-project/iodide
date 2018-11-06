import { store } from '../../store'
import { setKernelState, resetNotebook } from '../actions'
import { SchemaValidationError } from '../../reducers/create-validated-reducer'
import { editorOnlyStateProperties } from '../../state-schemas/editor-only-state-schemas'

describe('setKernelState', () => {
  beforeEach(() => {
    store.dispatch(resetNotebook())
  })
  it('createValidatedReducer should throw an error if we pass an invalid arg into setKernelState', () => {
    expect(() => store.dispatch(setKernelState('fake state')))
      .toThrowError(SchemaValidationError)
    expect(() => store.dispatch(setKernelState(12342323)))
      .toThrowError(SchemaValidationError)
  })
  it('correctly sets the kernel state', () => {
    editorOnlyStateProperties.kernelState.enum.forEach((kernelState) => {
      store.dispatch(setKernelState(kernelState))
      expect(store.getState().kernelState).toBe(kernelState)
    })
  })
})
