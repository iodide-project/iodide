import React from "react";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import BaseIcon from "../../base-icon";

const Error = BaseIcon(ErrorIcon, { color: "rgb(215,0,34)" });
const Warning = BaseIcon(WarningIcon, { color: "rgb(190,155,0)" });
const Info = BaseIcon(InfoIcon, { opacity: 0.5 });
const ArrowBack = BaseIcon(ArrowBackIcon, { opacity: 0.5 });

const levels = {
  LOG: {
    backgroundColor: "white",
    icon: undefined,
    textColor: "rgba(0,0,0,.8)"
  },
  INFO: {
    backgroundColor: "white",
    icon: <Info />,
    textColor: "rgba(0,0,0,.8)"
  },
  WARN: {
    backgroundColor: "rgb(255,251,214)",
    icon: <Warning />,
    textColor: "rgb(131, 81, 15)"
  },
  ERROR: {
    backgroundColor: "rgb(253,244,245)",
    icon: <Error />,
    textColor: "rgb(164, 0, 15)"
  },
  OUTPUT: {
    backgroundColor: "white",
    textColor: "black",
    icon: <ArrowBack style={{ opacity: 0.5 }} />
  }
};

export default levels;
