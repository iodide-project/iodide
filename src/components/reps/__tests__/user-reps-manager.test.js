import { UserRepsManager } from "../user-reps-manager";

describe("UserRepsManager.addRenderer", () => {
  let repsManager;
  let warnFn;
  beforeEach(() => {
    warnFn = jest.fn();
    repsManager = new UserRepsManager(warnFn);
  });

  it("addRenderer appends to userReps if renderer spec is ok", () => {
    repsManager.addRenderer({ shouldRender: () => true, render: () => "foo" });
    expect(repsManager.userReps.length).toBe(1);
    repsManager.addRenderer({ shouldRender: () => true, render: () => "bar" });
    expect(repsManager.userReps.length).toBe(2);
  });

  it("addRenderer throws error if 'render' missing", () => {
    expect(() =>
      repsManager.addRenderer({ shouldRender: () => true })
    ).toThrow();
  });

  it("addRenderer throws error if 'shouldRender' missing", () => {
    expect(() => repsManager.addRenderer({ render: () => "foo" })).toThrow();
  });

  it("addRenderer throws error if 'render' is not a function", () => {
    expect(() =>
      repsManager.addRenderer({ shouldRender: () => true, render: "a string" })
    ).toThrow();
  });

  it("addRenderer throws error if 'shouldRender' is not a function", () => {
    expect(() =>
      repsManager.addRenderer({ shouldRender: "a string", render: () => "foo" })
    ).toThrow();
  });
});

describe("UserRepsManager.clearRenderers", () => {
  let repsManager;
  let warnFn;
  beforeEach(() => {
    warnFn = jest.fn();
    repsManager = new UserRepsManager(warnFn);
  });

  it("clears renderers ok", () => {
    repsManager.addRenderer({ shouldRender: () => true, render: () => "foo" });
    repsManager.addRenderer({ shouldRender: () => true, render: () => "bar" });
    repsManager.clearRenderers();
    expect(repsManager.userReps.length).toBe(0);
  });
});

describe("UserRepsManager.getUserRepIfAvailable", () => {
  let repsManager;
  let warnFn;
  let value;
  beforeEach(() => {
    warnFn = jest.fn();
    value = undefined;
    repsManager = new UserRepsManager(warnFn);
  });

  it("returns null and warns if shouldRender function errors", () => {
    repsManager.addRenderer({
      shouldRender: () => this.nonExistent.this.reference, // should cause an error
      render: () => "foo"
    });
    expect(repsManager.getUserRepIfAvailable(value)).toBeNull();
    expect(warnFn.mock.calls[0][0]).toEqual(
      "user renderer failed, `shouldRender` function errored"
    );
  });

  it("returns null and warns if render function errors", () => {
    repsManager.addRenderer({
      shouldRender: () => true,
      render: () => this.nonExistent.this.reference // should cause an error
    });
    expect(repsManager.getUserRepIfAvailable(value)).toBeNull();
    expect(warnFn.mock.calls[0][0]).toEqual(
      "user renderer failed, `render` function errored"
    );
  });

  it("returns null and warns if render function returns non-string", () => {
    repsManager.addRenderer({
      shouldRender: () => true,
      render: () => 1234
    });
    expect(repsManager.getUserRepIfAvailable(value)).toBeNull();
    expect(warnFn.mock.calls[0][0]).toEqual(
      "user renderer failed, `render` function must return string"
    );
  });

  it("returns the first renderer that matches", () => {
    repsManager.addRenderer({
      shouldRender: () => true,
      render: () => "first"
    });
    repsManager.addRenderer({
      shouldRender: () => true,
      render: () => "second"
    });
    repsManager.addRenderer({
      shouldRender: () => true,
      render: () => "third"
    });
    expect(repsManager.getUserRepIfAvailable(value)).toBe("first");
  });

  it("returns the first renderer that matches", () => {
    repsManager.addRenderer({
      shouldRender: () => false,
      render: () => "first"
    });
    repsManager.addRenderer({
      shouldRender: () => true,
      render: () => "second"
    });
    repsManager.addRenderer({
      shouldRender: () => true,
      render: () => "third"
    });
    expect(repsManager.getUserRepIfAvailable(value)).toBe("second");
  });
});
