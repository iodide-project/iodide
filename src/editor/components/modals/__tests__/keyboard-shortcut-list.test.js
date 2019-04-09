import React from "react";
import { shallow } from "enzyme";

import KeyboardShortcutList from "../keyboard-shortcut-list";
import UserTask from "../../../user-tasks/user-task";
import tasks from "../../../user-tasks/task-definitions";

const numTasksWithKeybinding = Object.keys(tasks).filter(
  k => tasks[k].displayKeybinding
).length;

describe("HelpModalUnconnected React component", () => {
  let props;
  let componentForTestCase;

  const getTestComponent = () => {
    if (!componentForTestCase) {
      componentForTestCase = shallow(<KeyboardShortcutList {...props} />);
    }
    return componentForTestCase;
  };

  beforeEach(() => {
    props = {
      tasks: {
        a: new UserTask({
          title: "task a",
          displayKeybinding: "a",
          callback: () => jest.fn()
        }),
        b: new UserTask({
          title: "task b",
          displayKeybinding: "b",
          callback: () => jest.fn()
        }),
        c: new UserTask({
          title: "task c",
          displayKeybinding: "c",
          callback: () => jest.fn()
        }),
        d: new UserTask({
          title: "task d",
          displayKeybinding: "d",
          callback: () => jest.fn()
        }),
        e: new UserTask({
          title: "task e",
          displayKeybinding: "e",
          callback: () => jest.fn()
        })
      }
    };
    componentForTestCase = undefined;
  });

  it("has the right number of global shortcuts", () => {
    expect(
      getTestComponent()
        .find("table.keyboard-shortcuts-global tbody")
        .children().length
    ).toEqual(numTasksWithKeybinding);
  });
});
