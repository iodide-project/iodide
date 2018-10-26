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
      kernelState: PropTypes.string.isRequired,
      kernelText: PropTypes.string.isRequired,
    }
    render() {
      const { kernelState, kernelText } = this.props
      return (
        <Tooltip classes={{ tooltip: 'iodide-tooltip' }} title={kernelText}>
          <KernelContainer>
            {
                (kernelState === 'KERNEL_LOADING' || kernelState === 'KERNEL_BUSY') &&
                <IconContainer>
                  <CircularProgress size={20} />
                </IconContainer>
            }
            {
                kernelState === 'KERNEL_IDLE' &&
                <IconContainer color="forestgreen">
                  <PanoramaFishEye size={20} />
                </IconContainer>
            }
            {
                kernelState === 'KERNEL_ERROR' &&
                <IconContainer color="red">
                  <ErrorOutline size={20} />
                </IconContainer>
            }
            {
                kernelState === 'KERNEL_LOAD_ERROR' &&
                <IconContainer color="gray">
                  <Error size={20} />
                </IconContainer>
            }
          </KernelContainer>
        </Tooltip>
      )
    }
}

export function mapStateToProps(state) {
  const { kernelState } = state
  let kernelText = 'Kernel Status'
  switch (kernelState) {
    case 'KERNEL_LOADING':
      kernelText = 'Kernel Loading'
      break
    case 'KERNEL_IDLE':
      kernelText = 'Kernel Idle'
      break
    case 'KERNEL_ERROR':
      kernelText = 'Kernel Error'
      break
    case 'KERNEL_LOAD_ERROR':
      kernelText = 'Kernel Didn\'t Load'
      break
    default:
      kernelText = 'Kernel Status'
  }
  return { kernelState, kernelText }
}

export default connect(mapStateToProps)(KernelStateUnconnected)
