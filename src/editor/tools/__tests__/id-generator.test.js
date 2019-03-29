import { historyIdGen } from "../id-generators";

describe("historyIdGen should behave correctly", () => {
  it("first id is 1", () => {
    expect(historyIdGen.nextId()).toEqual(1);
  });
  it("next id is 2", () => {
    expect(historyIdGen.nextId()).toEqual(2);
  });
});
