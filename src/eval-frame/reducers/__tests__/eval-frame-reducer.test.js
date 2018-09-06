import notebookReducer from '../eval-frame-reducer'
import { newNotebook } from '../../eval-frame-state-prototypes'

describe('blank-state-reducer', () => {
  it('should return the initial state', () => {
    expect(notebookReducer(newNotebook(), {})).toEqual(newNotebook())
  })
})

describe('new notebooks', () => {
  const nextState = newNotebook()

  it('should create newNotebook() on RESET_NOTEBOOK', () => {
    expect(notebookReducer(nextState, { type: 'RESET_NOTEBOOK' })).toEqual(newNotebook())
  })
})
