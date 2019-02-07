import React from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import Popover from "../../../../shared/components/popover";
import Menu from "../../../../shared/components/menu";
import MenuItem from "../../../../shared/components/menu-item";
import { TextButton } from "../../../../shared/components/buttons";
import BaseIcon from "./base-icon";
import THEME from "../../../../shared/theme";

const ArrowDropUp = styled(BaseIcon(ArrowDropUpIcon))`
  display: inline-block;
  transform: translateY(3px);
`;

const LanguageSelectButton = styled(TextButton)`
  font-size: 12px;
  padding: 0px;
  padding-left: 5px;
  padding-right: 5px;
  height: 27px;
  border-radius: 0px;
  margin: auto;
  display: grid;
  background-color: ${THEME.elementBackgroundLeft};
  border-left: 1px solid gainsboro;
  align-self: center;
  color: rgba(0, 0, 0, 0.6);
  text-transform: lowercase;
  transition: 300ms;
  :hover {
    background-color: rgb(244, 227, 244);
  }
  :active {
    border-left: 1px solid gainsboro;
  }

  div {
    margin: auto;
    transform: translateY(-1px);
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

const onMenuClickCreator = (fcn, languageId) => () => fcn(languageId);

const ConsoleLanguageMenu = ({
  availableLanguages,
  currentLanguage,
  onMenuClick
}) => {
  return (
    <React.Fragment>
      <Popover
        placement="left-end"
        activatingComponent={
          <LanguageSelectButton>
            <div>
              <ArrowDropUp />
              {currentLanguage}
            </div>
          </LanguageSelectButton>
        }
      >
        <Menu>
          {availableLanguages.map(language => (
            <MenuItem
              key={language.languageId}
              onClick={onMenuClickCreator(onMenuClick, language.languageId)}
            >
              <LanguageName>{language.displayName}</LanguageName>
              <LanguageShort>{language.languageId}</LanguageShort>
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </React.Fragment>
  );
};
ConsoleLanguageMenu.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  availableLanguages: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      languageId: PropTypes.string.isRequired
    })
  ).isRequired,
  onMenuClick: PropTypes.func.isRequired
};
export default ConsoleLanguageMenu;
