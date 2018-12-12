import React from 'react'
import PropTypes from 'prop-types'

import styled from 'react-emotion'
import { connect } from 'react-redux'
import Tooltip from '@material-ui/core/Tooltip'
import CircularProgress from '@material-ui/core/CircularProgress'
import PanoramaFishEye from '@material-ui/icons/PanoramaFishEye'
import Error from '@material-ui/icons/Error'
import ErrorOutline from '@material-ui/icons/ErrorOutline'

const KernelContainer = styled('div')`
width: 35px;
height: 35px;
margin-left: 15px; 
margin-right: 15px;
display: flex;
align-items: center;
justify-content: middle;
`

const IconContainer = styled('div')`
width: 35px;
height: 35px;
display: flex;
align-items: center;
justify-content: center;
color: ${props => props.color || 'white'};
`

export class KernelStateUnconnected extends React.Component {
    static propTypes = {
      kernelText: PropTypes.string.isRequired,
    }

    shouldComponentUpdate(nextProps) {
      // FIXME: this seem unnecessary, but I'm noticing that
      // render() is fired on every single state update, and I'm not sure why.
      return (this.props.kernelText !== nextProps.kernelText)
    }

    render() {
      const {
        kernelText, color, StatusIcon,
      } = this.props
      return (
        <Tooltip classes={{ tooltip: 'iodide-tooltip' }} title={kernelText}>
          <KernelContainer>
            <IconContainer color={color}>
              <StatusIcon />
            </IconContainer>
          </KernelContainer>
        </Tooltip>
      )
    }
}

export function mapStateToProps(state) {
  const { kernelState } = state
  let kernelText = 'Kernel Status'
  let color = 'white'
  let StatusIcon = () => <CircularProgress size={20} />
  switch (kernelState) {
    case 'KERNEL_LOADING':
      kernelText = 'Kernel Loading'
      break
    case 'KERNEL_IDLE':
      kernelText = 'Kernel Idle'
      color = 'forestgreen'
      StatusIcon = () => <PanoramaFishEye size={20} />
      break
    case 'KERNEL_ERROR':
      kernelText = 'Kernel Error'
      color = 'gray'
      StatusIcon = () => <ErrorOutline size={20} />
      break
    case 'KERNEL_LOAD_ERROR':
      kernelText = 'Kernel Didn\'t Load'
      StatusIcon = () => <Error size={20} />
      color = 'red'

      break
    default:
      kernelText = 'Kernel Status'
  }
  return {
    kernelText, color, StatusIcon,
  }
}

export default connect(mapStateToProps)(KernelStateUnconnected)
