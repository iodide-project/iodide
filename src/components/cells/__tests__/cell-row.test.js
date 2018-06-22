import { shallow } from 'enzyme';
import React from 'react';
import ReactDOM from 'react-dom';

import Tooltip from 'material-ui/Tooltip';

import { CellRowUnconnected, mapStateToPropsCellRows } from '../cell-row';

describe('CellRowUnconnected React component', () => {
  let setCellRowCollapsedState;
  let props;
  let mountedRow;
  const node = <span>Hello</span>;

  const cellRow = () => {
    if (!mountedRow) {
      mountedRow = shallow(<CellRowUnconnected {...props}>{node}</CellRowUnconnected>);
    }
    return mountedRow;
  };

  beforeEach(() => {
    setCellRowCollapsedState = jest.fn();
    props = {
      selected: true,
      rowOverflow: 'VISIBLE',
      editingCell: true,
      viewMode: 'editor',
      rowType: 'input',
      uncollapseOnUpdate: false,
      collapseTooltipPlacement: 'top',
      tooltipText: 'text',
      actions: { setCellRowCollapsedState },
    };
    mountedRow = undefined;
  });

  it('always renders three div', () => {
    expect(cellRow().find('div').length).toBe(3);
  });

  it('sets the top div to have correct class', () => {
    expect(cellRow().find('div').at(0).props().className)
      .toBe('cell-row input VISIBLE');
  });

  it('always renders two children inside top div', () => {
    expect(cellRow().find('div').at(0).children()
      .length).toBe(2);
  });

  it('always renders one Tooltip component inside top div', () => {
    expect(cellRow().wrap(cellRow().find('div').at(0))
      .find(Tooltip)).toHaveLength(1);
  });

  it('always renders one div component with class collapse-button inside Tooltip', () => {
    expect(cellRow().wrap(cellRow().find(Tooltip))
      .find('div.collapse-button')).toHaveLength(1);
  });

  it('sets the onClick prop to handleCollapseButtonClick', () => {
    expect(cellRow().find('div.collapse-button').props().onClick)
      .toEqual(cellRow().instance().handleCollapseButtonClick);
  });

  it('click on cell collapse-button div with correct props fires setCellRowCollapsedState', () => {
    props.viewMode = 'editor';
    cellRow().find('div.collapse-button').simulate('click');
    expect(setCellRowCollapsedState.mock.calls.length).toBe(1);
    expect(setCellRowCollapsedState.mock.calls[0].length).toBe(3);
  });

  it('click on cell collapse-button div with incorrect props does not fire setCellRowCollapsedState', () => {
    props.viewMode = 'presentation';
    cellRow().find('div.collapse-button').simulate('click');
    expect(setCellRowCollapsedState.mock.calls.length).toBe(0);
  });

  it('always renders one children inside Tooltip', () => {
    expect(cellRow().find(Tooltip).children()
      .length).toBe(1);
  });

  it("sets the Tooltip placement prop to be Cell Row's collapseTooltipPlacement prop", () => {
    expect(cellRow().find(Tooltip).props().placement)
      .toBe(props.collapseTooltipPlacement);
  });

  it("sets the Tooltip title prop to be Cell Row's tooltipText prop", () => {
    expect(cellRow().find(Tooltip).props().title)
      .toBe(props.tooltipText);
  });

  it('always renders one div component with class main-component inside top div', () => {
    expect(cellRow().wrap(cellRow().find('div').at(0))
      .find('div.main-component')).toHaveLength(1);
  });

  it('always has a children inside the div with class main-component', () => {
    expect(cellRow().find('div.main-component')
      .props().children).toEqual(node);
  });

  it('fires setCellRowCollapsedState when component updates with correct props', () => {
    const nodes = document.createElement('div');
    ReactDOM.render(<CellRowUnconnected {...props} />, nodes);
    props.uncollapseOnUpdate = true;
    ReactDOM.render(<CellRowUnconnected {...props} />, nodes);
    expect(setCellRowCollapsedState.mock.calls.length).toBe(1);
  });

  it('does not fire setCellRowCollapsedState when component updates with wrong props', () => {
    const nodes = document.createElement('div');
    ReactDOM.render(<CellRowUnconnected {...props} />, nodes);
    props.uncollapseOnUpdate = false;
    ReactDOM.render(<CellRowUnconnected {...props} />, nodes);
    expect(setCellRowCollapsedState.mock.calls.length).toBe(0);
  });
});


describe('CellRow mapStateToPropsCellRows', () => {
  let state;
  const rowSettingsObject = {
    EXPLORE: {
      input: 'VISIBLE',
      sideeffect: 'VISIBLE',
      output: 'VISIBLE',
    },
    REPORT: {
      input: 'HIDDEN',
      sideeffect: 'VISIBLE',
      output: 'HIDDEN',
    },
  };
  beforeEach(() => {
    state = {
      cells: [{
        id: 5,
        selected: true,
        cellType: 'code',
        executionStatus: ' ',
        rowSettings: rowSettingsObject,
      },
      ],
      mode: 'edit',
      viewMode: 'editor',
    };
  });

  it('should return the basic info for the correct cell', () => {
    const ownProps = { cellId: 5, rowType: 'input' };
    expect(mapStateToPropsCellRows(state, ownProps))
      .toEqual({
        cellId: 5,
        viewMode: 'editor',
        uncollapseOnUpdate: false,
        executionString: '[ ]',
        rowOverflow: 'VISIBLE',
        collapseTooltipPlacement: 'right',
        tooltipText: 'click to scroll this input',
      });
  });

  it('should return the correct info with viewMode===presentation', () => {
    const ownProps = { cellId: 5, rowType: 'input' };
    state.viewMode = 'presentation';
    expect(mapStateToPropsCellRows(state, ownProps))
      .toEqual({
        cellId: 5,
        viewMode: 'presentation',
        uncollapseOnUpdate: false,
        executionString: '[ ]',
        rowOverflow: 'HIDDEN',
        collapseTooltipPlacement: 'bottom',
        tooltipText: 'click to expand this input',
      });
  });

  it('should return the correct info with rowType!==input', () => {
    const ownProps = { cellId: 5, rowType: 'output' };
    expect(mapStateToPropsCellRows(state, ownProps))
      .toEqual({
        cellId: 5,
        viewMode: 'editor',
        uncollapseOnUpdate: false,
        executionString: '',
        rowOverflow: 'VISIBLE',
        collapseTooltipPlacement: 'right',
        tooltipText: 'click to scroll this output',
      });
  });

  it('should return the correct info with cellType!==code', () => {
    const ownProps = { cellId: 5, rowType: 'input' };
    state.cells[0].cellType = 'css';
    expect(mapStateToPropsCellRows(state, ownProps))
      .toEqual({
        cellId: 5,
        viewMode: 'editor',
        uncollapseOnUpdate: false,
        executionString: '',
        rowOverflow: 'VISIBLE',
        collapseTooltipPlacement: 'right',
        tooltipText: 'click to scroll this input',
      });
  });

  it('should throw error with message Unsupported viewMode for wrong vieMode', () => {
    const ownProps = { cellId: 5, rowType: 'input' };
    state.viewMode = 'display';
    try {
      mapStateToPropsCellRows(state, ownProps);
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toBe('Unsupported viewMode: display');
    }
  });
});
