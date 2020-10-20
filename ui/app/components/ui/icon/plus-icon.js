import React from "react";
import PropTypes from "prop-types";

export default function Plus({ size, color }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 10H15"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 5V15"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

Plus.defaultProps = {
  color: "#FFFFFF",
};

Plus.propTypes = {
  size: PropTypes.number.isRequired,
  color: PropTypes.string,
};
