import { isRowDf } from "../rep-type-chooser";
import {
  allCases,
  rowTableCases
} from "../../__test_helpers__/reps-test-value-cases";

function typeIdentifierTest(chooserFn, typesAccepted) {
  describe(`type identifier function "${chooserFn.name}" only accepts correct types`, () => {
    Object.keys(allCases).forEach(testCase => {
      const accept = typesAccepted.includes(testCase);
      it(`${chooserFn.name} should ${
        accept ? "ACCEPT" : "reject"
      } ${testCase}`, () => expect(chooserFn(allCases[testCase])).toBe(accept));
    });
  });
}

typeIdentifierTest(isRowDf, Object.keys(rowTableCases));
