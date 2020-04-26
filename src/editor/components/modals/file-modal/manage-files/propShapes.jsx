import PropTypes from "prop-types";

export const fileShape = {
  // Required
  filename: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,

  // Not required
  errorMessage: PropTypes.string
};
