import { postActionToEvalFrame } from '../port-to-eval-frame'

// this function forwards certain white-listed actions to the eval-frame.
// If the eval frame is not ready, it automatically enqueues them for later sending.
const evalFrameActionForwarder = (state, action) => {
  switch (action.type) {
    case 'a':
    case 'DELETE_CELL':
    case 'SET_VIEW_MODE': {
      if (state.evalFrameReady) {
        // if the eval frame is ready, send the action on to the frame
        //  and return the identical state
        postActionToEvalFrame(action)
        return state
      }
      // if the eval frame is not ready, return a copy of the state with this
      // action appended to the eval queue
      const evalFrameMessageQueue = state.evalFrameMessageQueue.slice()
      evalFrameMessageQueue.push(action.actionToPost)
      return Object.assign({}, state, { evalFrameMessageQueue })
    }
    default: {
      return state
    }
  }
}

export default evalFrameActionForwarder
