export default function evalFrameActionReducer(state, action) {
  let nextState;
  switch (action.type) {
    case "CLEAR_VARIABLES": {
      nextState = Object.assign({}, state);
      nextState.userDefinedVarNames = [];
      return nextState;
    }

    case "ADD_TO_CONSOLE": {
      const actionCopy = Object.assign({}, action);
      delete actionCopy.type;
      const history = [...state.history, actionCopy];
      return Object.assign({}, state, { history });
    }
    case "UPDATE_CONSOLE_ENTRY": {
      const actionCopy = Object.assign({}, action);
      delete actionCopy.type;
      const history = [...state.history.slice()]; // state.history.map(e => Object.assign({}, e));
      const i = history.findIndex(h => h.historyId === actionCopy.historyId);
      const historyEntry = Object.assign({}, history[i], actionCopy);
      history[i] = historyEntry;
      return Object.assign({}, state, { history });
    }

    case "APPEND_TO_EVAL_HISTORY": {
      console.log("append");
      const actionCopy = Object.assign({}, action);
      delete actionCopy.type;
      const history = [...state.history, actionCopy];
      return Object.assign({}, state, { history });
    }

    case "UPDATE_VALUE_IN_HISTORY": {
      const history = [...state.history];
      // const historyEntry = history.find(h => h.historyId === action.historyId)
      // if (historyEntry) { historyEntry.value = action.value }
      return Object.assign({}, state, { history });
    }

    case "UPDATE_CONSOLE_TEXT": {
      return Object.assign({}, state, { consoleText: action.consoleText });
    }

    case "CLEAR_CONSOLE_TEXT_CACHE": {
      return Object.assign({}, state, { consoleTextCache: "" });
    }

    case "RESET_HISTORY_CURSOR": {
      return Object.assign({}, state, { consoleScrollbackPosition: 0 });
    }

    case "CONSOLE_HISTORY_MOVE": {
      const historyLength = state.history.length;
      // note that we bound consoleScrollbackPosition between
      // zero (which represents the cursor being in th) and historyLength
      const nextScrollback = Math.min(
        Math.max(
          0,
          state.consoleScrollbackPosition + action.consoleCursorDelta
        ),
        historyLength
      );

      let { consoleTextCache } = state;
      if (state.consoleScrollbackPosition === 0) {
        // if we moved FROM 0, set the consoleTextCache from the current value
        consoleTextCache = state.consoleText;
      }

      let nextConsoleText;
      if (nextScrollback === 0) {
        // if we moved TO 0, set the consoleText from the cache
        nextConsoleText = consoleTextCache;
      } else {
        // otherwise set the consoleText to the history value
        nextConsoleText = state.history[historyLength - nextScrollback].content;
      }

      return Object.assign({}, state, {
        consoleText: nextConsoleText,
        consoleTextCache,
        consoleScrollbackPosition: nextScrollback
      });
    }

    case "UPDATE_USER_VARIABLES": {
      const { userDefinedVarNames } = action;
      return Object.assign({}, state, { userDefinedVarNames });
    }

    case "SAVE_ENVIRONMENT": {
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

    case "ENVIRONMENT_UPDATE_FROM_EDITOR": {
      return Object.assign({}, state, {
        savedEnvironment: action.savedEnvironment
      });
    }

    case "ADD_LANGUAGE_TO_EVAL_FRAME": {
      const loadedLanguages = Object.assign({}, state.loadedLanguages, {
        [action.languageDefinition.languageId]: action.languageDefinition
      });
      return Object.assign({}, state, { loadedLanguages });
    }

    default: {
      return state;
    }
  }
}
