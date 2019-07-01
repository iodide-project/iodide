// what to import

let MOCK_FILE_ID = 0;
let MOCK_FETCHER_ID = 0;
export function addFileSource(
  sourceURL,
  destinationFilename,
  frequency = "never"
) {
  return async dispatch => {
    // simulate request?
    const fileID = MOCK_FILE_ID;
    const fileSourceID = MOCK_FETCHER_ID;
    MOCK_FILE_ID += 1;
    MOCK_FETCHER_ID += 1;
    // await new Promise(go => setTimeout(go, 10));
    // add the filefetcher to the notebook.
    // assume that fileID + fetcherID is returned by something.
    dispatch({
      type: "ADD_FILE_SOURCE_TO_NOTEBOOK",
      sourceURL,
      fileID,
      fileSourceID,
      destinationFilename,
      frequency
    });
  };
}
