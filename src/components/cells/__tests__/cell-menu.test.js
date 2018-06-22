import { shallow } from 'enzyme';
import React from 'react';

import { CellMenuUnconnected, mapStateToProps } from '../cell-menu';
import NotebookMenuItem from '../../menu/notebook-menu-item';
import NotebookMenuDivider from '../../menu/notebook-menu-divider';

describe('CellMenuUnconnected React component', () => {
  let props;
  let mountedMenu;

  const cellMenu = () => {
    if (!mountedMenu) {
      mountedMenu = shallow(<CellMenuUnconnected {...props} />);
    }
    return mountedMenu;
  };

  beforeEach(() => {
    props = {
      menuLabel: 'css',
      cellId: 5,
      skipInRunAll: false,
    };
    mountedMenu = undefined;
  });

  it('always renders one div', () => {
    expect(cellMenu().find('div').length).toBe(1);
  });

  it('sets the div to have class cell-menu-items-containe', () => {
    expect(cellMenu().find('div').props().className)
      .toBe('cell-menu-items-container');
  });

  it('always renders seven NotebookMenuItem', () => {
    expect(cellMenu().find(NotebookMenuItem).length).toBe(7);
  });

  it('always renders one NotebookMenuDivider', () => {
    expect(cellMenu().find(NotebookMenuDivider).length).toBe(1);
  });

  const cellTypes = ['js', 'md', 'css', 'resource', 'raw', 'plugin'];

  cellTypes.forEach((cellType, i) => {
    it(`sets the NotebookMenuItem disabled prop to be correct for option ${cellType}`, () => {
      expect(cellMenu().find(NotebookMenuItem).at(i).props().disabled)
        .toBe(props.menuLabel === cellType);
    });
  });
});

describe('cellMenu mapStateToProps', () => {
  let state;
  beforeEach(() => {
    state = {
      cells: [{
        id: 5,
        skipInRunAll: false,
      }],
    };
  });

  it('should return the basic info for the correct cell', () => {
    const ownProps = { cellId: 5 };
    expect(mapStateToProps(state, ownProps))
      .toEqual({
        skipInRunAll: false,
      });
  });
});
