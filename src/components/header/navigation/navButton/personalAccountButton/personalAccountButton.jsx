import "./personalAccountButton.css";
import iconPersonalAccountActive from "/src/assets/profileButtonActive.svg";
import iconPersonalAccountInactive from "/src/assets/profileButtonInactive.svg";

export default function PersonalAccountButton({ isActive, onClick }) {
  return (
    <button
      className={`personalAccountButton ${
        isActive
          ? "personalAccountButton--active"
          : "personalAccountButton--inactive"
      }`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      title="Перейти в личный кабинет"
    >
      {isActive ? (
        <img src={iconPersonalAccountActive} alt="Личный кабинет (активно)" />
      ) : (
        <img src={iconPersonalAccountInactive} alt="Личный кабинет" />
      )}
    </button>
  );
}
