/* eslint-disable no-fallthrough */

import { postActionToEvalFrame } from '../port-to-eval-frame'

// this function forwards certain white-listed actions to the eval-frame.
// If the eval frame is not ready, it automatically enqueues them for later sending.

// FIXME the evalFrameActionForwarder is needlessly heavy,
//  but for now its message queue is required for run-all
// work when starting in view mode

const evalFrameActionForwarder = (state, action) => {
  switch (action.type) {
    case 'TRIGGER_TEXT_EVAL_IN_FRAME': {
      if (state.evalFrameReady) {
        // if the eval frame is ready, send the action on to the frame
        //  and return the identical state
        postActionToEvalFrame(action)
        return state
      }
      // if the eval frame is not ready, return a copy of the state with this
      // action appended to the eval queue
      const evalFrameMessageQueue = state.evalFrameMessageQueue.slice()
      evalFrameMessageQueue.push(action)
      return Object.assign({}, state, { evalFrameMessageQueue })
    }
    default: {
      return state
    }
  }
}

export default evalFrameActionForwarder
