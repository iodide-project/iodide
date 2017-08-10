import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions.jsx'


import JSCell from './cell.jsx';
import DeclaredProperties from './declared-properties.jsx';

class Page extends React.Component {

  addCell() {
    this.props.actions.addCell('javascript');
  }

  render () {
    var cells = this.props.cells.map((cell)=> {
      return <JSCell cell={cell} actions={this.props.actions} key={cell.id} id={cell.id} />
    });
    var declaredPropertiesPane;
    if (Object.keys(this.props.declaredProperties).length) {
      declaredPropertiesPane = <DeclaredProperties state={this.props.declaredProperties} />
    } else {
      declaredPropertiesPane = <div></div>
    }

    return (
      <div>
      <h1 className='page-title'>Javascript Notebook</h1>
      <div className='controls'>
      	<button onClick={this.addCell.bind(this)}> + </button>
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