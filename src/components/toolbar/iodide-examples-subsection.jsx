import React from 'react'
import NotebookMenuItem from './notebook-menu-item'
import NotebookMenuDivider from './notebook-menu-divider'
import NotebookMenuHeader from './notebook-menu-header'

import iodideExampleTasks from '../../iodide-examples'
import tasks from '../../task-definitions'

const ioE = iodideExampleTasks.map(e => <NotebookMenuItem key={e.title} task={e} />)

export default [
  <NotebookMenuHeader title="examples" />,
  ...ioE,
  <NotebookMenuDivider />,
  <NotebookMenuItem key={tasks.seeAllExamples.title} task={tasks.seeAllExamples} />,
]
