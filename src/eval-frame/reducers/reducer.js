// /*  global IODIDE_BUILD_MODE */
import { postActionToEditor } from '../port-to-editor'

function reduceReducers(...reducers) {
  return (previous, current) =>
    reducers.reduce(
      (p, r) => r(p, current),
      previous,
    )
}

function replaceStateFromEditor(state, action) {
  return action.type === 'REPLACE_STATE' ? action.state : state
}

// this function forwards actions to the editor
// FIXME THIS IS CRITICAL
// for securty reasons, any actions forwarded must be whitelisted
// and verified against schema on the editor side.
const actionForwarder = (state, action) => {
  // FIXME: this is a terrible hack to make the tests work.
  // it must be stamped out.
  // if (IODIDE_BUILD_MODE !== 'test') {
  try {
    postActionToEditor(action)
  } catch (error) {
    // console.log('EVAL FRAME ACTION POST TO EDITOR FAILED')
  }
  // }
  return state
}


export default reduceReducers(replaceStateFromEditor, actionForwarder)
