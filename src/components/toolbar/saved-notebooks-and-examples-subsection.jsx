import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import NotebookMenuItem from './notebook-menu-item'
import NotebookMenuDivider from './notebook-menu-divider'
import NotebookMenuHeader from './notebook-menu-header'
import NotebookMenuSubsection from './notebook-menu-subsection'


import iodideExampleTasks from '../../iodide-examples'
import tasks, { getLocalStorageNotebook } from '../../task-definitions'
import { stateFromJsmd } from '../../jsmd-tools'


class SavedNotebooksAndExamplesSubsection extends React.Component {
  static propTypes = {
    locallySaved: PropTypes.array,
    autoSave: PropTypes.string,
  }

  render() {
    let autoSaveMenuItem
    let autoSave
    let locallySavedMenuItems

    if (this.props.autoSave) {
      autoSave = getLocalStorageNotebook(this.props.autoSave)
      autoSaveMenuItem = <NotebookMenuItem task={autoSave} key={autoSave.title} />
    }

    if (this.props.locallySaved) {
      this.props.locallySaved.sort((a, b) => {
        const p = (_) => {
          let ls = localStorage.getItem(_)
          if (!ls) return -1
          ls = stateFromJsmd(ls)
          return Date.parse(ls.lastSaved)
        }
        return p(b) - p(a)
      })

      if (this.props.locallySaved.length) {
        locallySavedMenuItems = this.props.locallySaved.map((l) => {
          const task = getLocalStorageNotebook(l)
          if (task !== undefined) {
            return <NotebookMenuItem task={task} key={task.title} />
          }
          return undefined
        })
      }
    }

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

function mapStateToProps(state) {
  return {
    locallySaved: state.locallySaved,
    autoSave: state.autoSave,
  }
}

export default connect(mapStateToProps)(SavedNotebooksAndExamplesSubsection)
