import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Mousetrap from 'mousetrap'

import actions from './actions.jsx'
import Cell from './cell.jsx'
import DeclaredProperties from './declared-properties.jsx'
import keyBinding from './keybindings.jsx' 



class Page extends React.Component {
  constructor(props) {
    super(props)
    keyBinding('jupyter', this)
    // TODO: this is messy and could use refactoring.

  }

  addCell() {
    this.props.actions.addCell('javascript');
  }

  render () {
    var cells = this.props.cells.map((cell,i)=> {
      return <Cell ref={'cell'+cell.id} cell={cell} pageMode={this.props.mode} actions={this.props.actions} key={cell.id} id={cell.id} />
    });
    var declaredPropertiesPane;
    if (Object.keys(this.props.declaredProperties).length) {
      declaredPropertiesPane = <DeclaredProperties state={this.props.declaredProperties} />
    } else {
      declaredPropertiesPane = <div></div>
    }

    return (
        <div>
        <div id='deselector'>
          <input ref='deselector' />
        </div>
          <h1 ref='pageTitle' className='page-title'>Javascript Notebook <span>{this.props.mode}</span></h1>
          <div className='controls'>
          	<button ref='addCellButton' onClick={this.addCell.bind(this)}> + </button>
          </div>

          <div className='cells'>
          	{cells}
          </div>
            
          {declaredPropertiesPane}

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