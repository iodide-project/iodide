import React from 'react'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper'
import './user-page.css'

class UserPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
      caughtError: false,
    }
  }

  componentDidMount() {
    fetch(`/api/v1/users/?username=${this.props.match.params.user}`)
    .then(response => response.json())
    .then(data => {
      if (data[0].id) this.setState({user: data[0]})
      else this.setState({caughtError: true})
    })
    .catch((error) => {
      console.error(error)
      this.setState({caughtError: true})
    })
  }

  render() {
    let name = this.state.user.username
    if (this.state.user.first_name && this.state.user.last_name) {
      name = `${this.state.user.first_name} ${this.state.user.last_name}`
    }
    let notebooksList = this.state.user.notebooks || []
    notebooksList = notebooksList.map(notebook => {
      return (
        <div className='notebook' key={notebook.id}>
          <a href={`notebooks/${notebook.id}`}>
            {notebook.title || 'Untitled'}
          </a>
        </div>
      )
    })
    const display = (
      <React.Fragment>
        <section className='user-info'>
          <Grid container justify='center'>
            <div className='user-card'>
              <Avatar
                className='user-avatar'
                alt={this.state.user.name}
                src={this.state.user.avatar}
              />
              <h2>{name}</h2>
            </div>
          </Grid>
        </section>
        <section className='user-notebooks'>
          {notebooksList}
        </section>
      </React.Fragment>
    )
    return (
      <div>
        {
          this.state.caughtError ?
            <div className="preloader">
              Error Loading Profile
            </div>
          :
            this.state.user.id ?
              display
            :
              <div className="preloader">
                Loading Please Wait...
              </div>
        }
      </div>
    )
  }

}

export default UserPage
