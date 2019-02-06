import React from "react";

import InfoIcon from "@material-ui/icons/InfoOutlined";
import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";
import BaseIcon from "./base-icon";

const levels = {
  log: {},
  info: {},
  warn: {},
  error: {}
};

const Error = BaseIcon(ErrorIcon);
const Warning = BaseIcon(WarningIcon);
const Info = BaseIcon(InfoIcon);

levels.log.backgroundColor = "white";
levels.log.symbol = undefined;
levels.log.textColor = "rgba(0,0,0,.8)";

levels.info.backgroundColor = "white";
levels.info.symbol = <Info style={{ opacity: 0.5 }} />;
levels.info.textColor = "rgba(0,0,0,.8)";

levels.warn.backgroundColor = "rgb(255,251,214)";
levels.warn.symbol = <Warning style={{ color: "rgb(190,155,0)" }} />;
levels.warn.textColor = "rgb(131, 81, 15)";

levels.error.backgroundColor = "rgb(253,244,245)";
levels.error.textColor = "rgb(164, 0, 15)";
levels.error.symbol = <Error style={{ color: "rgb(215,0,34)" }} />;

export default levels;
