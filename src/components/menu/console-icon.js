import React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'

export default function DeclaredVariableIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M20,19V7H4V19H20M20,3A2,2 0 0,1 22,5V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.33 11.7,13.72L8.42,17H5.59L9.58,13Z" />
    </SvgIcon>
  )
}

// export class DeclaredVariableIcon extends React.Component {
//   render() {
//     return (
//       <SvgIcon {...props}>
//       </SvgIcon>
//     )
//   }
// }
