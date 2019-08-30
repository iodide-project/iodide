import { loginSuccess, loginFailure } from "../server-session-actions";
import { store } from "../../store";

const mockUserData = {
  name: "name",
  avatar: "avatar"
};

describe("make sure action creators leave store in a consitent state", () => {
  it("loginSuccess", () => {
    expect(() => store.dispatch(loginSuccess(mockUserData))).not.toThrow();
  });
  it("loginFailure", () => {
    expect(() => store.dispatch(loginFailure())).not.toThrow();
  });
});
