export default function reducer(state, action) {
  const { evalErrorStacks } = state;
  switch (action.type) {
    case "traceback/RECORD_ERROR_STACK": {
      const { evalId, errorStack } = action;
      return {
        ...state,
        evalErrorStacks: {
          ...evalErrorStacks,
          [evalId]: errorStack
        }
      };
    }

    default: {
      return state;
    }
  }
}
