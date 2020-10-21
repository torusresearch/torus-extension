import React from "react";
import PropTypes from "prop-types";

export default function Secure({ size, color }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 7H11.75V4.75C11.75 2.13125 9.61875 0 7 0C4.38125 0 2.25 2.13125 2.25 4.75V7H1.5C0.671875 7 0 7.67188 0 8.5V14.5C0 15.3281 0.671875 16 1.5 16H12.5C13.3281 16 14 15.3281 14 14.5V8.5C14 7.67188 13.3281 7 12.5 7ZM9.25 7H4.75V4.75C4.75 3.50937 5.75937 2.5 7 2.5C8.24063 2.5 9.25 3.50937 9.25 4.75V7Z"
        fill={color}
      />
    </svg>
  );
}

Secure.defaultProps = {
  color: "#000000",
  size: 20,
};

Secure.propTypes = {
  size: PropTypes.number.isRequired,
  color: PropTypes.string,
};
