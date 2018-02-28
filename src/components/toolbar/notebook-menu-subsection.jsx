import React from 'react'

import MenuItem from 'material-ui/MenuItem'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'

// export default class NotebookMenuSubsection extends React.Component {
//   static propTypes = {
//     title: PropTypes.string,
//     className: PropTypes.string,
//   }
//   render() {
//     const children = React.Children.map(
//       this.props.children,
//       c => React.cloneElement(c),
//     )// , { className: this.props.className || '' }),)
//     return (
//       <MenuItem
//         style={{ fontSize: '13px' }}
//         primaryText={this.props.title}
//         rightIcon={<ArrowDropRight />}
//         menuItems={children}
//       />
//     )
//   }
// }

const NotebookMenuSubsection = props =>
  // const children = React.Children.map(
  //   props.children,
  //   c => React.cloneElement(c), // , { className: props.className || '' }),
  // )
  (
    <MenuItem
      style={{ fontSize: '13px' }}
      primaryText={props.title}
      rightIcon={<ArrowDropRight />}
      menuItems={props.children}
    />
  )


NotebookMenuSubsection.muiName = 'MenuItem'
export default NotebookMenuSubsection
