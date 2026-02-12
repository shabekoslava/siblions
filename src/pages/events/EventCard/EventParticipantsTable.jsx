import React from "react";
import "./EventParticipantsTable.css";

const EventParticipantsTable = ({
  participants,
  onPointsChange,
  participantTotals,
}) => {
  return (
    <div className="participantsTable">
      <div className="tableHeader">
        <div className="tableRow">
          <div className="tableCell number">№</div>
          <div className="tableCell name">ФИО</div>
          <div className="tableCell group">Группа</div>
          <div className="tableCell school">Школа</div>
          <div className="tableCell points">Баллы</div>
          <div className="tableCell total">Общие баллы</div>
        </div>
      </div>

      <div className="tableBody">
        {participants.map((participant, index) => (
          <div key={participant.id} className="tableRow">
            <div className="tableCell number">{index + 1}</div>
            <div className="tableCell name">{participant.name}</div>
            <div className="tableCell group">{participant.group}</div>
            <div className="tableCell school">{participant.school}</div>
            <div className="tableCell points">
              <input
                type="number"
                min={0}
                value={participant.points || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const num = val === "" ? 0 : Math.max(0, parseInt(val, 10) || 0);
                  onPointsChange(participant.id, num);
                }}
                className="pointsInput"
                placeholder="0"
              />
            </div>
            <div className="tableCell total">
              {participantTotals?.[participant.id] ?? 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventParticipantsTable;
