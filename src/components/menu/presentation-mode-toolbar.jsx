import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ViewModeToggleButton from './view-mode-toggle-button';

export class PresentationModeToolbarUnconnected extends React.Component {
  static propTypes = {
    viewMode: PropTypes.string,
  }

  render() {
    return (
      <div className="presentation-menu" style={{ display: (this.props.viewMode === 'presentation' ? 'block' : 'none') }} >
        <div className="presentation-header">
          <div className="view-mode-toggle-from-presentation">
            <ViewModeToggleButton textColor="black" />
          </div>
        </div>
      </div>

    );
  }
}

export function mapStateToProps(state) {
  return {
    viewMode: state.viewMode,
  };
}

export default connect(mapStateToProps)(PresentationModeToolbarUnconnected);
