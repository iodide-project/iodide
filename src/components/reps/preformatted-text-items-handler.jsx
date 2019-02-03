import React from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";

const TextItems = styled("pre")`
  padding: 0;
  margin: 0;
`;

export default class PreformattedTextItemsHandler extends React.Component {
  static propTypes = {
    textItems: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired
      })
    )
  };

  render() {
    return (
      <TextItems>
        {this.props.textItems.map(t => (
          <React.Fragment key={t.id}>{t.text}</React.Fragment>
        ))}
      </TextItems>
    );
  }
}
