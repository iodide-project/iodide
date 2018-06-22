import React from 'react';
import PropTypes from 'prop-types';

function toSize(bytes) {
  const KB = 1000;
  const MB = KB * 1000;
  const GB = MB * 1000;
  const roundToTwo = (v, mag) => Math.round((100 * v) / mag) / 100;
  if (Math.floor(bytes / GB) > 0) return `${roundToTwo(bytes, GB)}gb`;
  if (Math.floor(bytes / MB) > 0) return `${roundToTwo(bytes, MB)}mb`;
  if (Math.floor(bytes / KB) > 0) return `${roundToTwo(bytes, KB)}kb`;
  return `${bytes} bytes`;
}

export class FrozenVariable extends React.Component {
    static propTypes = {
      byteLength: PropTypes.number,
      varName: PropTypes.string,
    }
    render() {
      return (
        <React.Fragment>
          <div className="frozen-variable-name">
            {
                this.props.varName
            }
          </div>
          <div className="frozen-variable-value">
            {
                toSize(this.props.byteLength)
          }
          </div>
        </React.Fragment>);
    }
}

