import React, { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getParticipantsForEvent } from "../../utils/participantsManager";
import "./statistics.css";

const STATISTICS_DATE_KEY = "statisticsDateRange";

const getDefaultDateRange = () => {
  const saved = localStorage.getItem(STATISTICS_DATE_KEY);
  if (saved) {
    try {
      const { from, to } = JSON.parse(saved);
      if (from && to) return { from, to };
    } catch {}
  }
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    from: start.toISOString().slice(0, 10),
    to: end.toISOString().slice(0, 10),
  };
};

const STATUS_LABELS = {
  new: "Новый",
  processing: "В обработке",
  assembled: "Собран",
  ready: "Готов к выдаче",
  received: "Получен",
  cancelled: "Отменен",
};

const StatisticsPage = () => {
  const defaultRange = getDefaultDateRange();
  const [dateFrom, setDateFrom] = useState(defaultRange.from);
  const [dateTo, setDateTo] = useState(defaultRange.to);
  const reportRef = useRef(null);

  const saveDateRange = (from, to) => {
    localStorage.setItem(STATISTICS_DATE_KEY, JSON.stringify({ from, to }));
  };

  const reportData = useMemo(() => {
    const eventsJson = localStorage.getItem("events");
    const events = eventsJson ? JSON.parse(eventsJson) : [];

    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);

    const eventsInPeriod = events.filter((event) => {
      const d = new Date(event.date);
      return d >= from && d <= to;
    });

    let totalParticipants = 0;
    const uniqueParticipantIds = new Set();

    eventsInPeriod.forEach((event) => {
      const participants = getParticipantsForEvent(event.id, event.points || 0);
      participants.forEach((p) => {
        if ((p.points || 0) > 0) {
          uniqueParticipantIds.add(p.id);
          totalParticipants += 1;
        }
      });
    });

    const ordersJson = localStorage.getItem("ordersData");
    const orders = ordersJson ? JSON.parse(ordersJson) : [];

    const monthData = {};
    eventsInPeriod.forEach((event) => {
      const d = new Date(event.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!monthData[key]) {
        monthData[key] = {
          month: d.toLocaleDateString("ru-RU", { month: "short", year: "numeric" }),
          events: 0,
          participants: 0,
        };
      }
      monthData[key].events += 1;
      const participants = getParticipantsForEvent(event.id, event.points || 0);
      const attended = participants.filter((p) => (p.points || 0) > 0).length;
      monthData[key].participants += attended;
    });

    const chartData = Object.entries(monthData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);

    return {
      totalEvents: eventsInPeriod.length,
      totalParticipants: uniqueParticipantIds.size,
      totalParticipations: totalParticipants,
      allEvents: eventsInPeriod
        .map((event) => {
          const participants = getParticipantsForEvent(event.id, event.points || 0);
          const attended = participants.filter((p) => (p.points || 0) > 0).length;
          return {
            id: event.id,
            name: event.title,
            date: event.date,
            participants: attended,
          };
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
      chartData: chartData.length > 0 ? chartData : [{ month: "—", events: 0, participants: 0 }],
      ordersCount: orders.length,
    };
  }, [dateFrom, dateTo]);

  const handleExportPDF = () => {
    const el = reportRef.current;
    if (!el) return;
    const clone = el.cloneNode(true);
    clone.querySelectorAll("[data-pdf-exclude]").forEach((node) => node.remove());
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "position:fixed;left:-9999px;top:0;width:757px;";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);
    const opt = {
      margin: 5,
      filename: `Отчёт_${dateFrom}_${dateTo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1, width: 757, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf()
      .set(opt)
      .from(clone)
      .save()
      .finally(() => {
        if (wrapper.parentNode) document.body.removeChild(wrapper);
      })
      .catch(() => {
        if (wrapper.parentNode) document.body.removeChild(wrapper);
      });
  };

  const handleExportExcel = () => {
    const periodLabel = `${dateFrom} — ${dateTo}`;

    const summaryRows = [
      ["Отчёт за период", periodLabel],
      [""],
      ["Число мероприятий", reportData.totalEvents],
      ["Участники (общее количество)", reportData.totalParticipations],
      ["Участники (уникальные)", reportData.totalParticipants],
      ["Количество заказовов", reportData.ordersCount],
    ];

    const eventsRows = [
      ["№", "Мероприятие", "Дата", "Участники"],
      ...reportData.allEvents.map((e, i) => [
        i + 1,
        e.name,
        new Date(e.date).toLocaleDateString("ru-RU"),
        e.participants,
      ]),
    ];

    const chartDataForExport = reportData.chartData.filter((d) => d.month !== "—");
    const monthlyRows = [
      ["Период", "Мероприятия", "Участники"],
      ...chartDataForExport.map((d) => [d.month, d.events, d.participants]),
    ];

    const ordersJson = localStorage.getItem("ordersData");
    const orders = ordersJson ? JSON.parse(ordersJson) : [];
    const ordersRows = [
      ["№", "ФИО", "Группа", "Товары", "Статус"],
      ...orders.map((o) => [
        o.orderNumber,
        o.customer,
        o.group,
        (o.products || []).join("; "),
        STATUS_LABELS[o.status] || o.status,
      ]),
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
    const wsEvents = XLSX.utils.aoa_to_sheet(eventsRows);
    const wsMonthly = XLSX.utils.aoa_to_sheet(monthlyRows);
    const wsOrders = XLSX.utils.aoa_to_sheet(ordersRows);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, wsSummary, "Сводка");
    XLSX.utils.book_append_sheet(workbook, wsEvents, "Мероприятия");
    XLSX.utils.book_append_sheet(workbook, wsMonthly, "По месяцам");
    XLSX.utils.book_append_sheet(workbook, wsOrders, "Заказы");

    wsSummary["!cols"] = [{ wch: 35 }, { wch: 25 }];
    wsEvents["!cols"] = [{ wch: 6 }, { wch: 40 }, { wch: 14 }, { wch: 12 }];
    wsMonthly["!cols"] = [{ wch: 20 }, { wch: 14 }, { wch: 14 }];
    wsOrders["!cols"] = [{ wch: 6 }, { wch: 30 }, { wch: 12 }, { wch: 40 }, { wch: 18 }];

    const filename = `Отчёт_${dateFrom}_${dateTo}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  return (
    <section className="statisticsPage">
      <h1 className="statisticsTitle">Статистика</h1>

      <div className="statisticsInfoContainer">
        <div ref={reportRef} className="statisticsReportContent">
        <div className="statisticsHeader">
          <h2 className="statisticsMainTitle">Отчёт за указанный период</h2>
          <div className="statisticsPeriod">
            <div className="statisticsDateRange">
              <label className="statisticsDateLabel">
                С
                <input
                  type="date"
                  className="statisticsDateInput"
                  value={dateFrom}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDateFrom(v);
                    saveDateRange(v, dateTo);
                  }}
                />
              </label>
              <label className="statisticsDateLabel">
                По
                <input
                  type="date"
                  className="statisticsDateInput"
                  value={dateTo}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDateTo(v);
                    saveDateRange(dateFrom, v);
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="statisticsGrid">
          <div className="statCard">
            <h3 className="statCardTitle">Мероприятия</h3>
            <p className="statCardValue">{reportData.totalEvents}</p>
            <p className="statCardDescription">Общее количество</p>
          </div>

          <div className="statCard">
            <h3 className="statCardTitle">Участники</h3>
            <p className="statCardValue">{reportData.totalParticipations}</p>
            <p className="statCardDescription">Всего</p>
          </div>

          <div className="statCard">
            <h3 className="statCardTitle">Участники</h3>
            <p className="statCardValue">{reportData.totalParticipants}</p>
            <p className="statCardDescription">Уникальные</p>
          </div>

          <div className="statCard">
            <h3 className="statCardTitle">Заказы</h3>
            <p className="statCardValue">{reportData.ordersCount}</p>
            <p className="statCardDescription">Общее количество</p>
          </div>
        </div>

        <div className="chartContainer" data-pdf-exclude>
          <h3 className="chartTitle chartTitle--centered">Диаграмма мероприятий и участников по месяцам</h3>
          <div className="chartWrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontFamily: "Kontora", fontSize: 14, fill: "#64748b" }}
                />
                <YAxis
                  tick={{ fontFamily: "Kontora", fontSize: 14, fill: "#64748b" }}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: "Kontora",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                  formatter={(value, name) => [
                    value,
                    name === "events" ? "Мероприятия" : "Участники",
                  ]}
                  labelFormatter={(label) => `Период: ${label}`}
                />
                <Legend
                  wrapperStyle={{ fontFamily: "Kontora" }}
                  formatter={(value) =>
                    value === "events"
                      ? "Мероприятия"
                      : "Участники"
                  }
                />
                <Bar
                  dataKey="events"
                  fill="var(--blueColor)"
                  name="events"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="participants"
                  fill="#94a3b8"
                  name="participants"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="statisticsTableContainer">
          <h3 className="chartTitle" style={{ marginBottom: "20px" }}>
            Мероприятия за период
          </h3>
          {reportData.allEvents.length > 0 ? (
            <table className="statisticsTable">
              <thead>
                <tr>
                  <th>Мероприятие</th>
                  <th>Дата</th>
                  <th>Участников</th>
                </tr>
              </thead>
              <tbody>
                {reportData.allEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.name}</td>
                    <td>
                      {new Date(event.date).toLocaleDateString("ru-RU")}
                    </td>
                    <td>{event.participants}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="statisticsEmptyText">Нет мероприятий за выбранный период</p>
          )}
        </div>
        </div>

        <div className="exportButtons">
          <button className="exportButton" onClick={handleExportPDF}>
            Экспорт в PDF
          </button>
          <button className="exportButton" onClick={handleExportExcel}>
            Экспорт в Excel
          </button>
        </div>
      </div>
    </section>
  );
};

export default StatisticsPage;
