import React from 'react';
import { shallow } from 'enzyme';
import {
  CellMenuContainerUnconnected,
  mapStateToProps,
  mapDispatchToProps
} from '../cell-menu-container';

import * as notebookUtils from '../../../tools/notebook-utils'

describe('CellMenuContainerUnconnected', () => {
  let props;

  beforeEach(() => {
    props = {
      label: 'md',
      cellId: 0,
      skipInRunAll: false 
    } 
  })

  it('has default state of anchorElement as null', () => {
    const mountedMenuContainer = shallow(<CellMenuContainerUnconnected { ...props } />);

    expect(mountedMenuContainer.state('anchorElement')).toEqual(null);
  })

  it('matches the snapshot if props.skipInRunAll is false and anchorElement is null', () => {
    const mountedMenuContainer = shallow(<CellMenuContainerUnconnected { ...props } />);

    expect(mountedMenuContainer).toMatchSnapshot();
  })

  it('matches the snapshot if props.skipInRunAll is true', () => {
    props.skipInRunAll = true;
    const mountedMenuContainer = shallow(<CellMenuContainerUnconnected { ...props } />);

    expect(mountedMenuContainer).toMatchSnapshot();
  })

  it('matches the snapshot if state.anchorElement is not null', () => {
    const mountedMenuContainer = shallow(<CellMenuContainerUnconnected { ...props } />);
    mountedMenuContainer.setState({ anchorElement: 'not null' })
    mountedMenuContainer.update();

    expect(mountedMenuContainer).toMatchSnapshot(); 
  })

  describe('handleClick', () => {
    it('updates anchorElement in state with the currentTarget of the clicked element', () => {
      const mountedMenuContainer = shallow(<CellMenuContainerUnconnected { ...props } />);

      mountedMenuContainer.find('.cell-type-label').simulate('click', { currentTarget: 'a target' });

      expect(mountedMenuContainer.state('anchorElement')).toEqual('a target');
    })
  })

  describe('handleIconButtonClose', () => {
    it('updates anchorElement in state to null', () => {
      const mountedMenuContainer = shallow(<CellMenuContainerUnconnected { ...props } />);
      
      mountedMenuContainer.find('#cell-menu').simulate('close');

      expect(mountedMenuContainer.state('anchorElement')).toBeNull();
    })
  })
})

describe('CellMenuContainerUnconnected mapStateToProps', () => {
  let state;
  let ownProps;

  beforeEach(() => {
    state = {
      cells: [{ 
        asyncProcessCount: 0,
        cellType: "code",
        content: "",
        evalStatus: "UNEVALUATED",
        executionStatus: " ",
        id: 0,
        language: "js",
        rendered: false,
        selected: true,
        skipInRunAll: false,
        value: undefined
      }],
      title: 'untitled'
    };   
    ownProps = { cellId: 0 };
    notebookUtils.getCellById = jest.fn().mockImplementation(() => state.cells[0]);    
  })
  
  it('calls getCellById with the correct arguments', () => {
    mapStateToProps(state, ownProps);

    expect(notebookUtils.getCellById).toHaveBeenCalledWith(state.cells, ownProps.cellId);
  })

  it('returns an object with correct label and skipInRunAll key value pairs if cellType is "code"', () => {
    const expected = {
      label: 'js',
      skipInRunAll: false
    };
    const result = mapStateToProps(state, ownProps);

    expect(result).toEqual(expected);
  })

  it('returns an object with correct label and skipInRunAll key value pairs if cellType is "markdown"', () => {
    state.cells[0].cellType = 'markdown'; 
    const expected = {
      label: 'md',
      skipInRunAll: false
    };
    const result = mapStateToProps(state, ownProps);

    expect(result).toEqual(expected);
  })

  it('returns an object with correct label and skipInRunAll key value pairs if cellType is "css"', () => {
    state.cells[0].cellType = 'css'; 
    const expected = {
      label: 'css',
      skipInRunAll: false
    };
    const result = mapStateToProps(state, ownProps);

    expect(result).toEqual(expected);
  })

  it('returns an object with correct label and skipInRunAll key value pairs if cellType is "plugin"', () => {
    state.cells[0].cellType = 'plugin'; 
    const expected = {
      label: 'plugin',
      skipInRunAll: false
    };
    const result = mapStateToProps(state, ownProps);

    expect(result).toEqual(expected);
  })

  it('returns an object with correct label and skipInRunAll key value pairs if cellType is "external dependencies"', () => {
    state.cells[0].cellType = 'external dependencies'; 
    const expected = {
      label: 'resource',
      skipInRunAll: false
    };
    const result = mapStateToProps(state, ownProps);

    expect(result).toEqual(expected);
  })

  it('returns an object with correct label and skipInRunAll key value pairs if cellType is "raw"', () => {
    state.cells[0].cellType = 'raw'; 
    const expected = {
      label: 'raw',
      skipInRunAll: false
    };
    const result = mapStateToProps(state, ownProps);

    expect(result).toEqual(expected);
  })

})

describe('mapDispatchToProps', () => {
  it('returns an object with actions as a property', () => {
    const dispatch = jest.fn();
    const actions = {};
    const result = mapDispatchToProps(dispatch);

    expect(result).toHaveProperty('actions');
  })
})
