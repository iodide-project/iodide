import { monthDayYear } from "../date-formatters";

describe("monthDayYear", () => {
  expect(monthDayYear("2019-02-13T17:56:04.702Z")).toBe("Feb 13, 2019");
});
