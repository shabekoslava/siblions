import React, { useState, useRef, useEffect } from "react";
import "./CustomSelect.css";

const CustomSelect = ({ name, value, onChange, options, placeholder, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedLabel = options.find((o) => o === value) || "";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange({ target: { name, value: option } });
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`customSelect ${isOpen ? "customSelect--open" : ""}`}
      ref={wrapperRef}
    >
      {/* Скрытый input для required валидации формы */}
      {required && (
        <input
          tabIndex={-1}
          className="customSelect__hiddenInput"
          value={value}
          required
          onChange={() => {}}
        />
      )}

      <button
        type="button"
        className="customSelect__trigger"
        onClick={handleToggle}
      >
        <span
          className={`customSelect__value ${!value ? "customSelect__value--placeholder" : ""}`}
        >
          {selectedLabel || placeholder || "Выберите..."}
        </span>
        <svg
          className="customSelect__arrow"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#003466"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="customSelect__dropdown">
          <div className="customSelect__list">
            {options.map((option) => (
              <div
                key={option}
                className={`customSelect__option ${option === value ? "customSelect__option--selected" : ""}`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
