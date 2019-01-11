export function loginToServer() {
  const url = "/oauth/login/github";
  const name = "github_login";
  const specs = "width=500,height=600";
  const authWindow = window.open(url, name, specs);
  authWindow.focus();
}

export function logoutFromServer(successCallback, errorCallback, dispatch) {
  fetch("/logout/").then(response => {
    if (response.ok) {
      successCallback(dispatch);
    } else {
      errorCallback(response, dispatch);
    }
  });
}
