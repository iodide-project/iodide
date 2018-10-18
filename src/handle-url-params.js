import { getStatePropsFromUrlParams } from './tools/query-param-tools'
import { setViewMode } from './actions/actions'

export default function handleUrlParams(store) {
  const otherParams = getStatePropsFromUrlParams()
  if (otherParams.viewMode === 'REPORT_VIEW') {
    store.dispatch(setViewMode(otherParams.viewMode))
  }
}
