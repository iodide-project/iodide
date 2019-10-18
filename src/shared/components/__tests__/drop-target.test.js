import React from "react";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";

import DropTarget from "../drop-target";

// It would be more useful to test what happens when dragenter and dragleave
// fire, but jsdom does not provide a DragEvent object and writing a polyfill
// that works as needed would be a pain
describe("DropTarget React component", () => {
  let wrapper;

  beforeEach(() => {
    // Set up a wrapper for the mounted components so that addEventListener
    // functions fire
    //
    // https://github.com/airbnb/enzyme/issues/426#issuecomment-431195329
    wrapper = document.createElement("div");
    wrapper.id = "wrapper";
    document.body.append(wrapper);
  });

  afterEach(() => {
    document.body.removeChild(document.getElementById("wrapper"));
  });

  it("renders", () => {
    mount(<DropTarget />);
  });

  it("onHoverStart is called when hoverstart fires", () => {
    const ohs = jest.fn();
    const dt = mount(<DropTarget onHoverStart={ohs} />, {
      attachTo: wrapper
    });
    act(() => {
      dt.find(".drop-target")
        .getDOMNode()
        .dispatchEvent(
          new CustomEvent("hoverstart", {
            bubbles: true,
            cancelable: true,
            detail: {}
          })
        );
    });
    expect(ohs).toHaveBeenCalled();
  });

  it("onHoverEnd is called when hoverend fires", () => {
    const ohe = jest.fn();
    const dt = mount(<DropTarget onHoverEnd={ohe} />, {
      attachTo: wrapper
    });
    act(() => {
      dt.find(".drop-target")
        .getDOMNode()
        .dispatchEvent(
          new CustomEvent("hoverend", {
            bubbles: true,
            cancelable: true,
            detail: {}
          })
        );
    });
    expect(ohe).toHaveBeenCalled();
  });
});
