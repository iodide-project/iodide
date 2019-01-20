import React from "react";
import PropTypes from "prop-types";

import {
  Inspector,
  ObjectName
  // ObjectValue,
  // ObjectRootLabel
} from "react-inspector";

import { ValueRenderer } from "./value-renderer";

/**
 * This is a copy of ObjectLabel from react-inspector, modified so it will
 * handle iodide custom reps (<ValueRenderer/>), rather than just
 * react-inspector's own reps (<ObjectValue/>). Noteably, to prevent infinite
 * recursion, the default handler, when `inContainer` is true, goes to
 * `<ObjectValue/>` *without* using the custom reps.
 */

/**
 * if isNonenumerable is specified, render the name dimmed
 */
const IodideObjectLabel = ({ name, data, isNonenumerable }) => {
  const object = data;

  return (
    <span>
      <ObjectName name={name} dimmed={isNonenumerable} />
      <span>: </span>
      <ValueRenderer render inContainer valueToRender={object} />
    </span>
  );
};

IodideObjectLabel.propTypes = {
  /** Non enumerable object property will be dimmed */
  isNonenumerable: PropTypes.bool
};

IodideObjectLabel.defaultProps = {
  isNonenumerable: false
};

/* This customizes react-inspector's display of object key/value pairs to use
 * Iodide's custom reps */
// const nodeRenderer = ({ depth, name, data, isNonenumerable }) =>
//   depth === 0 ? (
//     <ObjectRootLabel name={name} data={data} />
//   ) : (
//     <IodideObjectLabel
//       name={name}
//       data={data}
//       isNonenumerable={isNonenumerable}
//     />
//   );

// export default {
//   shouldHandle: () => true,
//   render: value => <Inspector object={value} />
//   // render: value => {
//   // if (!inCollection) {
//   //   return <Inspector data={value} nodeRenderer={nodeRenderer} />;
//   // }
//   //   return
//   // }
// };

export default class DefaultRenderer extends React.Component {
  static propTypes = {
    value: PropTypes.any.isRequired
  };

  render() {
    return <Inspector data={this.props.value} shouldShowPlaceholder={false} />;
  }
}
