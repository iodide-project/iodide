import { evaluateAllCells } from './actions/actions'

export default function handleInitialViewModeEvaluation(store) {
  const state = store.getState()
  if (state.viewMode === 'REPORT_VIEW') {
    console.log('here we goooo', state)
    store.dispatch(evaluateAllCells())
  }
}
