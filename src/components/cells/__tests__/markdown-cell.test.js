import { shallow } from 'enzyme';
import React from 'react';

import { MarkdownCellUnconnected, mapStateToProps } from '../markdown-cell';
import CellEditor from '../cell-editor';
import CellRow from '../cell-row';
import { CellContainer } from '../cell-container';

describe('MarkdownCell_unconnected react component', () => {
  let props;
  let mountedCell;
  let markCellNotRendered;
  let changeMode;

  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(<MarkdownCellUnconnected {...props} />);
    }
    return mountedCell;
  };

  beforeEach(() => {
    markCellNotRendered = jest.fn();
    changeMode = jest.fn();
    props = {
      cellId: 1,
      value: 'a _markdown_ string',
      showMarkdown: true,
      viewMode: 'editor',
      actions: { markCellNotRendered, changeMode },
    };
    mountedCell = undefined;
  });

  it('always renders one CellContainer', () => {
    expect(cell().find(CellContainer).length).toBe(1);
  });

  it("sets the CellContainer cellId prop to be the MarkdownCell's cellId prop", () => {
    expect(cell().find(CellContainer).props().cellId)
      .toBe(props.cellId);
  });

  it('the CellContainer should have two CellRow', () => {
    expect(cell().wrap(cell().find(CellContainer))
      .find(CellRow)).toHaveLength(2);
  });

  it("sets the first CellRow cellId prop to be the MarkdownCell's cellId prop", () => {
    expect(cell().find(CellRow).at(0).props().cellId)
      .toBe(props.cellId);
  });

  it('sets the first CellRow rowType prop to be input', () => {
    expect(cell().find(CellRow).at(0).props().rowType)
      .toBe('input');
  });

  it('sets the second CellRow rowType prop to be output', () => {
    expect(cell().find(CellRow).at(1).props().rowType)
      .toBe('output');
  });

  it("sets the second CellRow cellId prop to be the MarkdownCell's cellId prop", () => {
    expect(cell().find(CellRow).at(1).props().cellId)
      .toBe(props.cellId);
  });

  it('the first CellRow always has a child that is a CellEditor', () => {
    expect(cell().wrap(cell().find(CellRow).at(0)
      .props().children).find(CellEditor)).toHaveLength(1);
  });


  it('the second CellRow always has a child that is is a div', () => {
    expect(cell().wrap(cell().find(CellRow).at(1)
      .props().children).find('div')).toHaveLength(1);
  });

  it('correct display styles set if showMarkdown===true', () => {
    props.showMarkdown = true;
    expect(cell().wrap(cell().find(CellEditor)).props().containerStyle)
      .toEqual({ display: 'none' });

    expect(cell().wrap(cell().find('div')).props().style)
      .toEqual({ display: 'block' });
  });

  it('correct display styles set if showMarkdown===false', () => {
    props.showMarkdown = false;
    expect(cell().wrap(cell().find(CellEditor)).props().containerStyle)
      .toEqual({ display: 'block' });

    expect(cell().wrap(cell().find('div')).props().style)
      .toEqual({ display: 'none' });
  });

  it('div should have dangerouslySetInnerHTML', () => {
    props.value = 'html string';
    expect(cell().wrap(cell().find('div')).props().dangerouslySetInnerHTML)
      .toEqual({ __html: props.value });
  });

  it('both the output recieves enterEditMode() as props', () => {
    expect(cell().wrap(cell().find('div')).props().onDoubleClick)
      .toEqual(cell().instance().enterEditMode);
  });

  it('dblclick on MD div fires markCellNotRendered AND changeMode', () => {
    props.showMarkdown = true;
    props.viewMode = 'editor';
    cell().find('div').simulate('dblclick');
    expect(cell().wrap(cell().find('div')).props().style)
      .toEqual({ display: 'block' });
    expect(changeMode.mock.calls.length).toBe(1);
    expect(markCellNotRendered.mock.calls.length).toBe(1);
  });

  it('click on editor fires no actions', () => {
    props.showMarkdown = false;
    props.viewMode = 'editor';
    cell().find(CellEditor).simulate('containerClick');
    expect(cell().wrap(cell().find(CellEditor)).props().containerStyle)
      .toEqual({ display: 'block' });
    expect(markCellNotRendered.mock.calls.length).toBe(0);
    expect(changeMode.mock.calls.length).toBe(0);
  });
});


describe('MarkdownCell mapStateToProps', () => {
  let state;

  const markdownShownVariants = [
    { selected: true, mode: 'not_edit', rendered: true },
    { selected: false, mode: 'edit', rendered: true },
    { selected: false, mode: 'not_edit', rendered: true },
  ];

  const markdownNotShownVariants = [
    { selected: true, mode: 'edit', rendered: true },

    { selected: true, mode: 'edit', rendered: false },
    { selected: true, mode: 'not_edit', rendered: false },
    { selected: false, mode: 'edit', rendered: false },
    { selected: false, mode: 'not_edit', rendered: false },
  ];

  beforeEach(() => {
    state = {
      cells: [{
        id: 5,
        value: '#MD string',
        rendered: true,
        selected: true,
      },
      ],
      mode: 'edit',
      viewMode: 'presentation',
    };
  });

  it('should return the basic info for the correct cell', () => {
    const ownProps = { cellId: 5 };
    expect(mapStateToProps(state, ownProps))
      .toEqual({
        value: '#MD string',
        showMarkdown: false,
        viewMode: 'presentation',
      });
  });

  markdownShownVariants.forEach((stateMods) => {
    it(`should have showMarkdown:true for ${JSON.stringify(stateMods)}`, () => {
      state.cells[0].rendered = stateMods.rendered;
      state.cells[0].selected = stateMods.selected;
      state.mode = stateMods.mode;
      const ownProps = { cellId: 5 };
      expect(mapStateToProps(state, ownProps))
        .toEqual({
          value: '#MD string',
          showMarkdown: true,
          viewMode: 'presentation',
        });
    });
  });
  markdownNotShownVariants.forEach((stateMods) => {
    it(`should have showMarkdown:false for ${JSON.stringify(stateMods)}`, () => {
      state.cells[0].rendered = stateMods.rendered;
      state.cells[0].selected = stateMods.selected;
      state.mode = stateMods.mode;
      const ownProps = { cellId: 5 };
      expect(mapStateToProps(state, ownProps))
        .toEqual({
          value: '#MD string',
          showMarkdown: false,
          viewMode: 'presentation',
        });
    });
  });
});
