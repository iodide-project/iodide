import { mapProps } from "../console-message";

describe("mapProps", () => {
  const messageTypes = [
    {
      in: "info",
      out: {
        backgroundColorType: "string",
        textColorType: "string",
        iconType: "object"
      }
    },
    {
      in: "log",
      out: {
        backgroundColorType: "string",
        textColorType: "string",
        iconType: "undefined"
      }
    },
    {
      in: "warn",
      out: {
        backgroundColorType: "string",
        textColorType: "string",
        iconType: "object"
      }
    },
    {
      in: "error",
      out: {
        backgroundColorType: "string",
        textColorType: "string",
        iconType: "object"
      }
    },
    {
      in: "output",
      out: {
        backgroundColorType: "string",
        textColorType: "string",
        iconType: "object"
      }
    }
  ];
  messageTypes.forEach(message => {
    it(`accepts ${
      message.in
    } and has the correct data types associated`, () => {
      const data = mapProps(message.in);
      expect(typeof data.backgroundColor).toBe(message.out.backgroundColorType);
      expect(typeof data.textColor).toBe(message.out.textColorType);
      expect(typeof data.icon).toBe(message.out.iconType);
    });
  });
});
