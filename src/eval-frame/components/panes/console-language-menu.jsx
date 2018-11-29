import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Tooltip from '@material-ui/core/Tooltip'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import ArrowDropUp from '@material-ui/icons/ArrowDropUp'

import { setConsoleLanguage } from '../../actions/actions'


export class ConsoleLanguageMenuUnconnected extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    availableLanguages: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      anchorElement: null,
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleIconButtonClose = this.handleIconButtonClose.bind(this)
  }

  handleClick(event) {
    this.setState({ anchorElement: event.currentTarget })
  }

  handleIconButtonClose() {
    this.setState({ anchorElement: null })
  }

  render() {
    const { anchorElement } = this.state

    return (
      <div className="cell-menu-container">
        <Tooltip
          classes={{ tooltip: 'iodide-tooltip' }}
          placement="bottom"
          title="Current language"
        >
          <div>
            <Menu
              id="cell-menu"
              open={Boolean(anchorElement)}
              onClose={this.handleIconButtonClose}
              transitionDuration={70}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <div className="cell-menu-items-container">
                {Object.values(this.props.availableLanguages).map(language => (
                  <MenuItem
                    classes={{ root: 'iodide-menu-item' }}
                    key={language.languageId}
                    onClick={() => {
                      this.props.setConsoleLanguage(language.languageId)
                      this.handleIconButtonClose()
                    }}
                  >
                    <ListItemText
                      classes={{ root: 'primary-menu-item' }}
                      primary={language.languageId}
                    />
                    <ListItemText
                      classes={{ root: 'primary-menu-item' }}
                      primary={language.displayName}
                    />
                  </MenuItem>
                ))}
              </div>
            </Menu>
            <div
              className="cell-type-label"
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              {this.props.label}
              <ArrowDropUp style={{ fontSize: 20 }} />
            </div>
          </div>
        </Tooltip>
      </div>
    )
  }
}


function mapStateToProps(state) {
  const availableLanguages = Object.assign({}, state.languageDefinitions, state.loadedLanguages)
  return {
    label: state.languageLastUsed,
    availableLanguages,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setConsoleLanguage: (language) => {
      dispatch(setConsoleLanguage(language))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsoleLanguageMenuUnconnected)
