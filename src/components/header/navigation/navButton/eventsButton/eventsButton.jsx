import "./eventsButton.css";

export default function EventsButton({ isActive, onClick }) {
  return (
    <button
      className={`eventsButton ${
        isActive ? "eventsButton--active" : "eventsButton--inactive"
      }`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      title="Перейти к мероприятиям"
    >
      <p>Мероприятия</p>
    </button>
  );
}
