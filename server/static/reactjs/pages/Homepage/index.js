import React from 'react';
import './homepage.css'

class Homepage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notebooks: [],
    }
  }

  componentDidMount() {
    fetch('api/v1/notebooks')
    .then(response => response.json())
    .then(data => {
      let notebooks = data.map(notebook => {
        return (
          <div key={notebook.id}>
            <a href={`notebooks/${notebook.id}`}>
              {notebook.title || 'Untitled'}
            </a>
          </div>
        )
      })
      this.setState({notebooks})
    })
    .catch(error => console.error(error));
  }

  render() {
    return (
      <section>
        <div className='features-notebooks'>
          <h3>Featurred Notebooks</h3>
          List
        </div>
        <div className='notebooks-list'>
          <h3>All Notebooks</h3>
          {this.state.notebooks}
        </div>
      </section>
    )
  }

}

export default Homepage;
