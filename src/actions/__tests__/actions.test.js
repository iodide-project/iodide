import * as actions from '../actions';

describe('temporarilySaveRunningCellID', () => {
  it('creates an object with a type: TEMPORARILY_SAVE_RUNNING_CELL_ID and cellID payload', () => {
    const cellID = 2;
    const expected = { type: 'TEMPORARILY_SAVE_RUNNING_CELL_ID', cellID };
    expect(actions.temporarilySaveRunningCellID(cellID)).toEqual(expected);
  });
});

describe('updateAppMessages', () => {
  it('creates an object with a type: UPDATE_APP_MESSAGES and message payload', () => {
    const message = 'hello';
    const expected = { type: 'UPDATE_APP_MESSAGES', message };
    expect(actions.updateAppMessages(message)).toEqual(expected);
  });
});

describe('importNotebook', () => {
  it('creates an object with a type: IMPORT_NOTEBOOK and newState payload', () => {
    const newState = { title: 'new' };
    const expected = { type: 'IMPORT_NOTEBOOK', newState };
    expect(actions.importNotebook(newState)).toEqual(expected);
  });
});

describe('exportNotebook', () => {
  it('creates an object with a type: EXPORT_NOTEBOOK and exportAsReport payload', () => {
    const exportAsReport = true;
    const expected = { type: 'EXPORT_NOTEBOOK', exportAsReport };
    expect(actions.exportNotebook(exportAsReport)).toEqual(expected);
  });
});

describe('saveNotebook', () => {
  it('creates an object with a type: SAVE_NOTEBOOK and autosave payload', () => {
    const autosave = true;
    const expected = { type: 'SAVE_NOTEBOOK', autosave };
    expect(actions.saveNotebook(autosave)).toEqual(expected);
  });
});

describe('loadNotebook', () => {
  it('creates an object with a type: LOAD_NOTEBOOK and title payload', () => {
    const title = 'untitled';
    const expected = { type: 'LOAD_NOTEBOOK', title };
    expect(actions.loadNotebook(title)).toEqual(expected);
  });
});

describe('deleteNotebook', () => {
  it('creates an object with a type: DELETE_NOTEBOOK and title payload', () => {
    const title = 'untitled';
    const expected = { type: 'DELETE_NOTEBOOK', title };
    expect(actions.deleteNotebook(title)).toEqual(expected);
  });
});

describe('newNotebook', () => {
  it('creates an object with a type: NEW_NOTEBOOK', () => {
    const expected = { type: 'NEW_NOTEBOOK' };
    expect(actions.newNotebook()).toEqual(expected);
  });
});

describe('clearVariables', () => {
  it('creates an object with a type: CLEAR_VARIABLES', () => {
    const expected = { type: 'CLEAR_VARIABLES' };
    expect(actions.clearVariables()).toEqual(expected);
  });
});

describe('changePageTitle', () => {
  it('creates an object with a type: CHANGE_PAGE_TITLE and title payload', () => {
    const title = 'untitled';
    const expected = { type: 'CHANGE_PAGE_TITLE', title };
    expect(actions.changePageTitle(title)).toEqual(expected);
  });
});

describe('changeMode', () => {
  it('creates an object with a type: CHANGE_MODE and mode payload', () => {
    const mode = 'command';
    const expected = { type: 'CHANGE_MODE', mode };
    expect(actions.changeMode(mode)).toEqual(expected);
  });
});

describe('setViewMode', () => {
  it('creates an object with a type: SET_VIEW_MODE and viewMode payload', () => {
    const viewMode = 'editor';
    const expected = { type: 'SET_VIEW_MODE', viewMode };
    expect(actions.setViewMode(viewMode)).toEqual(expected);
  });
});

describe('updateInputContent', () => {
  it('creates an object with a type: UPDATE_INPUT_CONTENT and text payload', () => {
    const text = 'string';
    const expected = { type: 'UPDATE_INPUT_CONTENT', content: text };
    expect(actions.updateInputContent(text)).toEqual(expected);
  });
});

describe('appendToEvalHistory', () => {
  it('creates an object with a type: APPEND_TO_EVAL_HISTORY and cellId and content payload', () => {
    const cellId = 'string';
    const content = 'text';
    const expected = { type: 'APPEND_TO_EVAL_HISTORY', cellId, content };
    expect(actions.appendToEvalHistory(cellId, content)).toEqual(expected);
  });
});

describe('updateCellProperties', () => {
  it('creates an object with a type: UPDATE_CELL_PROPERTIES and cellId and updatedProperties payload', () => {
    const cellId = 'string';
    const updatedProperties = 'text';
    const expected = {
      type: 'UPDATE_CELL_PROPERTIES',
      cellId,
      updatedProperties,
    };
    expect(actions.updateCellProperties(cellId, updatedProperties)).toEqual(expected);
  });
});

