const defaultAppMessage = null

const appMessageReducer = (state = defaultAppMessage, action) => {
  switch (action.type) {
    case 'UPDATE_APP_MESSAGE': {
      return action.message
    }
    default:
      return state
  }
}

export default appMessageReducer
