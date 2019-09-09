export default function evalFrameActionReducer(state, action) {
  let nextState;
  switch (action.type) {
    case "CLEAR_VARIABLES": {
      nextState = Object.assign({}, state);
      nextState.userDefinedVarNames = [];
      return nextState;
    }

    case "ADD_LANGUAGE_TO_EVAL_FRAME": {
      const loadedLanguages = Object.assign({}, state.loadedLanguages, {
        [action.languageDefinition.languageId]: action.languageDefinition
      });
      return Object.assign({}, state, { loadedLanguages });
    }

    case "UPDATE_USER_VARIABLES": {
      const { userDefinedVarNames } = action;
      return Object.assign({}, state, { userDefinedVarNames });
    }

    default: {
      return state;
    }
  }
}
