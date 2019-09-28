import React from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import PropTypes from "prop-types";

import { fadeIn } from "../keyframes";

import {
  MODAL_ZINDEX,
  NESTED_MODAL_ZINDEX
} from "../../editor/style/z-index-styles";

const Backdrop = styled("div")`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${props =>
    props.aboveOtherModals ? NESTED_MODAL_ZINDEX : MODAL_ZINDEX};
  background-color: rgba(0, 0, 0, 0.3);
  padding: 50;
  padding-top: 200px;
  transition: 500ms;
  animation-name: ${fadeIn};
  animation-duration: 250ms;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: forwards;
  animation-play-state: running;
`;

const ModalWindow = styled("div")`
  background-color: #fff;
  border-radius: 5px;
  max-width: 500px;
  min-width: 400px;
  margin: 0 auto;
  padding: 8px;
  box-shadow: 0px 0px 60px rgba(0, 0, 0, 0.3);
`;

function getScrollBarSize() {
  // borrowed from rc-util
  let value;
  const inner = document.createElement("div");
  inner.style.width = "100%";
  inner.style.height = "200px";

  const outer = document.createElement("div");
  const outerStyle = outer.style;

  outerStyle.position = "absolute";
  outerStyle.top = 0;
  outerStyle.left = 0;
  outerStyle.pointerEvents = "none";
  outerStyle.visibility = "hidden";
  outerStyle.width = "200px";
  outerStyle.height = "150px";
  outerStyle.overflow = "hidden";

  outer.appendChild(inner);

  document.body.appendChild(outer);

  const widthContained = inner.offsetWidth;
  outer.style.overflow = "scroll";
  let widthScroll = inner.offsetWidth;

  if (widthContained === widthScroll) {
    widthScroll = outer.clientWidth;
  }

  document.body.removeChild(outer);

  value = widthContained - widthScroll;
  if (document.body.scrollHeight <= window.innerHeight) value = 0;
  return value;
}

// since our css is locally scoped,
// we will need to select the body and apply a style
// to prevent scrolling.
const disableScrolling = () => {
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = `${getScrollBarSize()}px`;
};

const restoreScrolling = (overflow, paddingRight) => {
  document.body.style.overflow = overflow;
  document.body.style.paddingRight = paddingRight;
};

export default class Modal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    onCloseOrCancel: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    aboveOtherModals: PropTypes.bool // eslint-disable-line react/no-unused-prop-types
  };

  static defaultProps = {
    aboveOtherModals: false,
    visible: true
  };

  constructor(props) {
    super(props);
    this.closeModalOnEscapeKeypress = this.closeModalOnEscapeKeypress.bind(
      this
    );
    this.previousBodyOverflow = document.body.style.overflow;
    this.previousBodyPaddingRight = document.body.style.paddingRight;
  }

  getSnapshotBeforeUpdate() {
    this.previousBodyOverflow = document.body.style.overflow;
    this.previousBodyPaddingRight = document.body.style.paddingRight;
    return null;
  }

  componentDidUpdate() {
    if (!this.props.visible) {
      restoreScrolling(
        this.previousBodyOverflow,
        this.previousBodyPaddingRight
      );
      document.removeEventListener("keydown", this.closeModalOnEscapeKeypress);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.closeModalOnEscapeKeypress);
  }

  closeModalOnEscapeKeypress(event) {
    if (event.key === "Escape") this.props.onCloseOrCancel();
  }

  render() {
    if (!this.props.visible) return null;
    document.addEventListener("keydown", this.closeModalOnEscapeKeypress);
    disableScrolling();
    return ReactDOM.createPortal(
      <Backdrop
        onClick={e => {
          e.stopPropagation();
          this.props.onCloseOrCancel();
        }}
      >
        <ModalWindow
          onClick={e => {
            e.stopPropagation();
          }}
        >
          {this.props.children}
        </ModalWindow>
      </Backdrop>,
      document.body
    );
  }
}
