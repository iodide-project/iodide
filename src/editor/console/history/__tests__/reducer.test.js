import reducer from "../reducer";

describe("console/history/CLEAR", () => {
  let state;

  beforeEach(() => {
    state = {
      history: [
        {
          content: "Loading Python language plugin",
          historyId: "wrmhklxskc",
          historyType: "CONSOLE_MESSAGE",
          level: "LOG"
        },
        {
          content: "Python plugin ready",
          historyId: "xqtol9pck6",
          historyType: "CONSOLE_MESSAGE",
          level: "LOG"
        },
        {
          content: "1+2",
          historyId: "7k77hjno1d",
          historyType: "CONSOLE_INPUT",
          language: "py"
        },
        {
          historyId: "6316fcv86c",
          historyType: "CONSOLE_OUTPUT"
        }
      ]
    };
  });

  it("empties out the history array in the state", () => {
    const action = { type: "console/history/CLEAR" };

    const nextState = reducer(state, action);

    expect(nextState.history).toEqual([]);
  });
});
