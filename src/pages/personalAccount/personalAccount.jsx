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

        {/* Пример контента внутри рамки */}
        <div className="accountSections">
          <div className="sectionContent">
            <h3 className="sectionTitle">Пример информации</h3>
            <p className="exampleData">
              Здесь может быть любая информация о пользователе: контакты, роли,
              настройки и т.д.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalAccountPage;
