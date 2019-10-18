import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * The hoverstart and hoverend events fire even when children are hovered,
 * unlike onDragEnter and onDragLeave. They are based on Dragster by Ben
 * Smithett.
 *
 * https://github.com/bensmithett/dragster
 */

let first = false;
let second = false;

export default function DropTarget(props) {
  const [draggedOver, setDraggedOver] = useState(false);
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

  useEffect(() => {
    return function cleanup() {
      document.removeEventListener("hoverstart", handleHoverStart, false);
      document.removeEventListener("hoverend", handleHoverEnd, false);
    };
  });

  document.addEventListener("hoverstart", handleHoverStart, false);
  document.addEventListener("hoverend", handleHoverEnd, false);

  if (props.active) {
    extraProps.onDragEnter = e => {
      if (first) {
        second = true;
      } else {
        first = true;
        targetElement.current.dispatchEvent(
          new CustomEvent("hoverstart", {
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
          new CustomEvent("hoverend", {
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
    <div
      ref={targetElement}
      id={props.id}
      className={classes.join(" ")}
      {...extraProps}
    >
      {props.children}
    </div>
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
