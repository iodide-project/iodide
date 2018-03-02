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
let autoSaveMenuItem
let autoSave
if (autosave !== undefined) {
  autoSave = getLocalStorageNotebook(autosave)
  autoSaveMenuItem = <NotebookMenuItem task={autoSave} key={autoSave.title} />
}

locallySaved.sort((a, b) => {
  const p = _ => Date.parse(JSON.parse(localStorage[_]).lastSaved)
  return p(b) - p(a)
})

let locallySavedMenuItems
if (locallySaved.length) {
  locallySavedMenuItems = locallySaved.map((l) => {
    const task = getLocalStorageNotebook(l)
    if (task !== undefined) {
      return <NotebookMenuItem task={task} key={task.title} />
    }
    return undefined
  })
}

export default class SavedNotebooksAndExamplesSubsection extends React.Component {
  render() {
    return (
      <NotebookMenuSubsection onClick={this.props.onClick} title="notebooks ... " >
        <NotebookMenuHeader key="autosave" title="Auto-Saved" />
        {autoSaveMenuItem || undefined}
        <NotebookMenuDivider key="autosave-divider" />
        <NotebookMenuHeader key="local storage" title="Locally Saved Notebooks" />
        {locallySavedMenuItems || undefined}
        <NotebookMenuDivider key="locals-divider" />
        <NotebookMenuHeader key="examples" title="Example Notebooks" />
        {iodideExampleTasks.map(e => <NotebookMenuItem key={e.title} task={e} />)}
        <NotebookMenuDivider key="examples-divider" />
        <NotebookMenuItem key={tasks.seeAllExamples.title} task={tasks.seeAllExamples} />
      </NotebookMenuSubsection>
    )
  }
}
