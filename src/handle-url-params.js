import { getStatePropsFromUrlParams } from './tools/query-param-tools'
import { setViewMode } from './actions/actions'

export default function handleUrlParams(store) {
  const otherParams = getStatePropsFromUrlParams()
  if ('viewMode' in otherParams) {
    store.dispatch(setViewMode(otherParams.viewMode))
  }
}
