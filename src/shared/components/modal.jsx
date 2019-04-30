import React from "react";
import ReactDOM from "react-dom";
import styled, { keyframes } from "react-emotion";
import PropTypes from "prop-types";

const fadeIn = keyframes`
0% {
  opacity: 0;
}

100% {
  opacity: 1;
}
`;

const Backdrop = styled("div")`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1300;
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

const enableScrolling = () => {
  document.body.style.overflow = "auto";
  document.body.style.paddingRight = "0px";
};

export default class Modal extends React.Component {
  static propTypes = {
    children: PropTypes.element
  };
  constructor(props) {
    super(props);
    this.closeModalOnEscapeKeypress = this.closeModalOnEscapeKeypress.bind(
      this
    );
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.closeModalOnEscapeKeypress);
  }

  closeModalOnEscapeKeypress(event) {
    if (event.key === "Escape") this.props.onClose();
  }

  render() {
    if (!this.props.visible) {
      enableScrolling();
      document.removeEventListener("keydown", this.closeModalOnEscapeKeypress);
      return null;
    }
    document.addEventListener("keydown", this.closeModalOnEscapeKeypress);
    disableScrolling();
    return ReactDOM.createPortal(
      <Backdrop
        onClick={e => {
          e.stopPropagation();
          this.props.onClose();
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

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func
};
