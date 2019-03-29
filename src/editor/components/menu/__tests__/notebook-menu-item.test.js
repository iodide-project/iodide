import React from "react";
import { shallow } from "enzyme";

import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";

import NotebookMenuItem from "../notebook-menu-item";
import UserTask from "../../../user-tasks/user-task";

describe("NotebookMenuItem children", () => {
  let props;
  let mountedComp;
  const nbMenuItem = () => {
    if (!mountedComp) {
      mountedComp = shallow(<NotebookMenuItem {...props} />);
    }
    return mountedComp;
  };

  beforeEach(() => {
    props = {
      task: new UserTask({
        title: "ok",
        callback: () => {},
        displayKeybinding: "a"
      })
    };
    mountedComp = undefined;
  });

  it("renders one MenuItem", () => {
    expect(NotebookMenuItem.muiName).toBe("MenuItem");
    expect(nbMenuItem().find(MenuItem).length).toBe(1);
    expect(nbMenuItem().find(ListItemText).length).toBe(2);
    expect(
      nbMenuItem()
        .find(ListItemText)
        .first()
        .props().primary
    ).toBe(props.task.title);
  });

  it("renders one MenuItem with keybinding", () => {
    expect(
      nbMenuItem()
        .find(ListItemText)
        .last()
        .props().primary
    ).toBe(props.task.displayKeybinding);
  });
  it("renders one MenuItem with secondaryText", () => {
    const nb = shallow(
      <NotebookMenuItem
        task={
          new UserTask({
            title: "ok",
            callback: () => {},
            secondaryText: "neat"
          })
        }
      />
    );
    expect(
      nb
        .find(ListItemText)
        .last()
        .props().primary
    ).toBe("neat");
  });
});

describe("NotebookMenuItem fires callback from task when clicked", () => {
  let sentinel = false;
  const nb = shallow(
    <NotebookMenuItem
      task={
        new UserTask({
          title: "ok",
          callback: () => {
            sentinel = true;
          }
        })
      }
    />
  );
  it("should upon click change the sentinel", () => {
    nb.simulate("click");
    expect(sentinel).toBe(true);
  });
});

describe("NotebookMenuItem fires all additional onClick events", () => {
  let sentinel = false;
  let innerSentinel = false;
  const nestedNB = shallow(
    <NotebookMenuItem
      onClick={() => {
        sentinel = true;
      }}
      task={
        new UserTask({
          title: "ok",
          callback: () => {
            innerSentinel = true;
          }
        })
      }
    />
  );
  it("should also fire the onClick event as well when NotebookMenuItem is clicked", () => {
    nestedNB.simulate("click");
    expect(sentinel).toBe(true);
    expect(innerSentinel).toBe(true);
  });
});
