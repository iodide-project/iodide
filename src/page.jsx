import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Mousetrap from 'mousetrap'

import actions from './actions.jsx'
import Cell from './cell.jsx'
import DeclaredProperties from './declared-properties.jsx'
import keyBinding from './keybindings.jsx' 
import Title from './title.jsx'
import NotebookActions from './notebook-actions.jsx'

class Page extends React.Component {
  constructor(props) {
    super(props)
    keyBinding('jupyter', this)
  }

  addCell() {
    this.props.actions.addCell('javascript')
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
    //{declaredPropertiesPane} // put this in after everything else
    return (
        <div>
        <NotebookActions actions={this.props.actions} lastSaved={this.props.lastSaved} />
        <div id='deselector'>
          <input ref='deselector' />
        </div>
          <Title actions={this.props.actions} title={this.props.title} pageMode={this.props.mode} />
          <div className='controls'>
          	<i className='fa fa-plus add-cell' onClick={this.addCell.bind(this)}></i>
          </div>

          <div className='cells'>
          	{cells}
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