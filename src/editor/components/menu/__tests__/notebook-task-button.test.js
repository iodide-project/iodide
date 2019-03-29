import React from "react";
import { shallow } from "enzyme";

import IconButton from "@material-ui/core/IconButton";

import NotebookTaskButton from "../notebook-task-button";
import UserTask from "../../../user-tasks/user-task";

describe("NotebookTaskButton has one IconButton", () => {
  const nbTask = shallow(
    <NotebookTaskButton
      task={
        new UserTask({ title: "ok", callback: () => {}, secondaryText: "neat" })
      }
    >
      ok
    </NotebookTaskButton>
  );
  it("renders one NotebookTaskButton which contains an IconButton", () => {
    expect(nbTask.find(IconButton).length).toBe(1);
    expect(nbTask.find(IconButton).props().children).toBe("ok");
  });
});

describe("NotebookTaskButton onClick", () => {
  let sentinel = false;
  const nbTask = shallow(
    <NotebookTaskButton
      task={
        new UserTask({
          title: "ok",
          callback: () => {
            sentinel = true;
          },
          secondaryText: "neat"
        })
      }
    >
      ok
    </NotebookTaskButton>
  );
  it("uses callback via click to run sentinel", () => {
    nbTask.find(IconButton).simulate("click");
    expect(sentinel).toBe(true);
  });
});
