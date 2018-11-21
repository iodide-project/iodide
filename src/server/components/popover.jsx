import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'react-emotion'

import { Manager, Reference, Popper } from 'react-popper';

import { TextButton } from '../../shared/components/buttons'


const ClickContainer = styled('div')`
border: ${props => (props.isActive ? '1px solid #e0e0e0' : '1px solid rgba(0,0,0,0)')};
border-radius: 3px;

:hover {
  border: 1px solid #e0e0e0;
}
`

class OutsideClickBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
  }

  handleClick(event) {
    const { container } = this;
    const { onClickOutside } = this.props;

    const { target } = event;
    if (typeof onClickOutside !== 'function') {
      return;
    }

    // if target is container - container was not clicked outside
    // if container contains clicked target - click was not outside of it
    if (target !== container && !container.contains(target)) {
      onClickOutside(event); // clicked outside - fire callback
    }
  }

  render() {
    return (
      <div ref={(el) => { this.container = el }}>
        {this.props.children}
      </div>
    );
  }
}

export default class Popover extends React.Component {
  constructor(props) {
    super(props)
    this.setVisibility = this.setVisibility.bind(this)
    this.closePopoverOnClick = this.closePopoverOnClick.bind(this)
    this.closePopoverOnKeypress = this.closePopoverOnKeypress.bind(this)
    this.state = { visible: false }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.closePopoverOnKeypress);
  }

  setVisibility() {
    this.setState({ visible: !this.state.visible })
  }

  closePopoverOnClick() {
    this.setState({ visible: false })
  }

  closePopoverOnKeypress(event) {
    if (event.key === 'Escape') this.closePopoverOnClick();
  }

  render() {
    if (this.state.visible) {
      document.addEventListener('keydown', this.closePopoverOnKeypress);
    } else {
      document.removeEventListener('keydown', this.closePopoverOnKeypress);
    }

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <ClickContainer isActive={this.state.visible}>
              <div ref={ref}>
                <TextButton buttonColor="black" type="button" onClick={this.setVisibility}>
                  {this.props.title}
                </TextButton>
              </div>
            </ClickContainer>
        )}
        </Reference>
        {this.state.visible ?
        ReactDOM.createPortal(
          <Popper
            placement={this.props.placement || 'bottom-start'}
          >
            {({
                  ref, style: { position, transform }, placement, arrowProps,
                  }) => (
                    <OutsideClickBoundary onClickOutside={this.closePopoverOnClick}>
                      <div
                        ref={ref}
                        style={{
                          top: '0px',
                          left: '0px',
                          position,
                          paddingLeft: placement && placement.includes('right') ? '10px' : 0,
                          paddingRight: placement && placement.includes('left') ? '10px' : 0,
                          paddingTop: placement && placement.includes('bottom') ? '10px' : 0,
                          paddingBottom: placement && placement.includes('top') ? '10px' : 0,
                          transform,
                          transformOrigin: 'top center',
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
        document.body,
) : null
        }

      </Manager>
    )
  }
}

/* <OutsideClickBoundary onClickOutside={this.closePopoverOnClick}>
<div
  ref={ref}
  style={style}
  data-placement={placement}
>
  {this.props.children}
  <div ref={arrowProps.ref} style={arrowProps.style} />
</div>
</OutsideClickBoundary> */
