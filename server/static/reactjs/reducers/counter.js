const defaultState = {
  userData: window.userData || {}
}

const counterReducer = (state = defaultState, action) => {
  console.log(action.type, state)
  switch (action.type) {
    case 'GET_USER_DATA': {
      if (window.userData) {
        console.log('chalra', window.userData)
        return Object.assign({}, state, userData = window.userData)
      }
      return state
    }

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
