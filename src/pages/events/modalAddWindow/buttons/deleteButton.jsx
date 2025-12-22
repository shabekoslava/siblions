import React from "react";
import "./deleteButton.css";

const DeleteButton = ({
  children,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`deleteButton ${className}`}
    >
      {children}
    </button>
  );
};

export default DeleteButton;
