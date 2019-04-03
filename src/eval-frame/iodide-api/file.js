import { store as reduxStore } from "../store";
import sendFileRequestToEditor from "../tools/send-file-request-to-editor";

const VALID_FETCH_TYPES = ["text", "json", "blob", "js", "css"];
const VARIABLE_TYPE_FILES = ["text", "json", "blob"];

function validateFetchType(fetchType) {
  if (!VALID_FETCH_TYPES.includes(fetchType)) {
    throw new Error(`fetch type ${fetchType} not supported`);
  }
}

function validateFileName(fileName) {
  if (!(typeof fileName === "string" || fileName instanceof String)) {
    throw new Error(
      `file name must be a string, instead received ${typeof fileName}`
    );
  }
}

function getFiles(store) {
  return store.getState().notebookInfo.files;
}

export function connectExists(store) {
  return function exists(fileName) {
    const files = getFiles(store);
    validateFileName(fileName);
    return files.map(f => f.filename).includes(fileName);
  };
}

export function connectList(store) {
  return function list() {
    return getFiles(store);
  };
}

export function loadFile(fileName, fetchType, variableName = undefined) {
  try {
    validateFetchType(fetchType);
    validateFileName(fileName);
  } catch (err) {
    throw err;
  }

  return sendFileRequestToEditor(fileName, "LOAD_FILE", {
    fetchType
  }).request.then(file => {
    if (VARIABLE_TYPE_FILES.includes(fetchType) && variableName) {
      window[variableName] = file;
    }
    return file;
  });
}

export function deleteFile(fileName) {
  try {
    validateFileName(fileName);
  } catch (err) {
    throw err;
  }
  return sendFileRequestToEditor(fileName, "DELETE_FILE").request;
}

export function saveFile(data, fileName, saveOptions = { overwrite: false }) {
  try {
    validateFileName(fileName);
  } catch (err) {
    throw err;
  }
  return sendFileRequestToEditor(fileName, "SAVE_FILE", {
    ...saveOptions,
    data
  }).request;
}

// export function connectSave(store, saveFunction) {
//   return function save(data, fileName, saveOptions = { overwrite: false }) {
//     // first thing first = check to see if exists in store.

//     const validateAndFetchMetadata = () => {
//       const exists = connectExists(store);
//       if (!saveOptions.overwrite && exists(fileName)) {
//         throw new Error(
//           `file ${fileName} already exists. Try setting {overwrite: true}`
//         );
//       }

//       const updateFile = saveOptions.overwrite && exists(fileName);
//       const files = getFiles(store);
//       const fileID = exists(fileName)
//         ? files[files.findIndex(f => f.filename === fileName)].id
//         : undefined;
//       return {
//         notebookID: store.getState().notebookInfo.notebook_id,
//         data,
//         updateFile, // this flag tells us if we need to update the file
//         fileID // for updating the file
//       };
//     };

//     return saveFunction(fileName, "SAVE_FILE", validateAndFetchMetadata);
//   };
// }

export const file = {
  save: saveFile, // connectSave(reduxStore, sendFileRequestToEditor),
  load: loadFile, // connectLoad(reduxStore, sendFileRequestToEditor),
  delete: deleteFile, // connectDeleteFile(reduxStore, sendFileRequestToEditor),
  exists: connectExists(reduxStore),
  list: connectList(reduxStore)
};
