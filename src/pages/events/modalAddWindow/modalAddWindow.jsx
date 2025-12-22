import React, { useEffect, useRef, useState } from "react";
import "./modalAddWindow.css";
import CreateButton from "./buttons/createButton.jsx";
import UpdateButton from "./buttons/updateButton.jsx";
import DeleteButton from "./buttons/deleteButton.jsx";

const ModalAddWindow = ({
  onClose,
  onSubmit,
  onDelete,
  eventToEdit = null,
  mode = "create",
}) => {
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    description: "",
    tasks: "",
    organizers: "", // Новое поле
    points: "",
  });

  useEffect(() => {
    if (mode === "edit" && eventToEdit) {
      setFormData({
        title: eventToEdit.title || "",
        location: eventToEdit.location || "",
        date: eventToEdit.date || "",
        time: eventToEdit.time || "",
        description: eventToEdit.description || "",
        tasks: eventToEdit.tasks || "",
        organizers: eventToEdit.organizers || "", // Новое поле
        points: eventToEdit.points || "",
      });
    }
  }, [mode, eventToEdit]);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    const onClickOutside = (e) =>
      modalRef.current && !modalRef.current.contains(e.target) && onClose();

    document.addEventListener("keydown", onEsc);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Вы уверены, что хотите удалить это мероприятие?")) {
      onDelete();
      onClose();
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalWindow" ref={modalRef}>
        <form className="modalContent" onSubmit={handleSubmit}>
          {/* Название мероприятия */}
          <div className="formGroup">
            <label className="formLabel required">
              Наименование мероприятия
            </label>
            <input
              name="title"
              placeholder="Введите название мероприятия"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Адрес проведения */}
          <div className="formGroup">
            <label className="formLabel">Адрес проведения</label>
            <input
              name="location"
              placeholder="Введите адрес проведения"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Дата проведения */}
          <div className="formGroup">
            <label className="formLabel required">Дата проведения</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Время проведения */}
          <div className="formGroup">
            <label className="formLabel">Время проведения</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          {/* Описание мероприятия */}
          <div className="formGroup">
            <label className="formLabel">Описание мероприятия</label>
            <textarea
              name="description"
              placeholder="Введите описание мероприятия"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Задачи на мероприятие */}
          <div className="formGroup">
            <label className="formLabel">Задачи на мероприятие</label>
            <textarea
              name="tasks"
              placeholder="Опишите задачи на мероприятие"
              value={formData.tasks}
              onChange={handleChange}
              rows={2}
            />
          </div>

          {/* Организаторы */}
          <div className="formGroup">
            <label className="formLabel">Организаторы</label>
            <textarea
              name="organizers"
              placeholder="Введите организаторов мероприятия"
              value={formData.organizers}
              onChange={handleChange}
              rows={2}
            />
          </div>

          {/* Количество баллов */}
          <div className="formGroup">
            <label className="formLabel required">
              Количество баллов за мероприятие
            </label>
            <input
              type="number"
              name="points"
              placeholder="Введите количество баллов"
              value={formData.points}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          {/* Кнопки */}
          <div
            className={`modalButtonsWrapper ${
              mode === "edit" ? "two-buttons" : "one-button"
            }`}
          >
            {mode === "create" ? (
              <CreateButton type="submit">Создать</CreateButton>
            ) : (
              <>
                <UpdateButton type="submit">Сохранить</UpdateButton>
                <DeleteButton type="button" onClick={handleDelete}>
                  Удалить
                </DeleteButton>
              </>
            )}
          </div>

          <div className="modalBottomBorder" />
        </form>
      </div>
    </div>
  );
};

export default ModalAddWindow;
