import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import deepEqual from 'deep-equal'


import {JavascriptCell, MarkdownCell,
  RawCell, DOMCell,
  ExternalDependencyCell, CSSCell} from './cell.jsx'

import {JsCell} from './cell2.jsx'

import { NotebookHeader } from './notebook-header.jsx'

import settings from '../settings.js'
import { prettyDate} from '../notebook-utils.js'
import keyBinding from '../keybindings.js'
import actions from '../actions.js'


const AUTOSAVE = settings.labels.AUTOSAVE

class Page extends React.Component {
  constructor(props) {
    super(props)
    // this.props.actions.newNotebook()
    this.enterCommandModeOnClickOutOfCell = this.enterCommandModeOnClickOutOfCell.bind(this)

    keyBinding('jupyter', this)
    setInterval(()=>{
      // clear whatever notebook is defined w/ "AUTOSAVE " as front tag
      let notebooks = Object.keys(localStorage)
      let autos = notebooks.filter((n)=>n.includes(AUTOSAVE))
      if (autos.length) {
        autos.forEach((n)=>{
          this.props.actions.deleteNotebook(n)
        })
      }
      this.props.actions.saveNotebook(AUTOSAVE + (this.props.title == undefined ? 'new notebook' : this.props.title), true)
    },1000*60)
  }

  enterCommandModeOnClickOutOfCell(e) {
    //check whther the click is (1) directly in div#cells (2) in any element contained in the notebook header
    if (e.target.id.includes('cells') ||
        document.querySelector('.notebook-header').contains(e.target)) {
      if (this.props.mode != 'command') this.props.actions.changeMode('command')
    }
  }

  componentWillReceiveProps(nextProps){
  }

  componentDidUpdate(prevProps, prevState){
  }

  shouldComponentUpdate(nextProps, nextState){
    return !deepEqual(this.props,nextProps)
  }

  render () {
    let bodyContent = this.props.cellIds.map( (id,i) => {
      // let id = cell.id
      switch (this.props.cellTypes[i]){
      case 'javascript':
        return <JavascriptCell cellId={id} key={id}/> 
      case 'markdown':
        return <MarkdownCell cellId={id} key={id}/>
      case 'raw':
        return <RawCell cellId={id} key={id}/>
      case 'external dependencies':
        return <ExternalDependencyCell cellId={id} key={id} />
      case 'css':
        return <CSSCell cellId={id} key={id} />
      case 'dom':
        return <DOMCell cellId={id} key={id}/>
      }
    })

    return (
      <div id="notebook-container"
        className={this.props.viewMode==='presentation' ? 'presentation-mode' : ''}
        onMouseDown={this.enterCommandModeOnClickOutOfCell}>
        <NotebookHeader />
        <div id='cells' className={this.props.viewMode}>
          {bodyContent}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  // FIXME: don't pass full state
  // re cells: only pass list of cell ids
  // return state
  return {
    mode: state.mode,
    cellIds: state.cells.map(c => c.id),
    cellTypes: state.cells.map(c => c.cellType),
    viewMode: state.viewMode,
    title: state.title
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Page)