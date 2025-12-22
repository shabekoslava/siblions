// Центральная база всех участников
const getAllParticipants = () => {
  const saved = localStorage.getItem("all_participants");
  if (saved) {
    return JSON.parse(saved);
  }

  // Начальные данные участников (одинаковые для всех мероприятий)
  const initialParticipants = [
    { id: 1, name: "Иванов Иван", group: "Группа 1", school: "Школа №1" },
    { id: 2, name: "Петров Петр", group: "Группа 2", school: "Школа №2" },
    { id: 3, name: "Сидорова Анна", group: "Группа 1", school: "Школа №1" },
    { id: 4, name: "Кузнецов Алексей", group: "Группа 3", school: "Школа №3" },
    { id: 5, name: "Смирнова Мария", group: "Группа 2", school: "Школа №2" },
    { id: 6, name: "Федоров Дмитрий", group: "Группа 1", school: "Школа №1" },
    { id: 7, name: "Николаева Елена", group: "Группа 3", school: "Школа №3" },
  ];

  localStorage.setItem("all_participants", JSON.stringify(initialParticipants));
  return initialParticipants;
};

// Получить посещаемость для конкретного мероприятия
const getEventAttendance = (eventId) => {
  const saved = localStorage.getItem(`event_${eventId}_attendance`);
  return saved ? JSON.parse(saved) : {};
};

// Обновить посещаемость участника
const updateAttendance = (eventId, participantId, attended, eventPoints) => {
  const eventAttendance = getEventAttendance(eventId);

  // Обновляем посещаемость для этого мероприятия
  eventAttendance[participantId] = attended;

  // Сохраняем посещаемость
  localStorage.setItem(
    `event_${eventId}_attendance`,
    JSON.stringify(eventAttendance)
  );

  // Обновляем баллы для отображения
  return { attended, points: attended ? eventPoints : 0 };
};

// Получить участников для мероприятия с их текущим статусом
const getParticipantsForEvent = (eventId, eventPoints) => {
  const allParticipants = getAllParticipants();
  const eventAttendance = getEventAttendance(eventId);

  return allParticipants.map((participant) => {
    const attended = eventAttendance[participant.id] || false;
    return {
      ...participant,
      attended: attended,
      points: attended ? eventPoints || 0 : 0,
    };
  });
};

export {
  getAllParticipants,
  getEventAttendance,
  updateAttendance,
  getParticipantsForEvent,
};
