import React from "react";
import "./createButton.css";

const CreateButton = ({
  children,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`createButton ${className}`}
    >
      {children}
    </button>
  );
};

export default CreateButton;
