import { store } from "../../store";
import { resetNotebook } from "../../actions/actions";
import handleInitialJsmd from "../handle-initial-jsmd";

describe("handleInitialJsmd is correct when no #jsmd elt is found", () => {
  document.body.innerHTML = `
<script id="notjsmd">foo</script>
`;
  beforeEach(() => {
    store.dispatch(resetNotebook());
  });

  it("store is valid when no #jsmd elt is found", () => {
    expect(() => handleInitialJsmd(store)).not.toThrow();
  });
  it("jsmd is correct", () => {
    handleInitialJsmd(store);
    expect(store.getState().jsmd).toEqual("");
  });
});

describe("handleInitialJsmd is correct when #jsmd elt is empty", () => {
  beforeEach(() => {
    store.dispatch(resetNotebook());
    document.body.innerHTML = `
<script id="jsmd"></script>
`;
  });

  it("store is valid", () => {
    expect(() => handleInitialJsmd(store)).not.toThrow();
  });
  it("jsmd is correct", () => {
    handleInitialJsmd(store);
    expect(store.getState().jsmd).toEqual("");
  });
});

describe("handleInitialJsmd is correct when #jsmd elt has content", () => {
  const jsmdString = `

%% js
blah blah
    
    `;
  beforeEach(() => {
    store.dispatch(resetNotebook());
    document.body.innerHTML = `
<script id="jsmd">${jsmdString}</script>
`;
  });

  it("store is valid", () => {
    expect(() => handleInitialJsmd(store)).not.toThrow();
  });
  it("jsmd is correct", () => {
    handleInitialJsmd(store);
    expect(store.getState().jsmd).toEqual(jsmdString);
  });
});
