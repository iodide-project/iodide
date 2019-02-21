import React from "react";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import BaseIcon from "./base-icon";

const Error = BaseIcon(ErrorIcon);
const Warning = BaseIcon(WarningIcon);
const Info = BaseIcon(InfoIcon);
const ArrowBack = BaseIcon(ArrowBackIcon);

const levels = {
  LOG: {
    backgroundColor: "white",
    icon: undefined,
    textColor: "rgba(0,0,0,.8)"
  },
  INFO: {
    backgroundColor: "white",
    icon: <Info style={{ opacity: 0.5 }} />,
    textColor: "rgba(0,0,0,.8)"
  },
  WARN: {
    backgroundColor: "rgb(255,251,214)",
    icon: <Warning style={{ color: "rgb(190,155,0)" }} />,
    textColor: "rgb(131, 81, 15)"
  },
  ERROR: {
    backgroundColor: "rgb(253,244,245)",
    icon: <Error style={{ color: "rgb(215,0,34)" }} />,
    textColor: "rgb(164, 0, 15)"
  },
  OUTPUT: {
    backgroundColor: "white",
    textColor: "black",
    icon: <ArrowBack style={{ opacity: 0.5 }} />
  }
};

export default levels;
