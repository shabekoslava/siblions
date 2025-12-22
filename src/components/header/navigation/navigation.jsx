import "./Navigation.css";
import EventsButton from "./navButton/eventsButton/EventsButton";
import OrdersButton from "./navButton/ordersButton/OrdersButton";
import PersonalAccountButton from "./navButton/personalAccountButton/PersonalAccountButton";
import StatisticsButton from "./navButton/statisticsButton/StatisticsButton";

export default function Navigation({ currentPage, onPageChange }) {
  return (
    <nav className="navigation" role="navigation" aria-label="Основное меню">
      <ul className="navigationList">
        <li className="navigationItem">
          <EventsButton
            isActive={currentPage === "events"}
            onClick={() => onPageChange("events")}
          />
        </li>

        <li className="navigationItem">
          <OrdersButton
            isActive={currentPage === "orders"}
            onClick={() => onPageChange("orders")}
          />
        </li>

        <li className="navigationItem">
          <StatisticsButton
            isActive={currentPage === "statistics"}
            onClick={() => onPageChange("statistics")}
          />
        </li>

        <li className="navigationItem">
          <PersonalAccountButton
            isActive={currentPage === "personalAccount"}
            onClick={() => onPageChange("personalAccount")}
          />
        </li>
      </ul>
    </nav>
  );
}
