import { combineReducers } from 'redux'
import userDataReducer from './user-data'

const rootReducer = combineReducers({
  userData: userDataReducer,
})

export default rootReducer
