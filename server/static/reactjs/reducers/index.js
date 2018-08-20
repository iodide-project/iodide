import { combineReducers } from 'redux'
import userDataReducer from './user-data'
import appMessageReducer from './app-message'

const rootReducer = combineReducers({
  userData: userDataReducer,
  appMessage: appMessageReducer,
})

export default rootReducer
