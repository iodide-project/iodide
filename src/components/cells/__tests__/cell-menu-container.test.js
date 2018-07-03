import React from 'react';
import { shallow } from 'enzyme';
import {
  CellMenuContainerUnconnected,
  mapStateToProps,
  mapDispatchToProps
} from '../cell-menu-container';

describe('CellMenuContainerUnconnected', () => {
  it('has default state of anchorElement as null', () => {

  })

  it('matches the snapshot if props.skipInRunAll is true', () => {

  })

  it('matches the snapshot if props.skipInRunAll is false', () => {

  })

  it('matches the snapshot if state.anchorElement is not null', () => {

  })

  it('matches the snapshot if state.anchorElement is null', () => {

  })

  describe('handleClick', () => {
    it('updates anchorElement in state with the button clicked', () => {

    })
  })

  describe('handleIconButtonClose', () => {
    it('updates anchorElement in state to null', () => {

    })
  })
})

describe('CellMenuContainerUnconnected mapStateToProps', () => {
  it('calls getCellById with the correct arguments', () => {

  })

  it('returns an object with label and skipInRunAll key value pairs', () => {

  })
})

describe('CellMenuContainerUnconnected mapDispatchToProps', () => {
  
})
