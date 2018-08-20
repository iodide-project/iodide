import React from 'react'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import './homepage.css'

class Homepage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notebooks: [],
    }
  }

  componentDidMount() {
    fetch('/api/v1/notebooks/')
    .then(response => response.json())
    .then(data => {
      let notebooks = data.map(notebook => {
        return (
          <div className='notebook' key={notebook.id}>
            <a href={`notebooks/${notebook.id}`}>
              {notebook.title || 'Untitled'}
            </a>
            <div className='notebook-owner'>
              By: <a href={`/${notebook.owner}`}>{notebook.owner}</a>
            </div>
          </div>
        )
      })
      this.setState({notebooks})
    })
    .catch(error => console.error(error));
  }

  render() {
    return (
      <div>
        <section>
          <div className='hero-unit'>
            <div className='hero-content'>
              <Typography variant="display3" align="center" color="textPrimary" gutterBottom>
                The Iodide Notebook
              </Typography>
              <div>
                <Grid container spacing={16} justify="center">
                  <Grid item>
                    <Button variant="contained" href='/notebooks' color="primary">
                      Create a Notebook
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" href='https://iodide.io/iodide-examples/what-a-web-notebook-looks-like.html' color="primary">
                      View Example Notebook
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </section>
        <section className='all-notebooks-container'>
          <div className='all-notebooks'>
            <h2>All Notebooks</h2>
            {this.state.notebooks}
          </div>
        </section>
      </div>
    )
  }

}

export default Homepage
