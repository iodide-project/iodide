import React, {createElement} from 'react'
import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton, Label } from 'react-bootstrap'
// import ContentEditable from "react-contenteditable"

function formattedTitle(title) {
  return (title !== undefined) ? title : 'new notebook'
}

class Title extends React.Component {
  constructor(props) {
    super(props)
    this.state = {previousMode: props.pageMode, isFocused: false}
    this.onBlur = this.onBlur.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.changeTitle = this.changeTitle.bind(this)
    this.enterTitleEditMode = this.enterTitleEditMode.bind(this)
  }

  changeTitle(evt) {
    //this.props.actions.changeMode('title-edit')
    this.props.actions.changePageTitle(evt.target.value)
  }

  enterTitleEditMode() {
    this.setState({previousMode: this.props.pageMode, onFocus: true})
    this.props.actions.changeMode('title-edit')
  }

  onBlur() {
    if (this.props.pageMode == 'title-edit') this.props.actions.changeMode(this.state.previousMode)
    this.setState({isFocused: false})
  }

  onFocus() {
    this.setState({isFocused: true})
    if (!this.props.pageMode != 'title-edit') {
      console.log('onFocus')
			
      //this.props.actions.changeMode(this.state.previousMode)
      this.setState({previousMode: this.props.pageMode})
      this.props.actions.changeMode('title-edit')
    }

  }


  render() {
    var elem = <div className={'title-field-contents ' + (this.props.pageMode !='title-edit' ? 'unselected-title-field' : '')}>
      <input 
        ref='titleEditor'
        onBlur={this.onBlur}
        onClick={this.onFocus}
        className={'page-title ' + (this.props.title === undefined ? 'unrendered-title' : '')} 
        value={this.props.title || ''} placeholder='new notebook' onChange={this.changeTitle} />
    </div>
    return elem
  }

}

export default Title