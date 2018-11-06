import { setKernelState } from '../actions'
import { editorOnlyStateProperties } from '../../state-schemas/editor-only-state-schemas'

describe('setKernelState', () => {
  it('correctly sets the kernel state', () => {
    editorOnlyStateProperties.kernelState.enum.forEach((kernelState) => {
      expect(setKernelState(kernelState).kernelState).toBe(kernelState)
    })
  })
})
