import React from 'react'
import { css } from 'emotion'
import Typography from '@material-ui/core/Typography'

export default class IodideLogo extends React.Component {
  render() {
    return (
      <Typography
        variant="title"
        className={css`
          font-family: 'Zilla Slab', serif;
          font-size:30px;
          font-weight: 300;`}
      >
        <a href={this.props.backLink} target="_self" style={{ color: 'white', textDecoration: 'none' }}>
          Iodide
        </a>
      </Typography>
    );
  }
}
