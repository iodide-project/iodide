import { newNotebook } from "../state-schemas/editor-state-prototypes";
import { historyIdGen } from "../tools/id-generators";
import { iomdParser } from "../iomd-tools/iomd-parser";

function newAppMessage(
  appMessageId,
  appMessageText,
  appMessageDetails,
  appMessageWhen
) {
  return {
    id: appMessageId,
    message: appMessageText,
    details: appMessageDetails,
    when: appMessageWhen
  };
}

function addAppMessageToState(state, appMessage) {
  const nextAppMessageId = historyIdGen.nextId();
  state.appMessages.push(
    newAppMessage(
      nextAppMessageId,
      appMessage.message,
      appMessage.details,
      appMessage.when
    )
  );
  return state;
}

const initialVariables = new Set(Object.keys(window)); // gives all global variables
initialVariables.add("__core-js_shared__");
initialVariables.add("Mousetrap");

const notebookReducer = (state = newNotebook(), action) => {
  let nextState;
  switch (action.type) {
    case "RESET_NOTEBOOK":
      return Object.assign(newNotebook(), action.userData);

    case "TOGGLE_WRAP_IN_EDITORS":
      return Object.assign({}, state, { wrapEditors: !state.wrapEditors });

    case "UPDATE_CURSOR": {
      const { line, col } = action;
      return Object.assign({}, state, {
        editorCursor: { line, col }
      });
    }

    case "UPDATE_SELECTIONS": {
      return Object.assign({}, state, {
        editorSelections: action.selections.map(s => Object.assign({}, s))
      });
    }

    case "UPDATE_IOMD_CONTENT": {
      const { iomd } = action;
      return Object.assign({}, state, { iomd, iomdChunks: iomdParser(iomd) });
    }

    case "GETTING_NOTEBOOK_REVISION_LIST": {
      return Object.assign({}, state, {
        notebookHistory: {
          ...(state.notebookHistory || {}),
          revisionListFetchStatus: "FETCHING"
        }
      });
    }

    case "UPDATE_NOTEBOOK_HISTORY": {
      const { hasLocalOnlyChanges, revisionList, selectedRevisionId } = action;
      return Object.assign({}, state, {
        notebookHistory: {
          ...(state.notebookHistory || {}),
          hasLocalOnlyChanges,
          revisionList,
          revisionListFetchStatus: "IDLE",
          selectedRevisionId
        }
      });
    }

    case "ERROR_GETTING_NOTEBOOK_REVISION_LIST": {
      return Object.assign({}, state, {
        notebookHistory: {
          ...state.notebookHistory,
          revisionListFetchStatus: "ERROR",
          revisionList: undefined
        }
      });
    }

    case "UPDATE_NOTEBOOK_HISTORY_BROWSER_SELECTED_REVISION_ID": {
      const { selectedRevisionId } = action;
      return Object.assign({}, state, {
        notebookHistory: {
          ...state.notebookHistory,
          selectedRevisionId
        }
      });
    }

    case "GETTING_REVISION_CONTENT": {
      return Object.assign({}, state, {
        notebookHistory: {
          ...state.notebookHistory,
          revisionContentFetchStatus: "FETCHING"
        }
      });
    }

    case "GOT_REVISION_CONTENT": {
      const { revisionContent } = action;
      return Object.assign({}, state, {
        notebookHistory: {
          ...state.notebookHistory,
          revisionContentFetchStatus: "IDLE",
          revisionContent: {
            ...(state.notebookHistory.revisionContent || {}),
            ...revisionContent
          }
        }
      });
    }

    case "ERROR_GETTING_REVISION_CONTENT": {
      return Object.assign({}, state, {
        notebookHistory: {
          ...state.notebookHistory,
          revisionContentFetchStatus: "ERROR"
        }
      });
    }

    case "UPDATE_NOTEBOOK_INFO": {
      return Object.assign({}, state, {
        notebookInfo: {
          ...(state.notebookInfo || {}),
          ...action.notebookInfo
        }
      });
    }

    case "UPDATE_NOTEBOOK_TITLE":
      return Object.assign({}, state, { title: action.title });

    case "SET_VIEW_MODE": {
      const { viewMode } = action;
      return Object.assign({}, state, { viewMode });
    }

    case "UPDATE_FILES_FROM_SERVER": {
      const { files } = action;
      const notebookInfo = { ...state.notebookInfo, files };
      return { ...state, notebookInfo };
    }

    case "ADD_FILE_TO_NOTEBOOK": {
      const { filename, lastUpdated, fileID } = action;
      const files = state.notebookInfo.files.map(f => Object.assign({}, f));
      if (!files.map(f => f.filename).includes(filename))
        files.push({
          filename,
          lastUpdated,
          id: fileID
        });
      else {
        files.find(f => f.filename === filename).lastUpdated = lastUpdated;
      }
      const notebookInfo = Object.assign({}, state.notebookInfo, {
        files
      });
      return Object.assign({}, state, { notebookInfo });
    }

    case "DELETE_FILE_FROM_NOTEBOOK": {
      const { fileID } = action;
      const { files } = state.notebookInfo;
      const notebookInfo = Object.assign({}, state.notebookInfo, {
        files: files.filter(f => f.id !== fileID).map(f => Object.assign({}, f))
      });
      return Object.assign({}, state, { notebookInfo });
    }

    case "SET_MODAL_STATE": {
      return Object.assign({}, state, { modalState: action.modalState });
    }

    case "SET_KERNEL_STATE": {
      return Object.assign({}, state, { kernelState: action.kernelState });
    }

    case "LOGIN_SUCCESS": {
      const { userData } = action;
      return Object.assign(
        {},
        state,
        { userData },
        {
          notebookInfo: {
            ...state.notebookInfo,
            user_can_save: userData.name === state.notebookInfo.username
          }
        }
      );
    }

    case "LOGOUT": {
      const userData = {};
      return Object.assign({}, state, { userData });
    }

    case "UPDATE_APP_MESSAGES": {
      nextState = Object.assign({}, state);
      nextState.appMessages = nextState.appMessages.slice();
      return addAppMessageToState(nextState, Object.assign({}, action.message));
    }

    case "ADD_LANGUAGE_TO_EDITOR": {
      const { languageDefinition } = action;
      const loadedLanguages = Object.assign({}, state.loadedLanguages, {
        [languageDefinition.languageId]: languageDefinition
      });
      const languageDefinitions = Object.assign({}, state.languageDefinitions, {
        [languageDefinition.languageId]: languageDefinition
      });
      return Object.assign({}, state, { loadedLanguages, languageDefinitions });
    }

    case "UPDATE_PANE_POSITIONS": {
      return Object.assign({}, state, { panePositions: action.panePositions });
    }

    case "SET_NOTEBOOK_OWNER_IN_SESSION": {
      const { notebookInfo, userData } = state;
      const newNotebookInfo = Object.assign({}, notebookInfo);
      newNotebookInfo.username = userData.name;
      newNotebookInfo.user_can_save = true;
      newNotebookInfo.files = newNotebookInfo.files.map(f =>
        Object.assign({}, f)
      );
      return Object.assign({}, state, { notebookInfo: newNotebookInfo });
    }

    default: {
      return state;
    }
  }
};

export default notebookReducer;
