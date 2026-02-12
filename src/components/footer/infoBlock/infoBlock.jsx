import "./infoBlock.css";

export default function InfoBlock({ onPageChange }) {
  const handleNavClick = (page) => {
    if (onPageChange) {
      onPageChange(page); // Меняем состояние в App
      window.scrollTo({ top: 0, behavior: "smooth" }); // Плавно листаем вверх
    }
  };

  return (
    <div className="infoBlock">
      <nav className="infoBlockMenu">
        {/* Кликабельный пункт */}
        <span
          className="infoBlockMenuItem clickable"
          onClick={() => handleNavClick("events")}
        >
          МЕРОПРИЯТИЯ
        </span>

        {/* Кликабельный пункт */}
        <span
          className="infoBlockMenuItem clickable"
          onClick={() => handleNavClick("personalAccount")}
        >
          ЛИЧНЫЙ КАБИНЕТ
        </span>

        {/* Обычный текст без обработчика клика */}
        <span className="infoBlockMenuItem">МАГАЗИН</span>

        <div className="infoBlockContactGroup">
          {/* Заголовок контактов без курсора */}
          <span className="infoBlockMenuItem contacts">КОНТАКТЫ</span>

          <div className="infoBlockContactsList">
            <div className="infoBlockContact">
              <span className="infoBlockRole">Руководитель</span>
              <span className="infoBlockPhone">+7 (XXXX) XX-XX-XX</span>
            </div>

            <div className="infoBlockContact">
              <span className="infoBlockRole">Пресс-служба</span>
              <span className="infoBlockPhone">+7 (XXXX) XX-XX-XX</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
