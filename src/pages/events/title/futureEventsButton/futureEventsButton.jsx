import "./futureEventsButton.css";

export default function futureEventsButton({ isActive, onClick }) {
  return (
    <button
      className={`futureEventsButton ${
        isActive ? "futureEventsButton--active" : "futureEventsButton--inactive"
      }`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      <p>Будущие</p>
    </button>
  );
}
