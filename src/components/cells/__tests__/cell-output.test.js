import { shallow } from 'enzyme';
import React from 'react';

import { CellOutputUnconnected, mapStateToProps } from '../cell-output';
import { ValueRenderer } from '../../reps/value-renderer';

describe('CellOutputUnconnected React component', () => {
  let props;
  let mountedOutput;

  const cellOutput = () => {
    if (!mountedOutput) {
      mountedOutput = shallow(<CellOutputUnconnected {...props} />);
    }
    return mountedOutput;
  };

  beforeEach(() => {
    props = {
      render: true,
      valueToRender: 'value',
    };
    mountedOutput = undefined;
  });

  it('always renders one ValueRenderer', () => {
    expect(cellOutput().find(ValueRenderer).length).toBe(1);
  });

  it("sets the ValueRenderer render prop to be the cellOutput's render prop", () => {
    expect(cellOutput().find(ValueRenderer).props().render)
      .toBe(props.render);
  });

  it("sets the ValueRenderer valueToRender prop to be the cellOutput's valueToRender prop", () => {
    expect(cellOutput().find(ValueRenderer).props().valueToRender)
      .toBe(props.valueToRender);
  });
});

describe('CellRow mapStateToPropsCellRows', () => {
  let state;
  beforeEach(() => {
    state = {
      cells: [{
        id: 5,
        value: '<p>hello</p>',
        rendered: true,
      }],
    };
  });

  it('should return the basic info for the correct cell', () => {
    const ownProps = { cellId: 5 };
    expect(mapStateToProps(state, ownProps))
      .toEqual({
        valueToRender: '<p>hello</p>',
        render: true,
      });
  });
});
