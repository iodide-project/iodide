import React from "react";

import { shallow } from "enzyme";

import ValueRenderer from "../value-renderer";

import ExpandableRep from "../rep-tree";
import ErrorRenderer from "../error-handler";
import HTMLHandler from "../html-handler";
import TableRenderer from "../data-table-rep";

// FIXME: refactor ValueRenderer to make testing more tractable.
// HOCs may be useful here for encapsulating the async fetch.
// May also be able to remove the defaultProp.
// Also need to do this in data-table-rep and rep-tree

describe.skip("ValueRenderer passes through to correct rep depending on getTopLevelRepSummary result", () => {
  let props;
  let mountedItem;

  const shallowValueRenderer = () => {
    if (!mountedItem) {
      mountedItem = shallow(<ValueRenderer {...props} />);
    }
    return mountedItem;
  };

  beforeEach(() => {
    props = {
      windowValue: true,
      valueKey: "valueIdentifier",
      getTopLevelRepSummary: () => undefined
    };
    mountedItem = undefined;
  });

  [
    {
      getTopLevelRepSummary: () => ({ repType: "HTML_STRING" }),
      repComponent: HTMLHandler
    },
    {
      getTopLevelRepSummary: () => ({ repType: "ERROR_TRACE" }),
      repComponent: ErrorRenderer
    },
    {
      getTopLevelRepSummary: () => ({ repType: "ROW_TABLE_REP" }),
      repComponent: TableRenderer
    },
    {
      getTopLevelRepSummary: () => ({ repType: "<<type not specified>>" }),
      repComponent: ExpandableRep
    }
  ].forEach(({ getTopLevelRepSummary, repComponent }) => {
    it(`use correct rep (type: ${getTopLevelRepSummary().repType})`, () => {
      props.getTopLevelRepSummary = getTopLevelRepSummary;
      expect(shallowValueRenderer().find(repComponent)).toHaveLength(1);
    });
  });
});
