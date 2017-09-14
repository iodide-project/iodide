import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Mousetrap from 'mousetrap'

import actions from './actions.jsx'
import {JavascriptCell, MarkdownCell, RawCell, HistoryCell} from './cell.jsx'
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
    
    var bodyContent

    if (this.props.mode === 'history') {
      if (this.props.history.length) {
        var bodyContent = this.props.history.map((cell,i)=> {
          var cellComponent = <HistoryCell ref={'cell'+cell.id} actions={this.props.actions} cell={cell} id={cell.id} key={i} />
          return cellComponent
        })
      } else {
        bodyContent = <div className='no-history'>No History</div>
      }

    } else {
      var bodyContent = this.props.cells.map((cell,i)=> {
        var cellComponent
        if (cell.cellType === 'javascript') cellComponent = <JavascriptCell ref={'cell'+cell.id} cell={cell} pageMode={this.props.mode} actions={this.props.actions} key={cell.id} id={cell.id} />
        if (cell.cellType === 'markdown') cellComponent = <MarkdownCell ref={'cell'+cell.id} cell={cell} pageMode={this.props.mode} actions={this.props.actions} key={cell.id} id={cell.id} />
        if (cell.cellType === 'raw') cellComponent = <RawCell ref={'cell'+cell.id} cell={cell} pageMode={this.props.mode} actions={this.props.actions} key={cell.id} id={cell.id} />
        return cellComponent
      });  
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