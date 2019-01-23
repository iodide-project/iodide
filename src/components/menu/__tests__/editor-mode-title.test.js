import { mapStateToProps } from "../editor-mode-title";

describe("editor-mode-title mapStateToProps", () => {
  const possibleStates = [
    {
      in: { title: "test" },
      out: {
        notebookTitle: "test",
        pageTitle: "test - Iodide",
        titleColor: "white"
      }
    },
    {
      in: { title: undefined },
      out: {
        notebookTitle: "",
        pageTitle: "New Notebook - Iodide",
        titleColor: "lightgray"
      }
    }
  ];
  it("maps the title to various composite props", () => {
    possibleStates.forEach(s => {
      expect(mapStateToProps(s.in)).toEqual(s.out);
    });
  });
});
