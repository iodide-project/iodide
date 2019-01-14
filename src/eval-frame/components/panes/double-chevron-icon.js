import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

export default class DoubleChevronIcon extends React.Component {
  render() {
    return (
      <SvgIcon {...this.props}>
        <svg
          style={{
            width: "24px",
            height: "24px"
          }}
          viewBox="0 0 24 24"
        >
          <path d="M5.59,7.41L7,6L13,12L7,18L5.59,16.59L10.17,12L5.59,7.41M11.59,7.41L13,6L19,12L13,18L11.59,16.59L16.17,12L11.59,7.41Z" />
        </svg>
      </SvgIcon>
    );
  }
}
