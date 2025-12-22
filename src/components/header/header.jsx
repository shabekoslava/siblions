import "./Header.css";
import Navigation from "./navigation/Navigation";
import logoSibLions from "../../assets/logoSibLions.svg";

export default function Header({ currentPage, onPageChange }) {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <header className="header" style={{ width: "1366px" }}>
        <div className="headerLogo" onClick={() => onPageChange("events")}>
          <img
            src={logoSibLions}
            alt="Логотип SibLions"
            className="logoImage"
          />
        </div>

        <Navigation currentPage={currentPage} onPageChange={onPageChange} />
      </header>
    </div>
  );
}
