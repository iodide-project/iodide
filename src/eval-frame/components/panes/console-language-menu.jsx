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
    this.handleClose = this.handleClose.bind(this)
  }

  handleClick(event) {
    this.setState({ anchorElement: event.currentTarget })
  }

  handleClose() {
    this.setState({ anchorElement: null })
  }

  render() {
    const { anchorElement } = this.state

    return (
      <div>
        <Tooltip
          classes={{ tooltip: 'iodide-tooltip' }}
          placement="bottom"
          title="Current language"
        >
          <div>
            <Menu
              id="console-language-menu"
              open={Boolean(anchorElement)}
              onClose={this.handleClose}
              transitionDuration={70}
              getContentAnchorEl={null}
              anchorEl={anchorElement}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <div>
                {Object.values(this.props.availableLanguages).map(language => (
                  <MenuItem
                    classes={{ root: 'iodide-menu-item' }}
                    key={language.languageId}
                    onClick={() => {
                      this.props.setConsoleLanguage(language.languageId)
                      this.handleClose()
                    }}
                  >
                    <ListItemText
                      primary={language.languageId}
                    />
                    <ListItemText
                      primary={language.displayName}
                    />
                  </MenuItem>
                ))}
              </div>
            </Menu>
            <div
              aria-owns={anchorElement ? 'simple-menu' : undefined}
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
