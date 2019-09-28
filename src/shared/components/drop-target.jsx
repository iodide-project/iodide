import React from "react";
import PropTypes from "prop-types";

/**
 * The hoverStart and hoverEnd events fire even when children are hovered,
 * unlike onDragEnter and onDragLeave. They are based on Dragster by Ben
 * Smithett.
 *
 * https://github.com/bensmithett/dragster
 */

let first = false;
let second = false;

export default function DropTarget(props) {
  const [draggedOver, setDraggedOver] = React.useState(false);
  const targetElement = React.useRef(null);
  const extraProps = {};

  function handleHoverStart(e) {
    setDraggedOver(true);
    if (props.onHoverStart) {
      props.onHoverStart(e.detail.sourceEvent);
    }
  }

  function handleHoverEnd(e) {
    setDraggedOver(false);
    if (props.onHoverEnd) {
      props.onHoverEnd(e.detail.sourceEvent);
    }
  }

  React.useEffect(() => {
    return function cleanup() {
      document.removeEventListener("hoverStart", handleHoverStart, false);
      document.removeEventListener("hoverEnd", handleHoverEnd, false);
    };
  });

  document.addEventListener("hoverStart", handleHoverStart, false);
  document.addEventListener("hoverEnd", handleHoverEnd, false);

  if (props.active) {
    extraProps.onDragEnter = e => {
      if (first) {
        second = true;
      } else {
        first = true;
        targetElement.current.dispatchEvent(
          new CustomEvent("hoverStart", {
            bubbles: true,
            cancelable: true,
            detail: {
              sourceEvent: e
            }
          })
        );
      }
    };

    extraProps.onDragLeave = e => {
      if (second) {
        second = false;
      } else if (first) {
        first = false;
      }
      if (!first && !second) {
        targetElement.current.dispatchEvent(
          new CustomEvent("hoverEnd", {
            bubbles: true,
            cancelable: true,
            detail: {
              sourceEvent: e
            }
          })
        );
      }
    };

    extraProps.onDragOver = e => {
      e.preventDefault();
    };

    extraProps.onDrop = e => {
      e.preventDefault();
      setDraggedOver(false);
      first = false;
      second = false;
      if (props.onDrop) {
        props.onDrop(e);
      }
    };
  }

  const classes = ["drop-target"];
  classes.push(props.active ? "active" : "inactive");
  if (draggedOver) classes.push("dragged-over");

  return (
    <article
      ref={targetElement}
      id={props.id}
      className={classes.join(" ")}
      {...extraProps}
    >
      {props.children}
    </article>
  );
}

DropTarget.propTypes = {
  active: PropTypes.bool,
  id: PropTypes.string,
  onDrop: PropTypes.func,
  onHoverEnd: PropTypes.func,
  onHoverStart: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

DropTarget.defaultProps = {
  active: true
};
