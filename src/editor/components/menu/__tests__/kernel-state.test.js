import React from "react";
import { shallow } from "enzyme";

import CircularProgress from "@material-ui/core/CircularProgress";
import PanoramaFishEye from "@material-ui/icons/PanoramaFishEye";
import Error from "@material-ui/icons/Error";
import ErrorOutline from "@material-ui/icons/ErrorOutline";

import { KernelStateUnconnected, mapStateToProps } from "../kernel-state";

const states = [
  {
    kernelState: "KERNEL_BUSY",
    color: undefined,
    kernelText: "Kernel Busy",
    statusIcon: CircularProgress
  },
  {
    kernelState: "KERNEL_LOADING",
    color: undefined,
    kernelText: "Kernel Loading",
    statusIcon: CircularProgress
  },
  {
    kernelState: "KERNEL_IDLE",
    color: "forestgreen",
    kernelText: "Kernel Idle",
    statusIcon: PanoramaFishEye
  },
  {
    kernelState: "KERNEL_ERROR",
    color: "gray",
    kernelText: "Kernel Error",
    statusIcon: ErrorOutline
  },
  {
    kernelState: "KERNEL_LOAD_ERROR",
    color: "red",
    kernelText: "Kernel Didn't Load",
    statusIcon: Error
  }
];

describe("KernelStateUnconnected", () => {
  it("properly renders the status icon component for the correct kernel state", () => {
    states.forEach(st => {
      const props = { kernelText: st.kernelText, color: st.color };
      const component = shallow(<KernelStateUnconnected {...props} />);
      expect(component.find(st.statusIcon).length).toBe(1);
    });
  });
});

describe("mapStateToProps", () => {
  it("maps the kernelState to color / tooltip text", () => {
    states.forEach(st => {
      const props = mapStateToProps(st);
      expect(props.color).toBe(st.color);
      expect(props.kernelText).toBe(st.kernelText);
    });
  });
});
