import React from 'react'
import { shallow } from 'enzyme'

import IconButton from 'material-ui/IconButton'

import NotebookTaskButton from '../src/components/toolbar/notebook-task-button'
import UserTask from '../src/user-task'

describe('NotebookTaskButton gives one Button', () => {
  const nbTask = shallow(<NotebookTaskButton task={new UserTask({ title: 'ok', callback: () => {}, secondaryText: 'neat' })}>ok</NotebookTaskButton>)
  it('renders one NotebookTaskButton which contains an IconButton', () => {
    expect(nbTask.find(IconButton).length).toBe(1)
    expect(nbTask.props().children).toBe('ok')
  })
})
