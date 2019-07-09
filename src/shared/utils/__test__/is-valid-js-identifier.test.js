import { isValidIdentifier } from "../is-valid-js-identifier";

describe("isValidIdentifier", () => {
  ["sfkjjk", "__asdfa", "_$_$_$_", "_$32", "da333"].forEach(idCase => {
    it(`valid identifier: ${idCase}`, () => {
      expect(isValidIdentifier(idCase)).toBe(true);
    });
  });

  ["sfkjj;k", "4312asdfas", "asdf asdf erf", "af:asd", "x=23"].forEach(
    idCase => {
      it(`invalid identifier: ${idCase}`, () => {
        expect(isValidIdentifier(idCase)).toBe(false);
      });
    }
  );
});
