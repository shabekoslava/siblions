import React, { useState, useEffect } from "react";
import "./EventCard.css";
import EventParticipantsTable from "./EventParticipantsTable";
import changeButtonIcon from "../../../assets/changeButtonSmall.svg";
import {
  getParticipantsForEvent,
  updateAttendance,
} from "../../../utils/participantsManager";

const EventCard = ({ event, onEdit }) => {
  const [participants, setParticipants] = useState([]);

  // Загружаем участников для этого мероприятия
  useEffect(() => {
    const eventParticipants = getParticipantsForEvent(
      event.id,
      event.points || 0
    );
    setParticipants(eventParticipants);
  }, [event.id, event.points]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  const handleCheckboxChange = (participantId) => {
    const participant = participants.find((p) => p.id === participantId);
    if (!participant) return;

    const newAttendedStatus = !participant.attended;

    // Обновляем в центральном хранилище
    const updatedData = updateAttendance(
      event.id,
      participantId,
      newAttendedStatus,
      event.points || 0
    );

    // Обновляем локальное состояние
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId
          ? {
              ...p,
              attended: newAttendedStatus,
              points: updatedData.points,
            }
          : p
      )
    );
  };

  return (
    <div className="eventCard">
      {/* Верхняя строка: заголовок, кнопка редактирования, адрес и дата */}
      <div className="eventCard__header">
        <div className="eventCard__titleSection">
          <h1 className="eventCard__title">{event.title}</h1>
          <button
            className="eventCard__editIconButton"
            onClick={() => onEdit(event)}
            aria-label="Редактировать мероприятие"
          >
            <img src={changeButtonIcon} alt="Редактировать" />
          </button>
        </div>

        <div className="eventCard__headerInfo">
          <div className="eventCard__locationDate">
            <span className="eventCard__location">{event.location}</span>
            <span className="eventCard__separator"> | </span>
            <span className="eventCard__date">{formatDate(event.date)}</span>
            {event.time && (
              <>
                <span className="eventCard__separator"> | </span>
                <span className="eventCard__time">
                  {formatTime(event.time)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Описание мероприятия */}
      {event.description && (
        <div className="eventCard__descriptionSection">
          <h2 className="eventCard__sectionTitle">Описание мероприятия</h2>
          <p className="eventCard__description">{event.description}</p>
        </div>
      )}

      {/* Задачи мероприятия */}
      {event.tasks && (
        <div className="eventCard__tasksSection">
          <h2 className="eventCard__sectionTitle">Задачи на мероприятие</h2>
          <p className="eventCard__tasks">{event.tasks}</p>
        </div>
      )}

      {/* Организаторы мероприятия */}
      {event.organizers && (
        <div className="eventCard__organizersSection">
          <h2 className="eventCard__sectionTitle">Организаторы</h2>
          <p className="eventCard__organizers">{event.organizers}</p>
        </div>
      )}

      {/* Информация о баллах */}
      <div className="eventCard__pointsSection">
        <h2 className="eventCard__sectionTitle">Баллы за мероприятие</h2>
        <p className="eventCard__pointsValue">{event.points || 0} баллов</p>
      </div>

      {/* Таблица участников */}
      <div className="eventCard__participantsSection">
        <h2 className="eventCard__sectionTitle">Участники мероприятия</h2>
        <EventParticipantsTable
          participants={participants}
          onCheckboxChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
};

export default EventCard;
