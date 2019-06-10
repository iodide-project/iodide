import { store } from "../../store";
import { resetNotebook } from "../../actions/actions";
import handleInitialIomd from "../handle-initial-iomd";

describe("handleInitialIomd is correct when no #iomd elt is found", () => {
  document.body.innerHTML = `
<script id="notiomd">foo</script>
`;
  beforeEach(() => {
    store.dispatch(resetNotebook());
  });

  it("store is valid when no #iomd elt is found", () => {
    expect(() => handleInitialIomd(store)).not.toThrow();
  });
  it("iomd is correct", () => {
    handleInitialIomd(store);
    expect(store.getState().iomd).toEqual("");
  });
});

describe("handleInitialIomd is correct when #iomd elt is empty", () => {
  beforeEach(() => {
    store.dispatch(resetNotebook());
    document.body.innerHTML = `
<script id="iomd"></script>
`;
  });

  it("store is valid", () => {
    expect(() => handleInitialIomd(store)).not.toThrow();
  });
  it("iomd is correct", () => {
    handleInitialIomd(store);
    expect(store.getState().iomd).toEqual("");
  });
});

describe("handleInitialIomd is correct when #iomd elt has content", () => {
  const iomdString = `

%% js
blah blah
    
    `;
  beforeEach(() => {
    store.dispatch(resetNotebook());
    document.body.innerHTML = `
<script id="iomd">${iomdString}</script>
`;
  });

  it("store is valid", () => {
    expect(() => handleInitialIomd(store)).not.toThrow();
  });
  it("iomd is correct", () => {
    handleInitialIomd(store);
    expect(store.getState().iomd).toEqual(iomdString);
  });
});
