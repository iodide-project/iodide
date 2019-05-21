// import { shallow } from 'enzyme'
// import React from 'react'

import {
  // HeaderMessagesUnconnected,
  mapStateToProps
} from "../header-messages";

// describe('HeaderMessagesUnconnected React component', () => {
//
// })

describe("HeaderMessages mapStateToProps", () => {
  let state;
  let ownProps;

  beforeEach(() => {
    state = {
      viewMode: "EXPLORE_VIEW",
      userData: {
        name: "user"
      },
      notebookInfo: {
        user_can_save: true,
        revision_is_latest: true,
        connectionMode: "SERVER"
      }
    };
    ownProps = {};
  });

  it("displays standalone notification", () => {
    state.notebookInfo.connectionMode = "STANDALONE";
    expect(mapStateToProps(state, ownProps).message).toEqual("STANDALONE_MODE");
  });

  it("displays login message", () => {
    state.userData.name = undefined;
    state.notebookInfo.user_can_save = false;
    expect(mapStateToProps(state, ownProps).message).toEqual("NEED_TO_LOGIN");
  });

  it("displays make a copy message", () => {
    state.notebookInfo.user_can_save = false;
    state.notebookInfo.username = "test";
    const props = mapStateToProps(state, ownProps);
    expect(props.message).toEqual("NEED_TO_MAKE_COPY");
    expect(props.owner).toEqual("test");
  });

  [
    ["ERROR_GENERAL", "SERVER_ERROR_GENERAL"],
    ["ERROR_OUT_OF_DATE", "NOTEBOOK_REVISION_ID_OUT_OF_DATE"],
    ["ERROR_UNAUTHORIZED", "SERVER_ERROR_UNAUTHORIZED"]
  ].forEach(errorTuple => {
    const [serverError, expectedMessage] = errorTuple;
    it(`gives ${expectedMessage} when server error is ${serverError}`, () => {
      state.notebookInfo.serverSaveStatus = serverError;
      const props = mapStateToProps(state, ownProps);
      expect(props.message).toEqual(expectedMessage);
    });
  });

  it("lets you know when your notebook is based on an historical revision", () => {
    state.notebookInfo.revision_is_latest = false;
    const props = mapStateToProps(state, ownProps);
    expect(props.message).toEqual("NOTEBOOK_REVISION_ID_OUT_OF_DATE");
  });

  it("displays nothing", () => {
    expect(mapStateToProps(state, ownProps).message).toEqual(undefined);
  });
});
