export default function evalFrameActionReducer(state, action) {
  let nextState;
  switch (action.type) {
    case "CLEAR_VARIABLES": {
      nextState = Object.assign({}, state);
      nextState.userDefinedVarNames = [];
      return nextState;
    }

    case "ADD_TO_CONSOLE_HISTORY": {
      const actionCopy = Object.assign({}, action);
      delete actionCopy.type;
      const history = [...state.history, actionCopy];
      return Object.assign({}, state, { history });
    }

    case "UPDATE_VALUE_IN_HISTORY": {
      const actionCopy = Object.assign({}, action);
      const history = [...state.history.slice()];
      const i = history.findIndex(
        h => h.historyId === actionCopy.historyItem.historyId
      );
      const historyEntry = Object.assign(
        {},
        history[i],
        actionCopy.historyItem
      );
      history[i] = historyEntry;
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
      // first, let's only scroll through console inputs.
      const inputHistory = state.history.filter(
        d => d.historyType === "CONSOLE_INPUT"
      );
      const historyLength = inputHistory.length;
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
        nextConsoleText = inputHistory[historyLength - nextScrollback].content;
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

    case "SET_CONSOLE_LANGUAGE": {
      return Object.assign({}, state, { languageLastUsed: action.language });
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
