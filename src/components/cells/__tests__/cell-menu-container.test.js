import React from 'react';
import { shallow } from 'enzyme';
import {
  CellMenuContainerUnconnected,
  mapStateToProps,
  mapDispatchToProps
} from '../cell-menu-container';

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
  it('calls getCellById with the correct arguments', () => {

  })

  it('returns an object with label and skipInRunAll key value pairs', () => {

  })
})


