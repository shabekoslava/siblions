import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import "./EventCard.css";
import EventParticipantsTable from "./EventParticipantsTable";
import changeButtonIcon from "../../../assets/changeButtonSmall.svg";
import addIcon from "../../../assets/addEventButton.svg";
import {
  getParticipantsForEvent,
  saveEventPoints,
  getTotalPointsForParticipant,
  addParticipant,
} from "../../../utils/participantsManager";

const EventCard = ({ event, onEdit }) => {
  const [participants, setParticipants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    group: "",
    school: "",
  });

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

  const handleAddParticipant = (e) => {
    e.preventDefault();
    if (!newParticipant.name.trim()) return;

    const created = addParticipant(
      newParticipant.name.trim(),
      newParticipant.group.trim(),
      newParticipant.school.trim()
    );

    setParticipants((prev) => [
      ...prev,
      { ...created, points: 0 },
    ]);

    setNewParticipant({ name: "", group: "", school: "" });
    setShowAddForm(false);
  };

  const participantTotals = useMemo(() => {
    const m = {};
    participants.forEach((p) => {
      m[p.id] = getTotalPointsForParticipant(p.id);
    });
    return m;
  }, [participants, refreshKey]);

  const handleExportExcel = () => {
    const rows = participants.map((p, i) => ({
      "№": i + 1,
      "ФИО": p.name,
      "Группа": p.group,
      "Школа": p.school,
      "Баллы": p.points,
      "Общие баллы": participantTotals[p.id] ?? 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Участники");

    // Автоширина колонок
    const colWidths = Object.keys(rows[0] || {}).map((key) => ({
      wch: Math.max(
        key.length,
        ...rows.map((r) => String(r[key]).length)
      ) + 2,
    }));
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(workbook, `Участники — ${event.title}.xlsx`);
  };

  const handlePointsChange = (participantId, points) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId ? { ...p, points } : p
      )
    );
  };

  const handleSaveResults = () => {
    saveEventPoints(event.id, participants);
    setRefreshKey((k) => k + 1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      {showToast && (
        <div className="eventCard__toast">Результаты сохранены</div>
      )}
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

      {/* Вид спорта */}
      {event.sportType && (
        <div className="eventCard__sportTypeSection">
          <h2 className="eventCard__sectionTitle">Вид спорта</h2>
          <p className="eventCard__sportType">{event.sportType}</p>
        </div>
      )}

      {/* Уровень мероприятия */}
      {event.eventLevel && (
        <div className="eventCard__eventLevelSection">
          <h2 className="eventCard__sectionTitle">Уровень мероприятия</h2>
          <p className="eventCard__eventLevel">{event.eventLevel}</p>
        </div>
      )}

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

      {/* Прикреплённый документ */}
      {event.attachedFileName && event.attachedFileData && (
        <div className="eventCard__attachmentSection">
          <h2 className="eventCard__sectionTitle">Прикреплённый документ</h2>
          <a
            href={event.attachedFileData}
            download={event.attachedFileName}
            className="eventCard__attachmentLink"
          >
            {event.attachedFileName}
          </a>
        </div>
      )}

      {/* Таблица участников */}
      <div className="eventCard__participantsSection">
        <div className="eventCard__participantsHeader">
          <h2 className="eventCard__sectionTitle">Участники мероприятия</h2>
          <div className="eventCard__participantsActions">
            <button
              className="eventCard__addParticipantBtn"
              onClick={() => setShowAddForm((prev) => !prev)}
              aria-label="Добавить участника"
            >
              <img src={addIcon} alt="Добавить" />
            </button>
            <button
              className="eventCard__exportBtn"
              onClick={handleExportExcel}
            >
              Выгрузить в Excel
            </button>
            <button
              className="eventCard__saveBtn"
              onClick={handleSaveResults}
            >
              Сохранить результаты
            </button>
          </div>
        </div>

        {showAddForm && (
          <form
            className="eventCard__addParticipantForm"
            onSubmit={handleAddParticipant}
          >
            <input
              type="text"
              className="eventCard__addParticipantInput"
              placeholder="ФИО *"
              value={newParticipant.name}
              onChange={(e) =>
                setNewParticipant((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            <input
              type="text"
              className="eventCard__addParticipantInput"
              placeholder="Группа"
              value={newParticipant.group}
              onChange={(e) =>
                setNewParticipant((prev) => ({
                  ...prev,
                  group: e.target.value,
                }))
              }
            />
            <input
              type="text"
              className="eventCard__addParticipantInput"
              placeholder="Школа"
              value={newParticipant.school}
              onChange={(e) =>
                setNewParticipant((prev) => ({
                  ...prev,
                  school: e.target.value,
                }))
              }
            />
            <button type="submit" className="eventCard__addParticipantSubmit">
              Добавить
            </button>
          </form>
        )}

        <EventParticipantsTable
          participants={participants}
          onPointsChange={handlePointsChange}
          participantTotals={participantTotals}
        />
      </div>
    </div>
    </>
  );
};

export default EventCard;
