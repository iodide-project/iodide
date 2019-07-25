import React from "react";

import { shallow } from "enzyme";

import { ValueRendererUnconnected, ErrorPrintout } from "../value-renderer";

import ExpandableRep from "../rep-tree";
import TableRenderer from "../data-table-rep";

describe("ValueRenderer passes through to correct rep depending on topLevelRepSummary result", () => {
  let props;
  let mountedItem;

  const shallowValueRenderer = () => {
    if (!mountedItem) {
      mountedItem = shallow(<ValueRendererUnconnected {...props} />);
    }
    return mountedItem;
  };

  beforeEach(() => {
    props = {
      rootObjName: "window",
      pathToEntity: ["foo", "343", "bar"],
      requestRepInfo: jest.fn()
    };
    mountedItem = undefined;
  });

  [
    {
      topLevelRepSummary: { repType: "HTML_STRING", htmlString: "hgdsfasd" },
      repComponent: "div"
    },
    {
      topLevelRepSummary: { repType: "ERROR_TRACE", errorString: "asdfaas" },
      repComponent: ErrorPrintout
    },
    {
      topLevelRepSummary: {
        repType: "ROW_TABLE_REP",
        initialDataRows: [],
        pages: 453
      },
      repComponent: TableRenderer
    },
    {
      topLevelRepSummary: { repType: "DEFAULT_REP" },
      repComponent: ExpandableRep
    }
  ].forEach(({ topLevelRepSummary, repComponent }) => {
    it(`use correct rep (type: ${topLevelRepSummary.repType})`, () => {
      props.topLevelRepSummary = topLevelRepSummary;
      expect(shallowValueRenderer().find(repComponent)).toHaveLength(1);
    });
  });
});
