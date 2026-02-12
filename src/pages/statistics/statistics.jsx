import React, { useState, useEffect } from "react";
import "./statistics.css";

const StatisticsPage = () => {
  const [statisticsData, setStatisticsData] = useState({
    period: "Январь 2024",
    totalEvents: 0,
    totalParticipants: 0,
    totalOrders: 0,
    avgEventRating: 0,
    topEvents: [],
    recentOrders: [],
  });

  // Загружаем данные статистики
  useEffect(() => {
    const loadStatistics = () => {
      // Здесь можно загрузить данные из API или localStorage
      const savedStats = localStorage.getItem("statisticsData");
      if (savedStats) {
        return JSON.parse(savedStats);
      }

      // Тестовые данные
      return {
        period: "Январь 2024",
        totalEvents: 24,
        totalParticipants: 186,
        totalOrders: 42,
        avgEventRating: 4.7,
        topEvents: [
          { id: 1, name: "Хакатон 2024", participants: 45, rating: 4.9 },
          {
            id: 2,
            name: "Встреча разработчиков",
            participants: 32,
            rating: 4.8,
          },
          {
            id: 3,
            name: "Мастер-класс по React",
            participants: 28,
            rating: 4.7,
          },
          { id: 4, name: "IT-конференция", participants: 41, rating: 4.6 },
        ],
        recentOrders: [
          {
            id: 1,
            date: "15.01.2024",
            product: "Футболка",
            status: "Получен",
            amount: 1200,
          },
          {
            id: 2,
            date: "18.01.2024",
            product: "Блокнот",
            status: "Собран",
            amount: 500,
          },
          {
            id: 3,
            date: "20.01.2024",
            product: "Ручка",
            status: "В обработке",
            amount: 200,
          },
          {
            id: 4,
            date: "22.01.2024",
            product: "Браслет",
            status: "Получен",
            amount: 800,
          },
        ],
      };
    };

    setStatisticsData(loadStatistics());
  }, []);

  // Сохраняем данные
  useEffect(() => {
    localStorage.setItem("statisticsData", JSON.stringify(statisticsData));
  }, [statisticsData]);

  const handleExportPDF = () => {
    alert("Экспорт в PDF");
    // Реализация экспорта в PDF
  };

  const handleExportExcel = () => {
    alert("Экспорт в Excel");
    // Реализация экспорта в Excel
  };

  return (
    <section className="statisticsPage">
      {/* Заголовок страницы */}
      <h1 className="statisticsTitle">Статистика</h1>

      {/* Основное окно с информацией */}
      <div className="statisticsInfoContainer">
        {/* Верхняя строка: заголовок и период */}
        <div className="statisticsHeader">
          {/* Заголовок слева */}
          <h2 className="statisticsMainTitle">Общая статистика</h2>

          {/* Период справа */}
          <div className="statisticsPeriod">
            <p className="periodTitle">Период: {statisticsData.period}</p>
          </div>
        </div>

        {/* Сетка с основными показателями */}
        <div className="statisticsGrid">
          <div className="statCard">
            <h3 className="statCardTitle">Всего мероприятий</h3>
            <p className="statCardValue">{statisticsData.totalEvents}</p>
            <p className="statCardDescription">За текущий период</p>
          </div>

          <div className="statCard">
            <h3 className="statCardTitle">Участников</h3>
            <p className="statCardValue">{statisticsData.totalParticipants}</p>
            <p className="statCardDescription">Общее количество</p>
          </div>

          <div className="statCard">
            <h3 className="statCardTitle">Заказов</h3>
            <p className="statCardValue">{statisticsData.totalOrders}</p>
            <p className="statCardDescription">Товары и услуги</p>
          </div>

          <div className="statCard">
            <h3 className="statCardTitle">Средний рейтинг</h3>
            <p className="statCardValue">{statisticsData.avgEventRating}/5.0</p>
            <p className="statCardDescription">Оценка мероприятий</p>
          </div>
        </div>

        {/* График/Диаграмма */}
        <div className="chartContainer">
          <h3 className="chartTitle">Активность по месяцам</h3>
          <div className="chartPlaceholder">
            <p className="chartPlaceholderText">
              Здесь будет отображаться график активности
            </p>
          </div>
        </div>

        {/* Таблица популярных мероприятий */}
        <div className="statisticsTableContainer">
          <h3 className="chartTitle" style={{ marginBottom: "20px" }}>
            Топ мероприятий
          </h3>
          <table className="statisticsTable">
            <thead>
              <tr>
                <th>Мероприятие</th>
                <th>Участники</th>
                <th>Рейтинг</th>
              </tr>
            </thead>
            <tbody>
              {statisticsData.topEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.participants}</td>
                  <td>{event.rating}/5.0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Таблица последних заказов */}
        <div className="statisticsTableContainer">
          <h3 className="chartTitle" style={{ marginBottom: "20px" }}>
            Последние заказы
          </h3>
          <table className="statisticsTable">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Товар</th>
                <th>Статус</th>
                <th>Сумма</th>
              </tr>
            </thead>
            <tbody>
              {statisticsData.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.date}</td>
                  <td>{order.product}</td>
                  <td>{order.status}</td>
                  <td>{order.amount} ₽</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Кнопки экспорта */}
        <div className="exportButtons">
          <button className="exportButton" onClick={handleExportPDF}>
            📄 Экспорт в PDF
          </button>
          <button className="exportButton" onClick={handleExportExcel}>
            📊 Экспорт в Excel
          </button>
        </div>
      </div>
    </section>
  );
};

export default StatisticsPage;
