import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'

export default class Footer extends Component {
  render() {
    return (
      <footer className='footer'>
        <Grid className='footer-items' container direction="row" justify="space-between" alignItems="center">
          <Grid className='footer-links' item sm={5} xs={5} style={{ textAlign: 'left' }}>
            <b>Github</b> : <a href='https://github.com/iodide-project/iodide'>Iodide Project</a><br />
            <b>Community</b> : <a href='https://gitter.im/iodide-project/iodide'>Gitter Channel</a>
          </Grid>
          <Grid item sm={3} xs={2} style={{ textAlign: 'right' }}>
            Iodide
          </Grid>
        </Grid>
      </footer>
    )
  }
}
