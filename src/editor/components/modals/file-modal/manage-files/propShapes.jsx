import PropTypes from "prop-types";

export const fileShape = {
  // Required
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,

  // Not required
  errorMessage: PropTypes.string
};
