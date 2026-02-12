import React, { useEffect, useRef, useState } from "react";
import "./modalAddWindow.css";
import CreateButton from "./buttons/createButton.jsx";
import UpdateButton from "./buttons/updateButton.jsx";
import DeleteButton from "./buttons/deleteButton.jsx";
import CustomSelect from "./CustomSelect.jsx";

const SPORT_TYPES = [
  "Альпинизм", "Бадминтон", "Баскетбол", "Баскетбол 3x3", "Бокс", "Боулинг",
  "Велоспорт", "Волейбол", "Гандбол", "Гиревой спорт", "Гребля", "Дартс",
  "Джиу джитсу", "Кёрлинг", "Киберспорт", "Микрофутзал", "Настольный теннис",
  "Образовательное мероприятие", "Пауэрлифтинг", "Перетягивание каната",
  "Плавание", "Пулевая стрельба", "Самбо", "Скалолазание",
  "Спортивное ориентирование", "Спортивное программирование",
  "Спортивный туризм", "Стрельба из лука", "Теннис", "Тхэквондо",
  "Тяжелая атлетика", "Фиджитал-спорт", "Флаинг диск", "Футбол",
  "Футзал", "Шахматы", "Шашки", "Эстафета ГТО",
];

const EVENT_LEVELS = [
  "Общежитие", "Инженерная школа", "Университет",
  "Регион", "Федеральный округ", "Россия",
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 МБ

const ModalAddWindow = ({
  onClose,
  onSubmit,
  onDelete,
  eventToEdit = null,
  mode = "create",
}) => {
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);
  const descriptionRef = useRef(null);
  const tasksRef = useRef(null);
  const organizersRef = useRef(null);

  const resizeTextarea = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.max(111, el.scrollHeight) + "px";
  };

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    sportType: "",
    eventLevel: "",
    description: "",
    tasks: "",
    organizers: "",
    points: "",
    attachedFileName: "",
    attachedFileData: "",
  });

  useEffect(() => {
    if (mode === "edit" && eventToEdit) {
      setFormData({
        title: eventToEdit.title || "",
        location: eventToEdit.location || "",
        date: eventToEdit.date || "",
        time: eventToEdit.time || "",
        sportType: eventToEdit.sportType || "",
        eventLevel: eventToEdit.eventLevel || "",
        description: eventToEdit.description || "",
        tasks: eventToEdit.tasks || "",
        organizers: eventToEdit.organizers || "",
        points: eventToEdit.points || "",
        attachedFileName: eventToEdit.attachedFileName || "",
        attachedFileData: eventToEdit.attachedFileData || "",
      });
    }
  }, [mode, eventToEdit]);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      [descriptionRef.current, tasksRef.current, organizersRef.current].forEach(
        resizeTextarea
      );
    });
    return () => cancelAnimationFrame(timer);
  }, [formData.description, formData.tasks, formData.organizers]);

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
    if (e.target.tagName === "TEXTAREA") {
      resizeTextarea(e.target);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFormData((p) => ({ ...p, attachedFileName: "", attachedFileData: "" }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("Файл слишком большой. Максимум 2 МБ.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((p) => ({
        ...p,
        attachedFileName: file.name,
        attachedFileData: reader.result,
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveFile = () => {
    setFormData((p) => ({ ...p, attachedFileName: "", attachedFileData: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
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
          {/* 1. Название мероприятия */}
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

          {/* 2. Вид спорта */}
          <div className="formGroup">
            <label className="formLabel">Вид спорта</label>
            <CustomSelect
              name="sportType"
              value={formData.sportType}
              onChange={handleChange}
              options={SPORT_TYPES}
              placeholder="Выберите вид спорта"
            />
          </div>

          {/* 3. Уровень мероприятия */}
          <div className="formGroup">
            <label className="formLabel required">Уровень мероприятия</label>
            <CustomSelect
              name="eventLevel"
              value={formData.eventLevel}
              onChange={handleChange}
              options={EVENT_LEVELS}
              placeholder="Выберите уровень"
              required
            />
          </div>

          {/* 4. Дата проведения */}
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

          {/* 5. Время проведения */}
          <div className="formGroup">
            <label className="formLabel">Время проведения</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          {/* 6. Адрес проведения */}
          <div className="formGroup">
            <label className="formLabel">Адрес проведения</label>
            <input
              name="location"
              placeholder="Введите адрес проведения"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* 7. Описание мероприятия */}
          <div className="formGroup">
            <label className="formLabel">Описание мероприятия (можно несколько строк)</label>
            <textarea
              ref={descriptionRef}
              name="description"
              placeholder="Введите описание мероприятия"
              value={formData.description}
              onChange={handleChange}
              rows={1}
            />
          </div>

          {/* 8. Задачи на мероприятие */}
          <div className="formGroup">
            <label className="formLabel">Задачи на мероприятие (можно несколько строк)</label>
            <textarea
              ref={tasksRef}
              name="tasks"
              placeholder="Опишите задачи на мероприятие"
              value={formData.tasks}
              onChange={handleChange}
              rows={1}
            />
          </div>

          {/* 9. Организаторы */}
          <div className="formGroup">
            <label className="formLabel">Организаторы (можно несколько строк)</label>
            <textarea
              ref={organizersRef}
              name="organizers"
              placeholder="Введите организаторов мероприятия"
              value={formData.organizers}
              onChange={handleChange}
              rows={1}
            />
          </div>

          {/* 10. Количество баллов */}
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

          {/* Прикрепить документ */}
          <div className="formGroup">
            <label className="formLabel">Прикрепить документ</label>
            <div className="formFileRow">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="formFileInput"
                id="event-attachment"
              />
              <label
                htmlFor="event-attachment"
                className={`formFileLabel ${formData.attachedFileName ? "formFileLabel--hasFile" : ""}`}
              >
                {formData.attachedFileName || "Выберите файл"}
              </label>
              {formData.attachedFileName && (
                <button
                  type="button"
                  className="formFileRemove"
                  onClick={handleRemoveFile}
                  aria-label="Удалить файл"
                >
                  Удалить
                </button>
              )}
            </div>
            <span className="formFileHint">Макс. 2 МБ. PDF, DOC, TXT, изображения.</span>
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
