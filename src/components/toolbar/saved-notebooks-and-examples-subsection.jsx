import React from 'react'
import NotebookMenuItem from './notebook-menu-item'
import NotebookMenuDivider from './notebook-menu-divider'
import NotebookMenuHeader from './notebook-menu-header'
import NotebookMenuSubsection from './notebook-menu-subsection'

import iodideExampleTasks from '../../iodide-examples'
import tasks, { getLocalStorageNotebook } from '../../task-definitions'
import settings from '../../settings'

const { AUTOSAVE } = settings.labels
const autosave = Object.keys(localStorage).filter(n => n.includes(AUTOSAVE))[0] //
const locallySaved = Object.keys(localStorage).filter(n => !n.includes(AUTOSAVE))

const autoSave = getLocalStorageNotebook(autosave)

const locallySavedMenuItems = locallySaved.map((l) => {
  const task = getLocalStorageNotebook(l)
  return <NotebookMenuItem task={task} key={task.title} />
})

export default class SavedNotebooksAndExamplesSubsection extends React.Component {
  render() {
    return (
      <NotebookMenuSubsection title="notebooks ... " >
        <NotebookMenuHeader key="autosave" title="Auto-Saved" />
        <NotebookMenuItem task={autoSave} key={autoSave.title} />
        <NotebookMenuDivider key="autosave-divider" />
        <NotebookMenuHeader key="local storage" title="Locally Saved Notebooks" />
        {locallySavedMenuItems}
        <NotebookMenuDivider key="locals-divider" />
        <NotebookMenuHeader key="examples" title="Example Notebooks" />
        {iodideExampleTasks.map(e => <NotebookMenuItem key={e.title} task={e} />)}
        <NotebookMenuDivider key="examples-divider" />
        <NotebookMenuItem key={tasks.seeAllExamples.title} task={tasks.seeAllExamples} />
      </NotebookMenuSubsection>
    )
  }
}
