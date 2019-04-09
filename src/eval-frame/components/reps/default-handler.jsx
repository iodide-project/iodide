import React from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";

import { Inspector } from "iodide-react-inspector";

// iodide-react-inspector enforces a 14px height on its elements,
// so we will need to offset the bottom + top by enough to bring to 20px
// in order to center the element enough to work in the console
// without setting margin: auto in a grid or flex container.
// Doing that latter part messes up the carats.
const ValueRendererContainer = styled("div")`
  margin-top: 3px;
  margin-bottom: 3px;
`;

export default class DefaultRenderer extends React.Component {
  static propTypes = {
    value: PropTypes.any // eslint-disable-line react/forbid-prop-types
  };

  render() {
    return (
      <ValueRendererContainer>
        <Inspector data={this.props.value} shouldShowPlaceholder={false} />
      </ValueRendererContainer>
    );
  }
}
