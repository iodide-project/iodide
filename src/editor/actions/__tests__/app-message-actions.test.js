import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { updateAppMessages } from "../app-message-actions";
import generateRandomId from "../../../shared/utils/generate-random-id";

jest.mock("../../../shared/utils/generate-random-id");

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("updateAppMessages", () => {
  it("dispatches the expected set of actions", () => {
    const store = mockStore({});
    const expectedDate = new Date("2019-05-14T11:01:58.135Z");
    const expectedRandomId = "abcd";
    jest.spyOn(global, "Date").mockImplementationOnce(() => expectedDate);
    generateRandomId.mockImplementationOnce(() => expectedRandomId);

    store.dispatch(
      updateAppMessages({ message: "Logged Out", messageType: "LOGGED_OUT" })
    );
    expect(store.getActions()).toEqual([
      {
        content: "LOGGED_OUT",
        historyId: expectedRandomId,
        historyType: "APP_MESSAGE",
        type: "console/history/ADD"
      },
      {
        message: {
          message: "Logged Out",
          messageType: "LOGGED_OUT",
          when: expectedDate.toString()
        },
        type: "UPDATE_APP_MESSAGES"
      }
    ]);
  });
});
