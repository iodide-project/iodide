import { mapProps } from "../console-message";

describe("mapProps", () => {
  const messageTypes = [
    {
      in: "INFO",
      out: {
        backgroundColorType: "string",
        textColorType: "string",
        iconType: "object"
      }
    },
    {
      in: "LOG",
      out: {
        backgroundColorType: "string",
        textColorType: "string",
        iconType: "undefined"
      }
    },
    {
      in: "WARN",
      out: {
        backgroundColorType: "string",
        textColorType: "string",
        iconType: "object"
      }
    },
    {
      in: "ERROR",
      out: {
        backgroundColorType: "string",
        textColorType: "string",
        iconType: "object"
      }
    },
    {
      in: "OUTPUT",
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
