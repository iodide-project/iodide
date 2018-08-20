export function updateAppMessage(messageObj) {
  const { message } = messageObj
  let { when } = messageObj
  if (when === undefined) when = new Date().toString()
  return {
    type: 'UPDATE_APP_MESSAGE',
    message: { message, when },
  }
}

function loginSuccess(userData) {
  return (dispatch) => {
    dispatch({
      type: 'LOGIN_SUCCESS',
      userData,
    })
    dispatch(updateAppMessage({ message: 'You are logged in' }))
  }
}

function loginFailure() {
  return (dispatch) => {
    dispatch(updateAppMessage({ message: 'Login Failed' }))
  }
}

export function login() {
  const url = '/oauth/login/github'
  const name = 'github_login'
  const specs = 'width=500,height=600'
  const authWindow = window.open(url, name, specs)
  authWindow.focus()

  return (dispatch) => {
    // Functions to be called by child window
    window.loginSuccess = (userData) => {
      dispatch(loginSuccess(userData))
    }
    window.loginFailure = () => dispatch(loginFailure())
  }
}

export function logout() {
  return (dispatch) => {
    fetch('/logout/')
      .then((response) => {
        if (response.ok) {
          dispatch({ type: 'LOGOUT' })
          dispatch(updateAppMessage({ message: 'Logged Out' }))
        } else dispatch(updateAppMessage({ message: 'Logout Failed' }))
      })
  }
}
