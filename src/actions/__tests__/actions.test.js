import * as actions from '../actions';

describe('Actions', () => {
  describe('exportNotebook', () => {
    it('should return the default value', () => {
      const expected = {
        type: 'EXPORT_NOTEBOOK',
        exportAsReport: false,
      };

      const results = actions.exportNotebook();

      expect(results).toEqual(expected)
    })
  })
})
