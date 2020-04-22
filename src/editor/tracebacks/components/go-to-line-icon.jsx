import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

export default class GoToLineIcon extends React.Component {
  render() {
    return (
      <SvgIcon {...this.props}>
        <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
          <path d="M 20,17 H 7 v 2 h 13 z" />
          <path d="M 16,9 H 7 v 2 h 9 z" />
          <path d="M 7,15 H 21 V 13 H 7 Z" />
          <path d="M 7,5 V 7 H 21 V 5 Z" />
          <path d="M 2,14 V 5.9999997 L 6,10 Z" />
        </svg>
      </SvgIcon>
    );
  }
}
