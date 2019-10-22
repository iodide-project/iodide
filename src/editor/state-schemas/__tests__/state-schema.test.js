import Ajv from "ajv";
import { languageSchema } from "../state-schema";

describe("language plugin test cases", () => {
  const ajv = new Ajv();

  const baseExample = {
    languageId: "ml",
    displayName: "OCaml",
    url: "https://louisabraham.github.io/domical/eval.js",
    module: "evaluator",
    evaluator: "execute",
    pluginType: "language"
  };

  it("handles well-formed input as expected", () => {
    expect(ajv.validate(languageSchema, baseExample)).toBe(true);
  });

  it("rejects badly-formed input", () => {
    [
      "languageId",
      "displayName",
      "url",
      "module",
      "evaluator",
      "pluginType"
    ].forEach(strProp => {
      expect(
        ajv.validate(languageSchema, { ...baseExample, [strProp]: 1 })
      ).toBe(false);
    });
  });

  it("handles unknown properties", () => {
    // using a deprecated property (codeMirrorMode) that is no longer in the schema
    // we should be leninent here because users can define anything
    // https://github.com/iodide-project/iodide/issues/2215
    expect(
      ajv.validate(languageSchema, {
        ...baseExample,
        codeMirrorMode: "mllike"
      })
    ).toBe(true);
  });
});
