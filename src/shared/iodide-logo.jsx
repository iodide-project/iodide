import React from 'react'
import { css } from 'emotion'

export default class IodideLogo extends React.Component {
  render() {
    return (
      <h2
        className={css`
          margin: 0;
          font-family: 'Zilla Slab', serif;
          font-size: 30px;
          font-weight: 300;`}
      >
        <a
          href={this.props.backLink}
          rel="noopener noreferrer"
          target="_blank"
          className={css`
            color: white;
            text-decoration: none;`}
        >
          Iodide
        </a>
      </h2>
    );
  }
}
