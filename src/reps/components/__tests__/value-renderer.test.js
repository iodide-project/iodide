import React from "react";

import { shallow } from "enzyme";

import { ValueRendererUnwrapped } from "../value-renderer";

import ExpandableRep from "../rep-tree";
import ErrorRenderer from "../error-handler";
import HTMLHandler from "../html-handler";
import TableRenderer from "../data-table-rep";

describe("ValueRenderer passes through to correct rep depending on topLevelRepSummary result", () => {
  let props;
  let mountedItem;

  const shallowValueRenderer = () => {
    if (!mountedItem) {
      mountedItem = shallow(<ValueRendererUnwrapped {...props} />);
    }
    return mountedItem;
  };

  beforeEach(() => {
    props = {
      rootObjName: "window",
      pathToEntity: ["foo", "343", "bar"]
    };
    mountedItem = undefined;
  });

  [
    {
      topLevelRepSummary: { repType: "HTML_STRING", htmlString: "hgdsfasd" },
      repComponent: HTMLHandler
    },
    {
      topLevelRepSummary: { repType: "ERROR_TRACE", errorString: "asdfaas" },
      repComponent: ErrorRenderer
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
      topLevelRepSummary: { repType: "<<type not specified>>" },
      repComponent: ExpandableRep
    }
  ].forEach(({ topLevelRepSummary, repComponent }) => {
    it(`use correct rep (type: ${topLevelRepSummary.repType})`, () => {
      props.topLevelRepSummary = topLevelRepSummary;
      expect(shallowValueRenderer().find(repComponent)).toHaveLength(1);
    });
  });
});
