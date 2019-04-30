import { newNotebook } from "../state-schemas/editor-state-prototypes";
import { historyIdGen } from "../tools/id-generators";

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
initialVariables.add("CodeMirror");

const notebookReducer = (state = newNotebook(), action) => {
  let nextState;
  switch (action.type) {
    case "RESET_NOTEBOOK":
      return Object.assign(newNotebook(), action.userData);

    case "TOGGLE_WRAP_IN_EDITORS":
      return Object.assign({}, state, { wrapEditors: !state.wrapEditors });

    case "UPDATE_NOTEBOOK_INFO":
      return Object.assign({}, state, { notebookInfo: action.notebookInfo });

    case "SET_PREVIOUS_AUTOSAVE": {
      const { hasPreviousAutosave } = action;
      return Object.assign({}, state, { hasPreviousAutosave });
    }

    case "SET_CONNECTION_STATUS": {
      const { status } = action;
      return Object.assign({}, state, {
        notebookInfo: { ...state.notebookInfo, connectionStatus: status }
      });
    }

    case "REPLACE_NOTEBOOK_CONTENT": {
      return Object.assign({}, state, {
        jsmd: action.jsmd,
        jsmdChunks: action.jsmdChunks,
        title: action.title || state.title
      });
    }

    case "UPDATE_CURSOR": {
      const { line, col, forceUpdate } = action;
      return Object.assign({}, state, {
        editorCursor: { line, col, forceUpdate }
      });
    }

    case "UPDATE_SELECTIONS": {
      return Object.assign({}, state, {
        editorSelections: action.selections.map(s => Object.assign({}, s))
      });
    }

    case "UPDATE_JSMD_CONTENT": {
      const { jsmd, jsmdChunks } = action;
      return Object.assign({}, state, { jsmd, jsmdChunks });
    }

    case "GETTING_NOTEBOOK_REVISION_LIST": {
      return Object.assign({}, state, {
        notebookHistory: {
          ...(state.notebookHistory || {}),
          revisionListFetchStatus: "FETCHING"
        }
      });
    }

    case "GOT_NOTEBOOK_REVISION_LIST": {
      const { revisionList, selectedRevisionId } = action;
      return Object.assign({}, state, {
        notebookHistory: {
          ...(state.notebookHistory || {}),
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

    case "NOTEBOOK_SAVED": {
      return Object.assign({}, state, {
        lastSaved: new Date().toISOString(),
        notebookInfo: Object.assign({}, state.notebookInfo, {
          user_can_save: true,
          revision_id: action.newRevisionId
        })
      });
    }

    case "UPDATE_CHECKING_NOTEBOOK_REVISION_IS_LATEST": {
      const { checkingRevisionIsLatest } = action;
      return Object.assign({}, state, { checkingRevisionIsLatest });
    }

    case "UPDATE_NOTEBOOK_REVISION_IS_LATEST": {
      const { revisionIsLatest } = action;
      return Object.assign({}, state, {
        notebookInfo: {
          ...(state.notebookInfo || {}),
          revision_is_latest: revisionIsLatest
        }
      });
    }

    case "ADD_NOTEBOOK_ID": {
      const notebookId = action.id;
      const notebookInfo = Object.assign({}, state.notebookInfo);
      notebookInfo.notebook_id = notebookId;
      return Object.assign({}, state, { notebookInfo });
    }

    case "CHANGE_PAGE_TITLE":
      return Object.assign({}, state, { title: action.title });

    case "SET_VIEW_MODE": {
      const { viewMode } = action;
      return Object.assign({}, state, { viewMode });
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

    case "ENVIRONMENT_UPDATE_FROM_EVAL_FRAME": {
      let newSavedEnvironment;
      if (action.update) {
        newSavedEnvironment = Object.assign(
          {},
          state.savedEnvironment,
          action.updateObj
        );
      } else {
        newSavedEnvironment = action.updateObj;
      }
      return Object.assign({}, state, {
        savedEnvironment: newSavedEnvironment
      });
    }

    case "ADD_LANGUAGE_TO_EDITOR": {
      const { languageDefinition } = action;
      languageDefinition.codeMirrorModeLoaded = false;
      const loadedLanguages = Object.assign({}, state.loadedLanguages, {
        [languageDefinition.languageId]: languageDefinition
      });
      const languageDefinitions = Object.assign({}, state.languageDefinitions, {
        [languageDefinition.languageId]: languageDefinition
      });
      return Object.assign({}, state, { loadedLanguages, languageDefinitions });
    }

    case "CODEMIRROR_MODE_READY": {
      const { codeMirrorMode } = action;
      const loadedLanguages = Object.assign({}, state.loadedLanguages);
      // set all languages with correct codeMirrorMode to have codeMirrorModeLoaded===true
      Object.keys(loadedLanguages).forEach(langKey => {
        if (loadedLanguages[langKey].codeMirrorMode === codeMirrorMode) {
          loadedLanguages[langKey].codeMirrorModeLoaded = true;
        }
      });
      return Object.assign({}, state, { loadedLanguages });
    }

    case "UPDATE_PANE_POSITIONS": {
      return Object.assign({}, state, { panePositions: action.panePositions });
    }

    case "SET_MOST_RECENT_SAVED_CONTENT": {
      return Object.assign({}, state, {
        previouslySavedContent: {
          jsmd: state.jsmd,
          title: state.title
        }
      });
    }

    default: {
      return state;
    }
  }
};

export default notebookReducer;
