import "./statisticsButton.css";

export default function StatisticsButton({ isActive, onClick }) {
  return (
    <button
      className={`statisticsButton ${
        isActive ? "statisticsButton--active" : "statisticsButton--inactive"
      }`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      title="Перейти к статистике"
    >
      <p>Статистика</p>
    </button>
  );
}
