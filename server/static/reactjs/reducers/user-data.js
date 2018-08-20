const defaultUserData = window.userData || {}

const userDataReducer = (state = defaultUserData, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS': {
      return action.userData
    }

    case 'LOGOUT': {
      return {}
    }
    default:
      return state
  }
}

export default userDataReducer
