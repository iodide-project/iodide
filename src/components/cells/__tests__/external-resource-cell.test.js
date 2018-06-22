import React from 'react';
import { shallow } from 'enzyme';


import {
  ExternalResourceCellUnconnected as ExternalResourceCell,
  mapStateToProps,
} from '../external-resource-cell';
import { CellContainer } from '../cell-container';
import CellRow from '../cell-row';
import CellEditor from '../cell-editor';
import ExternalResourceOutput from '../../reps/output-handler-external-resource';

const STANDARD_NETWORK_ERROR = 'A network error occurred.';

describe('ExternalResourceCellUnconnected contains the expected child components', () => {
  let props;
  let mountedCell;
  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(<ExternalResourceCell {...props} />);
    }
    return mountedCell;
  };

  beforeEach(() => {
    props = {
      cellId: 5,
      value: [
        {
          src: 'http://whatever.com/cdn/a-library.js',
          status: 'loaded',
          variables: ['a', 'b', 'c'],
        },
        {
          src: 'http://whatever.com/cdn/a-stylsheet.css',
          status: 'loaded',
        },
        {
          src: 'http://whatever.com/cdn/some-other-library.js',
          status: 'error',
          statusExplanation: STANDARD_NETWORK_ERROR,
        },
        {
          src: 'http://whatever.com/cdn/some-other-stylesheet.css',
          status: 'error',
          statusExplanation: STANDARD_NETWORK_ERROR,
        },
      ],
    };
    mountedCell = undefined;
  });

  it('always renders one CellContainer', () => {
    expect(cell().find(CellContainer).length).toBe(1);
  });

  it('always renders two CellRow inside CellContainer', () => {
    expect(cell().wrap(cell().find(CellContainer))
      .find(CellRow)).toHaveLength(2);
  });

  it('always renders one CellEditor inside first CellRow', () => {
    expect(cell().wrap(cell().find(CellRow).at(0))
      .find(CellEditor)).toHaveLength(1);
  });

  it('always renders one ExternalResourceOutput inside second CellRow', () => {
    expect(cell().wrap(cell().find(CellRow).at(1))
      .find(ExternalResourceOutput)).toHaveLength(1);
  });

  it("sets the CellContainer cellId prop to be the ExternalResourceCells's cellId prop", () => {
    expect(cell().find(CellContainer).props().cellId)
      .toBe(props.cellId);
  });

  it("sets the first CellRow cellId prop to be the ExternalResourceCells's cellId prop", () => {
    expect(cell().find(CellRow).at(0).props().cellId)
      .toBe(props.cellId);
  });

  it('sets the first CellRow rowType prop to be input', () => {
    expect(cell().find(CellRow).at(0).props().rowType)
      .toBe('input');
  });

  it("sets the second CellRow cellId prop to be the ExternalResourceCells's cellId prop", () => {
    expect(cell().find(CellRow).at(1).props().cellId)
      .toBe(props.cellId);
  });

  it('sets the second CellRow rowType prop to be output', () => {
    expect(cell().find(CellRow).at(1).props().rowType)
      .toBe('output');
  });

  it("sets the CellEditor cellId prop to be the ExternalResourceCells's cellId prop", () => {
    expect(cell().find(CellEditor).props().cellId)
      .toBe(props.cellId);
  });

  it("sets the ExternalResourceOutput value prop to be the ExternalResourceCells's value prop", () => {
    expect(cell().find(ExternalResourceOutput).props().value)
      .toBe(props.value);
  });
});

describe('ExternalResourceCell mapStateToProps', () => {
  const state = {
    cells: [{
      id: 5,
      value: [
        {
          src: 'http://whatever.com/cdn/a-library.js',
          status: 'loaded',
          variables: ['a', 'b', 'c'],
        },
        {
          src: 'http://whatever.com/cdn/a-stylsheet.css',
          status: 'loaded',
        },
        {
          src: 'http://whatever.com/cdn/some-other-library.js',
          status: 'error',
          statusExplanation: STANDARD_NETWORK_ERROR,
        },
        {
          src: 'http://whatever.com/cdn/some-other-stylesheet.css',
          status: 'error',
          statusExplanation: STANDARD_NETWORK_ERROR,
        },
      ],
    }],
  };

  it('should have the right number of value entries', () => {
    const ownProps = { cellId: 5 };
    expect(mapStateToProps(state, ownProps).value.length)
      .toEqual(4);
  });
});
