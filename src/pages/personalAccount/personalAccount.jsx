import React, { useState, useEffect } from "react";
import "./personalAccount.css";

const PersonalAccountPage = () => {
  const [userData, setUserData] = useState({
    fullName: "Иванов Иван Иванович",
    position: "Администратор",
    organization: "ТПУ",
  });

  // Загружаем данные пользователя (если есть в localStorage)
  useEffect(() => {
    const savedData = localStorage.getItem("userData");
    if (savedData) {
      setUserData(JSON.parse(savedData));
    }
  }, []);

  // Сохраняем изменения
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  return (
    <section className="personalAccountPage">
      {/* Заголовок страницы */}
      <h1 className="personalAccountTitle">Личный кабинет</h1>

      {/* Основное окно с информацией */}
      <div className="accountInfoContainer">
        {/* Верхняя строка: ФИО и должность */}
        <div className="accountHeader">
          {/* ФИО слева */}
          <h2 className="accountName">{userData.fullName}</h2>

          {/* Должность и организация справа */}
          <div className="accountPosition">
            <p className="positionTitle">
              {userData.position} | {userData.organization}
            </p>
          </div>
        </div>

        <div className="accountSections">
          <button
            type="button"
            className="accountLogoutBtn"
            onClick={() => {
              localStorage.removeItem("userData");
              alert("Вы вышли из аккаунта");
            }}
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </section>
  );
};

export default PersonalAccountPage;
