import { mapStateToProps } from "../file-source-list";

const st01 = {
  fileSources: [{ id: 0, filename: "a" }, { id: 1, filename: "b" }]
};

describe("FileSourceList mapStateToProps", () => {
  it("mapStateToProps", () => {
    const { fileSources: out01 } = mapStateToProps(st01);
    expect(out01.length).toBe(2);
    expect(out01[0].id).toBe(st01.fileSources[0].id);
    expect(out01[0].filename).toBe(st01.fileSources[0].filename);
    expect(out01[1].id).toBe(st01.fileSources[1].id);
    expect(out01[1].filename).toBe(st01.fileSources[1].filename);
  });
});
