import { updateUserVariables } from './actions/actions'

export default (store) => {
  store.dispatch(updateUserVariables())
}
