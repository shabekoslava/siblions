import React from "react";
import "./updateButton.css";

const UpdateButton = ({
  children,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`updateButton ${className}`}
    >
      {children}
    </button>
  );
};

export default UpdateButton;
