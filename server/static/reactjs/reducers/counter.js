const defaultState = {
  userData: {}
}

const counterReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS': {
      const { userData } = action
      return Object.assign({}, state, { userData })
    }

    case 'LOGOUT': {
      const userData = {}
      return Object.assign({}, state, { userData })
    }
    default:
      return state
  }
}

export default counterReducer
