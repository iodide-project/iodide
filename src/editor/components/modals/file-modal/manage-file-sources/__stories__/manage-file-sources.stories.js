import React from "react";
import { Provider } from "react-redux";
import { storiesOf } from "@storybook/react";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import ManageFileSources from "../manage-file-sources";

const mockStore = configureStore([thunk]);

const allTestCases = storiesOf("File sources pane", module);

[true, false].forEach(userCanSave => {
  const testType = userCanSave ? "user can save" : "user can't save";

  allTestCases.add(`no file sources: ${testType}`, () => {
    const store = mockStore({
      notebookInfo: { user_can_save: userCanSave },
      fileSources: {
        sources: [],
        statusType: "NONE",
        statusIsVisible: true,
        url: "",
        filename: "",
        updateInterval: "never updates"
      }
    });
    return (
      <Provider store={store}>
        <ManageFileSources />
      </Provider>
    );
  });

  allTestCases.add(`one file source: ${testType}`, () => {
    const store = mockStore({
      notebookInfo: { user_can_save: userCanSave },
      fileSources: {
        sources: [
          {
            id: 162,
            latest_file_update_operation: {
              id: 318,
              scheduled_at: "2019-07-24T03:28:35.592234Z",
              started_at: "2019-07-24T03:28:35.603029Z",
              ended_at: "2019-07-24T03:28:35.919054Z",
              status: "completed",
              failure_reason: null
            },
            update_interval: "weekly",
            filename: "polls.csv",
            url: "https://whatever.com/api"
          }
        ],
        statusMessage: "foo",
        statusType: "NONE",
        statusIsVisible: true,
        url: "http://foo.bar",
        filename: "baz",
        updateInterval: "never updates",
        confirmDeleteID: 123,
        isDeletingAnimationID: 1234
      }
    });
    return (
      <Provider store={store}>
        <ManageFileSources />
      </Provider>
    );
  });
});
// FIXME: re-implement the `AddNewFileSourceUnconnected` story
// when we have removed the unnecessary Redux state and put
// local state back into this. I will leave this story commented out
// for future reference when someone circles back on this task.
// const AddNewFileSourceStory = () => {
//   const [addedSoFar, updateAddedSoFar] = useState([]);
//   const [filename, setFilename] = useState("cool.csv");
//   const [url, setURL] = useState("https://whatever.edu");
//   const [updateInterval, setUpdateInterval] = useState("never updates");
//   const [statusMessage, updateStatusMessage] = useState("");
//   const [statusType, updateStatusType] = useState("NONE");

//   const clearUpdateStatus = () => {};

//   const addFileSource = async (f, u, i) => {
//     updateAddedSoFar([
//       ...addedSoFar,
//       { filename: f, url: u, updateInterval: i }
//     ]);
//     return "success";
//   };

//   return (
//     <>
//       <AddNewFileSourceUnconnected
//         filename={filename}
//         url={url}
//         updateInterval={updateInterval}
//         statusMessage={statusMessage}
//         statusType={statusType}
//         updateUpdateInterval={setUpdateInterval}
//         updateURL={setURL}
//         updateFilename={setFilename}
//         updateStatusMessage={updateStatusMessage}
//         updateStatusType={updateStatusType}
//         addFileSource={addFileSource}
//         clearUpdateStatus={clearUpdateStatus}
//       />
//       <h3>added so far</h3>
//       <table>
//         <tr>
//           <th>url</th>
//           <th>filename</th>
//           <th>frequency</th>
//         </tr>
//         {addedSoFar.map(({ filename: f, url: u, updateInterval: i }) => {
//           return (
//             <tr>
//               <td>{f}</td>
//               <td>{u}</td>
//               <td>{i}</td>
//             </tr>
//           );
//         })}
//       </table>
//     </>
//   );
// };

// ManageFileSourcesStories.add("AddNewFileSource", () => {
//   return <AddNewFileSourceStory />;
// });
