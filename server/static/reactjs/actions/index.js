function loginSuccess(userData) {
  return (dispatch) => {
    dispatch({
      type: 'LOGIN_SUCCESS',
      userData,
    })
    console.log({ message: 'You are logged in' })
  }
}

function loginFailure() {
  return (dispatch) => {
    console.log({ message: 'Login Failed' })
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
          console.log({ message: 'Logged Out' })
        } else console.log({ message: 'Logout Failed' })
      })
  }
}
