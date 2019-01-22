import { mapStateToProps } from "../editor-mode-title";

describe("editor-mode-title mapStateToProps", () => {
  const possibleStates = [
    {
      in: { title: "test" },
      out: {
        notebookTitle: "test",
        pageTitle: "test - Iodide",
        isUntitled: false
      }
    },
    {
      in: { title: undefined },
      out: {
        notebookTitle: "",
        pageTitle: "New Notebook - Iodide",
        isUntitled: true
      }
    }
  ];
  it("maps the title to various composite props", () => {
    possibleStates.forEach(s => {
      expect(mapStateToProps(s.in)).toEqual(s.out);
    });
  });
});
