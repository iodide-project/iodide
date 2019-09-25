import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";

import { Manager, Reference, Popper } from "react-popper";

import { GenericButton } from "../../shared/components/buttons";

const ClickContainer = styled("div")`
  border: ${props => {
    if (!props.isValid) return "none";
    return props.isActive ? "1px solid #e0e0e0" : "1px solid rgba(0,0,0,0)";
  }};
  border-radius: 3px;
  :hover {
    border: ${props => {
      if (!props.isValid) return "none";
      return "1px solid #e0e0e0";
    }};
  }
`;

ClickContainer.propTypes = {
  isValid: PropTypes.bool,
  isActive: PropTypes.bool
};

class OutsideClickBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.element,
    onClickOutside: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick);
  }

  handleClick(event) {
    const { onClickOutside } = this.props;

    if (typeof onClickOutside !== "function") {
      return;
    }
    onClickOutside(event); // clicked outside - fire callback
  }

  render() {
    return (
      <div
        style={{
          width: "100%",
          position: "absolute",
          zIndex: 1000,
          left: 0,
          top: 0
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default class Popover extends React.Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    activatingComponent: PropTypes.element,
    placement: PropTypes.string,
    children: PropTypes.element
  };
  constructor(props) {
    super(props);
    this.setVisibility = this.setVisibility.bind(this);
    this.closePopoverOnClick = this.closePopoverOnClick.bind(this);
    this.closePopoverOnKeypress = this.closePopoverOnKeypress.bind(this);
    this.state = { visible: false };
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.closePopoverOnKeypress);
  }

  setVisibility() {
    this.setState({ visible: !this.state.visible });
  }

  closePopoverOnClick() {
    this.setState({ visible: false });
  }

  closePopoverOnKeypress(event) {
    if (event.key === "Escape") this.closePopoverOnClick();
  }

  render() {
    if (this.state.visible) {
      document.addEventListener("keydown", this.closePopoverOnKeypress);
    } else {
      document.removeEventListener("keydown", this.closePopoverOnKeypress);
    }
    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <ClickContainer
              isValid={this.props.title !== undefined}
              isActive={this.state.visible}
              onClick={this.setVisibility}
            >
              <div ref={ref}>
                {this.props.title ? (
                  <GenericButton>{this.props.title}</GenericButton>
                ) : (
                  this.props.activatingComponent
                )}
              </div>
            </ClickContainer>
          )}
        </Reference>
        {this.state.visible
          ? ReactDOM.createPortal(
              <Popper placement={this.props.placement || "bottom-start"}>
                {({
                  ref,
                  style: { position, transform },
                  placement,
                  arrowProps
                }) => (
                  <OutsideClickBoundary
                    onClickOutside={this.closePopoverOnClick}
                  >
                    <div
                      ref={ref}
                      style={{
                        top: "0px",
                        left: "0px",
                        position,
                        paddingLeft:
                          placement && placement.includes("right") ? "10px" : 0,
                        paddingRight:
                          placement && placement.includes("left") ? "10px" : 0,
                        paddingTop:
                          placement && placement.includes("bottom")
                            ? "10px"
                            : 0,
                        paddingBottom:
                          placement && placement.includes("top") ? "10px" : 0,
                        transform,
                        transformOrigin: "top center"
                      }}
                      data-placement={placement}
                      onClick={this.closePopoverOnClick}
                    >
                      {this.props.children}
                      <div ref={arrowProps.ref} style={arrowProps.style} />
                    </div>
                  </OutsideClickBoundary>
                )}
              </Popper>,
              document.body
            )
          : null}
      </Manager>
    );
  }
}
