import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import handleInitialIomd from "../handle-initial-iomd";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("handleInitialIomd is correct when no #iomd elt is found", () => {
  let store;

  beforeEach(() => {
    document.body.innerHTML = `<script id="notiomd">foo</script>`;
    store = mockStore({});
  });

  it("store is valid when no #iomd elt is found", () => {
    expect(() => handleInitialIomd(store)).not.toThrow();
  });

  it("iomd is correct", () => {
    handleInitialIomd(store);
    expect(store.getActions()).toEqual([]);
  });
});

describe("handleInitialIomd is correct when #iomd elt is empty", () => {
  let store;

  beforeEach(() => {
    document.body.innerHTML = `
<script id="iomd"></script>
`;
    store = mockStore({});
  });

  it("store is valid", () => {
    expect(() => handleInitialIomd(store)).not.toThrow();
  });

  it("iomd is correct", () => {
    handleInitialIomd(store);
    expect(store.getActions()).toEqual([]);
  });
});

describe("handleInitialIomd is correct when #iomd elt has content", () => {
  const iomdString = `

%% js
blah blah

    `;
  let store;

  beforeEach(() => {
    document.body.innerHTML = `
<script id="iomd">${iomdString}</script>
`;
    store = mockStore({});
  });

  it("store is valid", () => {
    expect(() => handleInitialIomd(store)).not.toThrow();
  });

  it("iomd is correct", () => {
    handleInitialIomd(store);
    expect(store.getActions()).toEqual([
      { iomd: iomdString, type: "UPDATE_IOMD_CONTENT" }
    ]);
  });
});
