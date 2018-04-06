import React from 'react'
import { shallow } from 'enzyme'

import MenuItem from 'material-ui/Menu/MenuItem'
import Menu from 'material-ui/Menu/Menu'

import NotebookMenuSubsection from '../notebook-menu-subsection'
import NotebookMenuItem from '..//notebook-menu-item'
import UserTask from '../../../actions/user-task'

describe('barebones NotebookMenuSubsection', () => {
  const nbSubsection = shallow(<NotebookMenuSubsection />)
  it('has a MenuItem as a top-level child', () => {
    expect(nbSubsection.find(MenuItem)).toHaveLength(1)
    expect(nbSubsection.find(Menu)).toHaveLength(1)
  })
})

describe('A nested NotebookMenuSubsection', () => {
  // create a single nbmss with a single menu item in it.
  // test presence of nested menu item.
  // test click events for inner elment and propagation upward
  // let innerSentinel = false
  // let outerSentinel = false
  const outerClick = () => undefined /* outerSentinel = true */
  const nbSubsection = shallow((
    <NotebookMenuSubsection onClick={outerClick}>
      <NotebookMenuItem task={new UserTask({
        title: 'ok',
        callback: () => { console.log('wow!'); /* innerSentinel = true }, */ },
})}
      />
    </NotebookMenuSubsection>
  ))
  it('should contain more than one NotebookMenuItem now', () => {
    expect(nbSubsection.find(NotebookMenuItem)).toHaveLength(1)
  })
  // .simulate actually really struggles to simulate the click.
  // We're not creating the right elements here.
  // it('should propagate the click events upward', () => {
  //   nbSubsection.simulate('click')
  //   nbSubsection.children().find(NotebookMenuItem).simulate('click')
  //   expect(innerSentinel).toBe(true)
  //   expect(outerSentinel).toBe(true)
  // })
})
