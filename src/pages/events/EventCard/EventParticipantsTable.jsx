import React from "react";
import "./EventParticipantsTable.css";

const EventParticipantsTable = ({ participants, onCheckboxChange }) => {
  return (
    <div className="participantsTable">
      <div className="tableHeader">
        <div className="tableRow">
          <div className="tableCell number">№</div>
          <div className="tableCell name">ФИО</div>
          <div className="tableCell group">Группа</div>
          <div className="tableCell school">Школа</div>
          <div className="tableCell attended">Отметка</div>
          <div className="tableCell points">Баллы</div>
        </div>
      </div>

      <div className="tableBody">
        {participants.map((participant, index) => (
          <div key={participant.id} className="tableRow">
            <div className="tableCell number">{index + 1}</div>
            <div className="tableCell name">{participant.name}</div>
            <div className="tableCell group">{participant.group}</div>
            <div className="tableCell school">{participant.school}</div>
            <div className="tableCell attended">
              <input
                type="checkbox"
                checked={participant.attended}
                onChange={() => onCheckboxChange(participant.id)}
                className="attendanceCheckbox"
              />
            </div>
            <div className="tableCell points">{participant.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventParticipantsTable;
