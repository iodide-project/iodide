import { updateAppMessages } from "./app-message-actions";
import { createNewNotebookOnServer } from "./server-save-actions";
import { updateAutosave } from "./autosave-actions";
import { loginToServer, logoutFromServer } from "../../shared/utils/login";
import { notebookIsATrial } from "../tools/server-tools";

export function loginSuccess(userData) {
  return async (dispatch, getState) => {
    dispatch({
      type: "LOGIN_SUCCESS",
      userData
    });
    if (notebookIsATrial(getState())) {
      createNewNotebookOnServer()(dispatch, getState);
    } else {
      dispatch(
        updateAppMessages({
          message: "You are logged in",
          messageType: "LOGGED_IN"
        })
      );
      // trigger a save action immediately
      dispatch(updateAutosave());
    }
  };
}

export function loginFailure() {
  return dispatch => {
    dispatch(
      updateAppMessages({
        message: "Login Failed",
        messageType: "LOGIN_FAILED"
      })
    );
  };
}

export function login(successCallback) {
  return dispatch => {
    const loginSuccessWrapper = userData => {
      dispatch(loginSuccess(userData));
      if (successCallback) successCallback(userData);
    };
    loginToServer(loginSuccessWrapper);
  };
}

function logoutSuccess(dispatch) {
  dispatch({ type: "LOGOUT" });
  dispatch(
    updateAppMessages({ message: "Logged Out", messageType: "LOGGED_OUT" })
  );
}

function logoutFailure(dispatch) {
  dispatch(
    updateAppMessages({
      message: "Logout Failed",
      messageType: "LOGOUT_FAILED"
    })
  );
}

export function logout() {
  return dispatch => {
    logoutFromServer(logoutSuccess, logoutFailure, dispatch);
  };
}