describe('incrementExecutionNumber', () => {
  it('creates an object with a type: INCREMENT_EXECUTION_NUMBER', () => {
    const expected = { type: 'INCREMENT_EXECUTION_NUMBER' };
    expect(actions.incrementExecutionNumber()).toEqual(expected);
  });
});

describe('updateUserVariables', () => {
  it('creates an object with a type: UPDATE_USER_VARIABLES', () => {
    const expected = { type: 'UPDATE_USER_VARIABLES' };
    expect(actions.updateUserVariables()).toEqual(expected);
  });
});

describe('addLanguage', () => {
  it('creates an object with a type: ADD_LANGUAGE and languageDefinition payload', () => {
    const languageDefinition = 'js';
    const expected = { type: 'ADD_LANGUAGE', languageDefinition };
    expect(actions.addLanguage(languageDefinition)).toEqual(expected);
  });
});

describe('setCellRowCollapsedState', () => {
  it('creates an object with a type: SET_CELL_ROW_COLLAPSE_STATE and viewMode, rowType, rowOverflow, and cellId payload', () => {
    const viewMode = 'editor';
    const rowType = '';
    const rowOverflow = true;
    const cellId = 2;
    const expected = {
      type: 'SET_CELL_ROW_COLLAPSE_STATE',
      viewMode,
      rowType,
      rowOverflow,
      cellId,
    };
    expect(actions.setCellRowCollapsedState(viewMode, rowType, rowOverflow, cellId))
      .toEqual(expected);
  });
});

describe('markCellNotRendered', () => {
  it('creates an object with a type: MARK_CELL_NOT_RENDERED', () => {
    const expected = { type: 'MARK_CELL_NOT_RENDERED' };
    expect(actions.markCellNotRendered()).toEqual(expected);
  });
});

describe('cellUp', () => {
  it('creates an object with a type: CELL_UP', () => {
    const expected = { type: 'CELL_UP' };
    expect(actions.cellUp()).toEqual(expected);
  });
});

describe('cellDown', () => {
  it('creates an object with a type: CELL_DOWN', () => {
    const expected = { type: 'CELL_DOWN' };
    expect(actions.cellDown()).toEqual(expected);
  });
});

describe('insertCell', () => {
  it('creates an object with a type: INSERT_CELL and cellType and direction payload', () => {
    const cellType = 'code';
    const direction = 'above';
    const expected = { type: 'INSERT_CELL', cellType, direction };
    expect(actions.insertCell(cellType, direction)).toEqual(expected);
  });
});

describe('addCell', () => {
  it('creates an object with a type: ADD_CELL and cellType payload', () => {
    const cellType = 'code';
    const expected = { type: 'ADD_CELL', cellType };
    expect(actions.addCell(cellType)).toEqual(expected);
  });
});

describe('selectCell', () => {
  it('creates an object with a type: SELECT_CELL and cellID, id, and scrollToCell payload', () => {
    const cellID = 2;
    const id = cellID;
    const scrollToCell = true;
    const expected = { type: 'SELECT_CELL', id, scrollToCell };
    expect(actions.selectCell(cellID, scrollToCell)).toEqual(expected);
  });
});

describe('deleteCell', () => {
  it('creates an object with a type: DELETE_CELL', () => {
    const expected = { type: 'DELETE_CELL' };
    expect(actions.deleteCell()).toEqual(expected);
  });
});

describe('changeElementType', () => {
  it('creates an object with a type: CHANGE_ELEMENT_TYPE and elementType payload', () => {
    const elementType = 'string';
    const expected = { type: 'CHANGE_ELEMENT_TYPE', elementType };
    expect(actions.changeElementType(elementType)).toEqual(expected);
  });
});

describe('changeDOMElementID', () => {
  it('creates an object with a type: CHANGE_DOM_ELEMENT_ID and elemID payload', () => {
    const elemID = 2;
    const expected = { type: 'CHANGE_DOM_ELEMENT_ID', elemID };
    expect(actions.changeDOMElementID(elemID)).toEqual(expected);
  });
});

describe('changeSidePaneMode', () => {
  it('creates an object with a type: CHANGE_SIDE_PANE_MODE and mode payload', () => {
    const mode = 'command';
    const expected = { type: 'CHANGE_SIDE_PANE_MODE', mode };
    expect(actions.changeSidePaneMode(mode)).toEqual(expected);
  });
});

describe('changeSidePaneWidth', () => {
  it('creates an object with a type: CHANGE_SIDE_PANE_WIDTH and widthShift payload', () => {
    const widthShift = 'auto';
    const expected = { type: 'CHANGE_SIDE_PANE_WIDTH', widthShift };
    expect(actions.changeSidePaneWidth(widthShift)).toEqual(expected);
  });
});

describe('saveEnvironment', () => {
  it('creates an object with a type: SAVE_ENVIRONMENT and updateObj and update payload', () => {
    const updateObj = 'auto';
    const update = true;
    const expected = { type: 'SAVE_ENVIRONMENT', updateObj, update };
    expect(actions.saveEnvironment(updateObj, update)).toEqual(expected);
  });
});
