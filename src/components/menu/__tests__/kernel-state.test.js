import { mapStateToProps } from '../kernel-state'

describe('mapStateToProps', () => {
  const states = [
    { kernelState: 'KERNEL_BUSY', expectedColor: 'white', expectedText: 'Kernel Busy' },
    { kernelState: 'KERNEL_LOADING', expectedColor: 'white', expectedText: 'Kernel Loading' },
    { kernelState: 'KERNEL_IDLE', expectedColor: 'forestgreen', expectedText: 'Kernel Idle' },
    { kernelState: 'KERNEL_ERROR', expectedColor: 'gray', expectedText: 'Kernel Error' },
    { kernelState: 'KERNEL_LOAD_ERROR', expectedColor: 'red', expectedText: 'Kernel Didn\'t Load' },
  ]
  it('maps the kernelState to color / tooltip text', () => {
    states.forEach((st) => {
      const props = mapStateToProps(st)
      expect(props.color).toBe(st.expectedColor)
      expect(props.kernelText).toBe(st.expectedText)
    })
  })
})
