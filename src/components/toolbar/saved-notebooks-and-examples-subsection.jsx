import React from 'react'
import NotebookMenuItem from './notebook-menu-item'
import NotebookMenuDivider from './notebook-menu-divider'
import NotebookMenuHeader from './notebook-menu-header'
import NotebookMenuSubsection from './notebook-menu-subsection'

import iodideExampleTasks from '../../iodide-examples'
import tasks, { getLocalStorageNotebook } from '../../task-definitions'
import { stateFromJsmd } from '../../jsmd-tools'

const AUTOSAVE = 'AUTOSAVE: '
const autosave = Object.keys(localStorage).filter(n => n.includes(AUTOSAVE))[0] //
const locallySaved = Object.keys(localStorage).filter(n => !n.includes(AUTOSAVE))

let autoSaveMenuItem
let autoSave
if (autosave !== undefined) {
  autoSave = getLocalStorageNotebook(autosave)
  autoSaveMenuItem = <NotebookMenuItem task={autoSave} key={autoSave.title} />
}

locallySaved.sort((a, b) => {
  const p = (_) => {
    let ls = localStorage.getItem(_)
    if (!ls) return -1
    ls = stateFromJsmd(ls)
    return Date.parse(ls.lastSaved)
  }
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
      <NotebookMenuSubsection title="notebooks ... " {...this.props} >
        {autoSaveMenuItem ? <NotebookMenuHeader key="autosave" title="Auto-Saved" /> : undefined}
        {autoSaveMenuItem || undefined}
        {autoSaveMenuItem ? <NotebookMenuDivider key="autosave-divider" /> : undefined }
        {locallySavedMenuItems ? <NotebookMenuHeader key="local storage" title="Locally Saved Notebooks" /> : undefined }
        {locallySavedMenuItems || undefined}
        {locallySavedMenuItems ? <NotebookMenuDivider key="locals-divider" /> : undefined }
        <NotebookMenuHeader key="examples" title="Example Notebooks" />
        {iodideExampleTasks.map(e => <NotebookMenuItem key={e.title} task={e} />)}
        <NotebookMenuDivider key="examples-divider" />
        <NotebookMenuItem key={tasks.seeAllExamples.title} task={tasks.seeAllExamples} />
      </NotebookMenuSubsection>
    )
  }
}
