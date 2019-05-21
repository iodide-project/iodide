import {
  getLocalAutosave,
  writeLocalAutosave,
  clearLocalAutosave
} from "../local-autosave";
import { newNotebook } from "../../state-schemas/editor-state-prototypes";

describe("autosave basics", () => {
  it("saves / restores / clears as expected", async () => {
    const state = Object.assign(newNotebook, {
      jsmd: "my exciting notebook content",
      title: "exciting title",
      notebookInfo: { connectionMode: "SERVER", notebook_id: 1, revision_id: 2 }
    });

    expect(await getLocalAutosave(state)).toEqual({});
    await writeLocalAutosave(state);
    expect(await getLocalAutosave(state)).toEqual({
      jsmd: state.jsmd,
      title: state.title,
      parentRevisionId: state.notebookInfo.revision_id
    });
    await clearLocalAutosave(state);
    expect(await getLocalAutosave(state)).toEqual({});
  });
});
