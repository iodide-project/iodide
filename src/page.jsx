import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Mousetrap from 'mousetrap'

import actions from './actions.jsx'
import {JavascriptCell, MarkdownCell, RawCell, HistoryCell, ExternalScriptCell} from './cell.jsx'
import DeclaredProperties from './declared-properties.jsx'
import keyBinding from './keybindings.jsx' 
import Title from './title.jsx'
import NotebookMenu from './notebook-menu.jsx'

const AUTOSAVE = 'AUTOSAVE: '


class Page extends React.Component {
  constructor(props) {
    super(props)
    keyBinding('jupyter', this)
    setInterval(()=>{
      // clear whatever notebook is defined w/ "AUTOSAVE " as front tag
      var notebooks = Object.keys(localStorage)
      var autos = notebooks.filter((n)=>n.includes(AUTOSAVE))

      if (autos.length) {

        autos.forEach((n)=>{
          this.props.actions.deleteNotebook(n)
        })
      }
      this.props.actions.saveNotebook(AUTOSAVE + (this.props.title == undefined ? 'new notebook' : this.props.title))
    },1000*60)
  }

  addCell() {
    this.props.actions.addCell('javascript')
  }

  render () {
    
    var bodyContent = []

    var bodyContent = this.props.cells.map((cell,i)=> {
      var cellComponent
      if (cell.cellType === 'javascript') cellComponent = <JavascriptCell display={this.props.mode!=='history'} ref={'cell'+cell.id} cell={cell} pageMode={this.props.mode} actions={this.props.actions} key={cell.id} id={cell.id} />
      if (cell.cellType === 'markdown') cellComponent = <MarkdownCell display={this.props.mode!=='history'} ref={'cell'+cell.id} cell={cell} pageMode={this.props.mode} actions={this.props.actions} key={cell.id} id={cell.id} />
      if (cell.cellType === 'raw') cellComponent = <RawCell display={this.props.mode!=='history'} ref={'cell'+cell.id} cell={cell} pageMode={this.props.mode} actions={this.props.actions} key={cell.id} id={cell.id} />
      if (cell.cellType === 'external scripts') cellComponent = <ExternalScriptCell display={this.props.mode!=='history'} ref={'cell'+cell.id} cell={cell} pageMode={this.props.mode} actions={this.props.actions} key={cell.id} id={cell.id} />
      return cellComponent
    }); 

    if (this.props.mode === 'history') {
      if (this.props.history.length) {
        bodyContent = bodyContent.concat(this.props.history.map((cell,i)=> {
          var cellComponent = <HistoryCell display={true} ref={'cell'+cell.id} actions={this.props.actions} cell={cell} id={i+'-'+cell.id} key={'history'+i} />
          return cellComponent
        }))
      } else {
        bodyContent.push(<div className='no-history'>No History</div>)
      }
    }

    var declaredPropertiesPane;
    if (Object.keys(this.props.declaredProperties).length) {
      declaredPropertiesPane = <DeclaredProperties state={this.props.declaredProperties} />
    } else {
      declaredPropertiesPane = <div></div>
    }
    //{declaredPropertiesPane} // put this in after everything else
    var pageControls
    if (this.props.mode == 'history') {
      pageControls = <div className='controls'></div>
    } else {
        pageControls = <div className='controls'>
              <i className='fa fa-plus add-cell' onClick={this.addCell.bind(this)}></i>
            </div>
    }
    return (
        <div>
          <NotebookMenu actions={this.props.actions} mode={this.props.mode} lastSaved={this.props.lastSaved} currentTitle={this.props.title} />

          <div className='page-mode'>{this.props.mode}</div>
          <div id='deselector'>
            <input ref='deselector' />
          </div>

            <Title actions={this.props.actions} title={this.props.title} pageMode={this.props.mode} />
            {pageControls}

            <div className='cells'>
            	{bodyContent}
            </div>
              
            

        </div>
    );
  }
}

function mapStateToProps(state) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)