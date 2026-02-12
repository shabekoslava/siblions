import React from "react";
import "./titleWithAddButton.css";
import addEventIcon from "../../../../assets/addEventButton.svg";

export default function TitleWithAddButton({ title, onAddClick }) {
  return (
    <div className="titleWithAddButton">
      <h1 className="titleWithAddButton__title">{title}</h1>

      <button
        className="titleWithAddButton__iconButton"
        onClick={onAddClick}
        aria-label="Добавить мероприятие"
      >
        <img src={addEventIcon} alt="" />
      </button>
    </div>
  );
}
