import { saveFileSourceToServer } from "../../shared/utils/file-source-operations";

export function addFileSource(
  sourceURL,
  destinationFilename,
  frequency = "never"
) {
  return async (dispatch, getState) => {
    const notebookID = getState().notebookInfo.notebook_id;
    const response = await saveFileSourceToServer(
      notebookID,
      sourceURL,
      destinationFilename,
      "24:00:00"
    );
    const fileSourceID = response.id;
    //
    dispatch({
      type: "ADD_FILE_SOURCE_TO_NOTEBOOK",
      sourceURL,
      fileSourceID,
      destinationFilename,
      frequency
    });
  };
}
