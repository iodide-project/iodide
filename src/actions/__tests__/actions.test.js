import * as actions from '../actions';

describe('Actions', () => {
  describe('exportNotebook', () => {
    it('should return the default value if no argument is given', () => {
      const expected = {
        type: 'EXPORT_NOTEBOOK',
        exportAsReport: false,
      };

      const results = actions.exportNotebook();

      expect(results).toEqual(expected)
    })

    it('should have a type of "EXPORT_NOTEBOOK"', () => {
      const expected = {
        type: 'EXPORT_NOTEBOOK',
        exportAsReport: true,
      };

      const results = actions.exportNotebook(true);

      expect(results).toEqual(expected)
    });
  });

  describe('saveNotebook', () => {
    it('should return the default value', () => {
      const expected = {
        type: 'SAVE_NOTEBOOK',
        autosave: false,
      };

      const results = actions.saveNotebook();

      expect(results).toEqual(expected)
    })

    it('should have a type of "SAVE_NOTEBOOK"', () => {
      const status = true;

      const expected = {
        type: 'SAVE_NOTEBOOK',
        autosave: true,
      };

      const results = actions.saveNotebook(status);

      expect(results).toEqual(expected)
    });
  });

  describe('loadNotebook', () => {
    it('should return the default value', () => {
      const expected = {
        type: 'LOAD_NOTEBOOK',
        title: undefined,
      };

      const results = actions.loadNotebook();

      expect(results).toEqual(expected)
    })

    it('should have a type of "LOAD_NOTEBOOK"', () => {
      const status = 'title string';

      const expected = {
        type: 'LOAD_NOTEBOOK',
        title: status,
      };

      const results = actions.loadNotebook(status);

      expect(results).toEqual(expected)
    });
  });

  describe('deleteNotebook', () => {
    it('should return the default value', () => {
      const expected = {
        type: 'DELETE_NOTEBOOK',
        title: undefined,
      };

      const results = actions.deleteNotebook();

      expect(results).toEqual(expected)
    })

    it('should have a type of "DELETE_NOTEBOOK"', () => {
      const status = 'delete title string';

      const expected = {
        type: 'DELETE_NOTEBOOK',
        title: status,
      };

      const results = actions.deleteNotebook(status);

      expect(results).toEqual(expected)
    });
  });

  describe('newNotebook', () => {
    it('should have a type of "NEW_NOTEBOOK"', () => {
      const expected = {
        type: 'NEW_NOTEBOOK',
      };

      const results = actions.newNotebook('foo');

      expect(results).toEqual(expected)
    });
  });


  describe('clearVariables', () => {
    it('should have a type of "CLEAR_VARIABLE"', () => {
      const expected = {
        type: 'CLEAR_VARIABLES',
      };

      const results = actions.clearVariables('foo');

      expect(results).toEqual(expected)
    });
  });

  describe('changePageTitle', () => {
    it('should return the default value', () => {
      const expected = {
        type: 'CHANGE_PAGE_TITLE',
        title: undefined,
      };

      const results = actions.changePageTitle();

      expect(results).toEqual(expected)
    })

    it('should have a type of "CHANGE_PAGE_TITLE"', () => {
      const status = 'new title string';

      const expected = {
        type: 'CHANGE_PAGE_TITLE',
        title: status,
      };

      const results = actions.changePageTitle(status);

      expect(results).toEqual(expected)
    });
  });

  describe('changeMode', () => {
    it('should return the default value', () => {
      const expected = {
        type: 'CHANGE_MODE',
        mode: undefined,
      };

      const results = actions.changeMode();

      expect(results).toEqual(expected)
    })

    it('should have a type of "CHANGE_MODE"', () => {
      const status = 'new mode';

      const expected = {
        type: 'CHANGE_MODE',
        mode: status,
      };

      const results = actions.changeMode(status);

      expect(results).toEqual(expected)
    });
  });

  describe('setViewMode', () => {
    it('should return the default value', () => {
      const expected = {
        type: 'SET_VIEW_MODE',
        viewMode: undefined,
      };

      const results = actions.setViewMode();

      expect(results).toEqual(expected)
    })

    it('should have a type of "SET_VIEW_MODE"', () => {
      const status = 'new mode';

      const expected = {
        type: 'SET_VIEW_MODE',
        viewMode: status,
      };

      const results = actions.setViewMode(status);

      expect(results).toEqual(expected)
    });
  });

  describe('updateInputContent', () => {
    it('should return the default value', () => {
      const expected = {
        type: 'UPDATE_INPUT_CONTENT',
        content: undefined,
      };

      const results = actions.updateInputContent();

      expect(results).toEqual(expected)
    })

    it('should have a type of "UPDATE_INPUT_CONTENT"', () => {
      const text = 'content text';

      const expected = {
        type: 'UPDATE_INPUT_CONTENT',
        content: text,
      };

      const results = actions.updateInputContent(text);

      expect(results).toEqual(expected)
    });
  });

  describe('updateCellProperties', () => {
    it('should return the default value', () => {
      const expected = {
        type: 'UPDATE_CELL_PROPERTIES',
        cellId: undefined,
        updatedProperties: undefined,
      };

      const results = actions.updateCellProperties();

      expect(results).toEqual(expected)
    })

    it('should have a type of "UPDATE_INPUT_CONTENT"', () => {
      const cellId = 1;
      const updatedProperties = []

      const expected = {
        type: 'UPDATE_CELL_PROPERTIES',
        cellId,
        updatedProperties,
      };

      const results = actions.updateCellProperties(cellId, updatedProperties);

      expect(results).toEqual(expected)
    });
  });

  describe('markCellNotRendered', () => {
    it('should have a type of "MARK_CELL_NOT_RENDERED"', () => {
      const expected = {
        type: 'MARK_CELL_NOT_RENDERED',
      };

      const results = actions.markCellNotRendered();

      expect(results).toEqual(expected)
    });
  });

  describe('insertCell', () => {
    it('should return the default value', () => {
      const expected = {
        type: 'INSERT_CELL',
        cellType: undefined,
        direction: undefined,
      };

      const results = actions.insertCell();

      expect(results).toEqual(expected)
    })

    it('should have a type of "INSERT_CELL"', () => {
      const cellType = 'Column';
      const direction = 'Right'

      const expected = {
        type: 'INSERT_CELL',
        cellType,
        direction,
      };

      const results = actions.insertCell(cellType, direction);

      expect(results).toEqual(expected)
    });
  });

  describe('addCell', () => {
    it('should return the default value', () => {
      const expected = {
        type: 'ADD_CELL',
        cellType: undefined,
      };

      const results = actions.addCell();

      expect(results).toEqual(expected)
    })

    it('should have a type of "ADD_CELL"', () => {
      const cellType = 'Column';

      const expected = {
        type: 'ADD_CELL',
        cellType,
      };

      const results = actions.addCell(cellType);

      expect(results).toEqual(expected)
    });
  });

  describe('deleteCell', () => {
    it('should have a type of "DELETE_CELL"', () => {
      const expected = {
        type: 'DELETE_CELL',
      };

      const results = actions.deleteCell();

      expect(results).toEqual(expected)
    });
  });

  describe('toggleEditorLink', () => {
    it('should have a type of "TOGGLE_EDITOR_LINK"', () => {
      const expected = {
        type: 'TOGGLE_EDITOR_LINK',
      };

      const results = actions.toggleEditorLink();

      expect(results).toEqual(expected)
    });
  });

  describe('changeSidePaneMode', () => {
    it('should return the default value', () => {
      const expected = {
        type: 'CHANGE_SIDE_PANE_MODE',
        mode: undefined,
      };

      const results = actions.changeSidePaneMode();

      expect(results).toEqual(expected)
    })

    it('should have a type of "CHANGE_SIDE_PANE_MODE"', () => {
      const mode = 'selected';

      const expected = {
        type: 'CHANGE_SIDE_PANE_MODE',
        mode,
      };

      const results = actions.changeSidePaneMode(mode);

      expect(results).toEqual(expected)
    });
  });

  describe('changeSidePaneWidth', () => {
    it('should return the default value', () => {
      const expected = {
        type: 'CHANGE_SIDE_PANE_WIDTH',
        widthShift: undefined,
      };

      const results = actions.changeSidePaneWidth();

      expect(results).toEqual(expected)
    })

    it('should have a type of "CHANGE_SIDE_PANE_WIDTH"', () => {
      const widthShift = '10px';

      const expected = {
        type: 'CHANGE_SIDE_PANE_WIDTH',
        widthShift,
      };

      const results = actions.changeSidePaneWidth(widthShift);

      expect(results).toEqual(expected)
    });
  });
});
