import "./pastEventsButton.css";

export default function pastEventsButton({ isActive, onClick }) {
  return (
    <button
      className={`pastEventsButton ${
        isActive ? "pastEventsButton--active" : "pastEventsButton--inactive"
      }`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      <p>Прошедшие</p>
    </button>
  );
}
