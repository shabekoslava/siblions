import "./Footer.css";
import logoSibLions from "../../assets/logoSibLions.svg";
import InfoBlock from "/src/components/footer/infoBlock/infoBlock.jsx";

export default function Footer({ onPageChange }) {
  const handleLogoClick = () => {
    onPageChange("events");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer__fullwidth-bg">
        {/* Основной контент футера */}
        <div className="footer__centered-wrapper">
          <div className="footer__container">
            <div className="footer__content">
              <div
                className="footer__logo"
                onClick={handleLogoClick}
                role="button"
                aria-label="Перейти на главную"
              >
                <img
                  src={logoSibLions}
                  alt="Логотип"
                  className="footer__logo-image"
                />
              </div>

              <div className="footer__info-wrapper">
                <InfoBlock onPageChange={onPageChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Разделительная линия */}
        <div className="footer__centered-wrapper">
          <div className="footer__divider" />
        </div>

        {/* Копирайт */}
        <div className="footer__centered-wrapper">
          <div className="footer__container">
            <p className="footer__copyright">
              © 2025 Национальный исследовательский Томский политехнический
              университет
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
