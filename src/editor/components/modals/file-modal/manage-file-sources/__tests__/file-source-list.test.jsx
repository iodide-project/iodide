import { mapStateToProps } from "../file-source-list";

const st01 = {
  fileSources: {
    sources: [
      { id: 0, filename: "a" },
      { id: 1, filename: "b" }
    ]
  }
};

describe("FileSourceList mapStateToProps", () => {
  it("mapStateToProps", () => {
    const { fileSources: out01 } = mapStateToProps(st01);
    expect(out01.length).toBe(2);
    expect(out01[0]).toBe(st01.fileSources.sources[0].id);
    expect(out01[1]).toBe(st01.fileSources.sources[1].id);
  });
});
