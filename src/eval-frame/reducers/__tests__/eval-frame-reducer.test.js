import notebookReducer from '../eval-frame-reducer'
import { newNotebook } from '../../state-prototypes'

describe('blank-state-reducer', () => {
  it('should return the initial state', () => {
    expect(notebookReducer(newNotebook(), {})).toEqual(newNotebook())
  })
})

describe('new notebooks', () => {
  const nextState = newNotebook()

  it('should create newNotebook() on NEW_NOTEBOOK', () => {
    expect(notebookReducer(nextState, { type: 'NEW_NOTEBOOK' })).toEqual(newNotebook())
  })
})

