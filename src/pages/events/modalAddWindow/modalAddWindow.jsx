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

const getMaxEventDate = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 3);
  return d.toISOString().slice(0, 10);
};

const ModalAddWindow = ({
  onClose,
  onSubmit,
  onDelete,
  eventToEdit = null,
  mode = "create",
}) => {
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
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

  const fileDialogOpenRef = useRef(false);

  const scrollPosRef = useRef(0);

  useEffect(() => {
    const onWindowBlur = () => {
      if (fileDialogOpenRef.current && formRef.current) {
        scrollPosRef.current = formRef.current.scrollTop;
      }
    };
    const onWindowFocus = () => {
      if (fileDialogOpenRef.current) {
        if (formRef.current) {
          formRef.current.scrollTop = scrollPosRef.current;
        }
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.scrollTop = scrollPosRef.current;
          }
          fileDialogOpenRef.current = false;
        }, 100);
      }
    };
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("focus", onWindowFocus);
    return () => {
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("focus", onWindowFocus);
    };
  }, []);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);
  const handleOverlayClick = (e) => {
    if (fileDialogOpenRef.current) return;
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (e.target.tagName === "TEXTAREA") {
      resizeTextarea(e.target);
    }
  };

  const [fileError, setFileError] = useState("");

  const handleFileClick = () => {
    fileDialogOpenRef.current = true;
    if (formRef.current) {
      scrollPosRef.current = formRef.current.scrollTop;
    }
  };

  const handleFileChange = (e) => {
    fileDialogOpenRef.current = false;
    const file = e.target.files?.[0];
    
    if (!file) {
      setFileError("");
      return;
    }

    // Проверка размера
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Файл слишком большой. Максимум 2 МБ.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      // Сбрасываем имя файла в стейте, чтобы не висело старое
      setFormData(p => ({ ...p, attachedFileName: "", attachedFileData: "" }));
      return;
    }

    setFileError("");
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((p) => ({
        ...p,
        attachedFileName: file.name,
        attachedFileData: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation(); // Важно: чтобы клик по "Удалить" не триггернул открытие файла
    setFormData((p) => ({ ...p, attachedFileName: "", attachedFileData: "" }));
    setFileError("");
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
    <div className="modalOverlay" onClick={handleOverlayClick}>
      <div 
        className="modalWindow" 
        ref={modalRef} 
        onClick={(e) => e.stopPropagation()} // Блокируем всплытие клика к оверлею
      >
        <form className="modalContent" ref={formRef} onSubmit={handleSubmit}>
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
              max={getMaxEventDate()}
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
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="formFileInput"
                id="event-attachment"
              />
              <label
                htmlFor="event-attachment"
                className={`formFileLabel ${formData.attachedFileName ? "formFileLabel--hasFile" : ""}`}
                onClick={handleFileClick}
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
            <span className="formFileHint">Макс. 2 МБ. PDF, DOC, DOCX, TXT.</span>
            {fileError && <span className="formFileError">{fileError}</span>}
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
