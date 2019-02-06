import React from "react";
import styled from "react-emotion";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import Popover from "../../../shared/components/popover";
import Menu from "../../../shared/components/menu";
import MenuItem from "../../../shared/components/menu-item";
import { TextButton } from "../../../shared/components/buttons";
import BaseIcon from "./console/base-icon";

import { setConsoleLanguage } from "../../actions/actions";

const ArrowDropUp = styled(BaseIcon(ArrowDropUpIcon))`
  display: inline-block;
`;

const LanguageSelectButton = styled(TextButton)`
  font-size: 12px;
  padding: 3px;
  margin-right: 1px;
  border-radius: 0px;
  margin-bottom: 0px;
  padding-bottom: 2px;
  align-self: center;
  color: rgba(0, 0, 0, 0.4);
  text-transform: lowercase;

  :hover {
    border: 1px solid gainsboro;
  }

  :active {
    border: 1px solid gainsboro;
  }
`;

const LanguageShort = styled("div")`
  padding-left: 6px;
  opacity: 0.6;
`;

const LanguageName = styled("div")`
  min-width: 100px;
  text-align: left;
  padding-right: 6px;
`;

export class ConsoleLanguageMenuUnconnected extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    availableLanguages: PropTypes.object.isRequired
  };

  render() {
    return (
      <React.Fragment>
        <Popover
          placement="left-end"
          activatingComponent={
            <LanguageSelectButton>
              <ArrowDropUp />
              {this.props.label}
            </LanguageSelectButton>
          }
        >
          <Menu>
            {Object.values(this.props.availableLanguages).map(language => (
              <MenuItem
                key={language.languageId}
                onClick={() => {
                  this.props.setConsoleLanguage(language.languageId);
                  this.handleClose();
                }}
              >
                <LanguageName>{language.displayName}</LanguageName>
                <LanguageShort>{language.languageId}</LanguageShort>
              </MenuItem>
            ))}
          </Menu>
        </Popover>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const availableLanguages = Object.assign(
    {},
    state.languageDefinitions,
    state.loadedLanguages
  );
  return {
    label: state.languageLastUsed,
    availableLanguages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setConsoleLanguage: language => {
      dispatch(setConsoleLanguage(language));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConsoleLanguageMenuUnconnected);
