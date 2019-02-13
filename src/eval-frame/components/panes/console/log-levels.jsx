import React from "react";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import BaseIcon from "./base-icon";

const levels = {
  log: {},
  info: {},
  warn: {},
  error: {},
  output: {}
};

const Error = BaseIcon(ErrorIcon);
const Warning = BaseIcon(WarningIcon);
const Info = BaseIcon(InfoIcon);
const ArrowBack = BaseIcon(ArrowBackIcon);

levels.log.backgroundColor = "white";
levels.log.icon = undefined;
levels.log.textColor = "rgba(0,0,0,.8)";

levels.info.backgroundColor = "white";
levels.info.icon = <Info style={{ opacity: 0.5 }} />;
levels.info.textColor = "rgba(0,0,0,.8)";

levels.warn.backgroundColor = "rgb(255,251,214)";
levels.warn.icon = <Warning style={{ color: "rgb(190,155,0)" }} />;
levels.warn.textColor = "rgb(131, 81, 15)";

levels.error.backgroundColor = "rgb(253,244,245)";
levels.error.textColor = "rgb(164, 0, 15)";
levels.error.icon = <Error style={{ color: "rgb(215,0,34)" }} />;

levels.output.backgroundColor = "white";
levels.output.textColor = "black";
levels.output.icon = <ArrowBack style={{ opacity: 0.5 }} />;

export default levels;
