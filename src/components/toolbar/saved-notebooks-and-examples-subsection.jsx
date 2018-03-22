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
    let autoSaveMenuItems
    if (this.props.autoSave) {
      const autoSave = getLocalStorageNotebook(this.props.autoSave)
      autoSaveMenuItems = (
        <div> {/* // FIXME: use React 16 fragments instead of useless container div */}
          <NotebookMenuHeader key="autosave" title="Auto-Saved" />
          <NotebookMenuItem task={autoSave} key={autoSave.title} />
          <NotebookMenuDivider key="autosave-divider" />
        </div>
      )
    }

    let locallySavedMenuItems
    if (this.props.locallySaved.length > 0) {
      this.props.locallySaved.sort((a, b) => {
        const p = (_) => {
          let ls = localStorage.getItem(_)
          if (!ls) return -1
          ls = stateFromJsmd(ls)
          return Date.parse(ls.lastSaved)
        }
        return p(b) - p(a)
      })

      locallySavedMenuItems = (
        <div> {/* // FIXME: use React 16 fragments instead of useless container div */}
          <NotebookMenuHeader key="local storage" title="Locally Saved Notebooks" />
          {
            this.props.locallySaved.map((l) => {
              const task = getLocalStorageNotebook(l)
              if (task !== undefined) {
                return (<NotebookMenuItem task={task} key={task.title} />)
              }
              return undefined
            })
          }
          <NotebookMenuDivider key="locals-divider" />
        </div>
      )
    }

    return (
      <NotebookMenuSubsection title="notebooks ... " {...this.props} >
        {autoSaveMenuItems}
        {locallySavedMenuItems}
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
