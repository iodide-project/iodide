import UserTask, { TASK_ERRORS } from "../user-task";

describe("Improperly instantiating a class should throw an Error", () => {
  it("should throw an error if you have not provided any arguments", () => {
    expect(() => new UserTask()).toThrowError(TASK_ERRORS.argumentMustBeObject);
  });

  it("should throw an error if you have provided something other than an object", () => {
    expect(() => new UserTask([1, 2, 3, 4, 5])).toThrowError(
      TASK_ERRORS.argumentMustBeObject
    );
  });

  it("should throw an error if you have provided a keybindingCallback but no keybindings", () => {
    expect(() => new UserTask({ keybindingCallback: () => {} })).toThrowError(
      TASK_ERRORS.noKeybindingsWithCallback
    );
  });
});

describe("title element is required, and alternate title getters default to title", () => {
  it("should throw an error if you do not have a title", () => {
    expect(() => new UserTask({ callback: () => {} })).toThrowError(
      TASK_ERRORS.noTitleSupplied
    );
  });

  const nbName = "test task";
  const nbMenuTitle = "TEST";
  const nb1 = new UserTask({
    title: nbName,
    menuTitle: nbMenuTitle,
    callback: () => {}
  });
  const nb2 = new UserTask({ title: nbName, callback: () => {} });
  it("should have the getter return the title element", () => {
    expect(nb1.title).toBe(nbName);
  });
  it("should allow menuTitle to be the set menuTitle, if present", () => {
    expect(nb1.menuTitle).toBe(nbMenuTitle);
  });
  it("should default to default title if menuTitle was not declared", () => {
    expect(nb2.menuTitle).toBe(nb2.title);
  });
});

describe("callbacks are functions", () => {
  it("should throw an error if there is no callback of any kind supplied", () => {
    expect(() => new UserTask({ title: "welp" })).toThrowError(
      TASK_ERRORS.noCallback
    );
  });
  it("should throw an error if the callback is not a function", () => {
    expect(
      () => new UserTask({ title: "welp", callback: "uh-oh!" })
    ).toThrowError(TASK_ERRORS.callbackIsNotFunction);
  });
});

describe("keybindings and keybinding callbacks", () => {
  it("should throw an error if you have provided a keybindingCallback but no keybindings", () => {
    expect(() => new UserTask({ keybindingCallback: () => {} })).toThrowError(
      TASK_ERRORS.noKeybindingsWithCallback
    );
  });
  it("should throw an error if you did not pass in an array for keybindings", () => {
    expect(
      () =>
        new UserTask({
          keybindings: "not an array",
          keybindingCallback: () => {},
          title: "whatever dude"
        })
    ).toThrowError(TASK_ERRORS.keybindingsNotArray);
  });
  const nb1 = new UserTask({
    title: "ok1",
    keybindings: ["meta+s"],
    callback: () => {}
  });
  it("should output an array for the keybinding", () => {
    expect(nb1.keybindings).toBeInstanceOf(Array);
  });

  it("should tell you if it has keybindings or not", () => {
    const nb3 = new UserTask({ title: "okokok", callback: () => {} });
    const nb4 = new UserTask({
      title: "ok2",
      keybindings: ["meta+s"],
      callback: () => {}
    });
    expect(nb3.hasKeybinding()).toBe(false);
    expect(nb4.hasKeybinding()).toBe(true);
  });
});
