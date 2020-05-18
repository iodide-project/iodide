import { updateAppMessages } from "./app-message-actions";
import { createNewNotebookOnServer } from "./server-save-actions";
import { updateAutosave } from "./autosave-actions";
import { uploadAllTemporaryFiles } from "./file-actions";
import { loginToServer, logoutFromServer } from "../../shared/utils/login";
import { userInfoRequest } from "../../shared/server-api/userinfo";
import {
  forgetAuthTokens,
  hasAuthTokens
} from "../../shared/server-api/api-request";
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
      // upload any temporary files
      dispatch(uploadAllTemporaryFiles());
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
  forgetAuthTokens();
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

export function checkLogin() {
  return async (dispatch, getState) => {
    if (notebookIsATrial(getState()) && hasAuthTokens()) {
      const userInfo = await userInfoRequest();
      if (userInfo.name) {
        // we are actually logged in, but just don't know it --
        // this can happen if we create a notebook through the
        // a POST request and the /from-template/ endpoint --
        // trigger a loginSuccess callback, this will create a
        // new notebook as expected
        dispatch(loginSuccess(userInfo));
      }
    }
  };
}
