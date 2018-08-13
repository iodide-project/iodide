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
    const { classes } = this.props;
    return (
      <div>
        <section>
          <div className='hero-unit'>
            <div className='hero-content'>
              <Typography variant="display3" align="center" color="textPrimary" gutterBottom>
                The Iodide Notebook
              </Typography>
              <Typography variant="title" align="center" color="textSecondary" paragraph>
                Iodide is a modern, literate, and interactive programming environment that
                uses the strengths of the browser to let scientists work flexibly and collaboratively
                with minimal friction. With Iodide you can tell the story of your findings exactly
                how you want, leveraging the power of HTML+CSS to display your results in whatever
                way communicates them most effectively.
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
        <section className='features-notebooks'>
          <h2>Featured Notebooks</h2>
            <div className='examples'>
              <a href='https://iodide.io/iodide-examples/lorenz-attractor-pres.html'>
                <div>
                  <img width='280' height='280' src='https://media.giphy.com/media/ftdkB78fuQ1Eb3J2o1/giphy.gif'/>
                  <h3>Lorenz Attractor</h3>
                   A concise example demonstrating how powerful
                  a web tech-focused notebook environment is for computational presentations.
                </div>
              </a>

              <a href='https://iodide.io/iodide-examples/python.html'>
                <div>
                  <img width='280'  height='280' src='https://media.giphy.com/media/65NKOOH1IQrsLx5aZb/giphy.gif' />
                    <h3>Pyodide - The Scientific Python Stack in the Browser</h3>
                       A tutorial demonstrating how
                    to use Python, Numpy, Pandas, and Matplotlib entirely within your browser.
                </div>
              </a>
              <a href='https://iodide.io/iodide-examples/world-happiness-report-2018.html'>
                <div>
                  <img width='280'  height='280' src='https://media.giphy.com/media/i4rRuA3cksj8a9R58g/giphy.gif' />
                    <h3>World Happiness Report</h3>
                       A neat data exploration using the World Happiness Report.
                </div>
              </a>



              <a href='https://iodide.io/iodide-examples/volumetric.html'>
                <div>
                  <img width='280'  height='280' src='https://media.giphy.com/media/9G6RGV7z6k4uzygzOQ/giphy.gif' />
                    <h3>MRIs and You</h3>
                       One man's cartoon / WebGL journey into his own brain.
                </div>
              </a>

              <a href='https://iodide.io/pyodide-demo/matplotlib-sideload.html?sideload=https://matplotlib.org/examples/animation/rain.py'>
                <div>
                  <img width='280'  height='280' src='https://media.giphy.com/media/g0djNd2DgoNeweZuDr/giphy.gif' />
                    <h3>Matplotlib Code Runner</h3>
                       Run examples from the Matplotlib docs entirely in your browser. Just add a url.
                </div>
              </a>

              <a href='https://iodide.io/iodide-examples/eviction-notices-sf.html'>
                <div>
                  <img width='280'  height='280' src='https://media.giphy.com/media/MohSU55IoyGmAXgEkY/giphy.gif' />
                    <h3>Eviction Notices By SF Neighborhood, 1999-2017</h3>
                       A small data presentation about one aspect of the SF Housing crisis.
                </div>
              </a>
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
