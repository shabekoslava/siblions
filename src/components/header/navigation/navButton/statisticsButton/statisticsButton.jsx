import "./statisticsButton.css";

export default function StaticticsButton({ isActive, onClick }) {
  return (
    <button
      className={`staticticsButton ${
        isActive ? "staticticsButton--active" : "staticticsButton--inactive"
      }`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      title="Перейти к статистике"
    >
      <p>Статистика</p>
    </button>
  );
}
