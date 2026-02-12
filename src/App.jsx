import { useState } from "react";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import EventsPage from "./pages/events/events";
import OrdersPage from "./pages/orders/orders";
import PersonalAccountPage from "./pages/personalAccount/personalAccount";
import StatisticsPage from "./pages/statistics/statistics";
import "./App.css";

const PAGE_KEY = "appCurrentPage";
const VALID_PAGES = ["events", "orders", "personalAccount", "statistics"];

function App() {
  const [currentPage, setCurrentPageState] = useState(() => {
    const saved = localStorage.getItem(PAGE_KEY);
    return VALID_PAGES.includes(saved) ? saved : "events";
  });

  const setCurrentPage = (page) => {
    if (VALID_PAGES.includes(page)) {
      setCurrentPageState(page);
      localStorage.setItem(PAGE_KEY, page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "events":
        return <EventsPage />;
      case "orders":
        return <OrdersPage />;
      case "personalAccount":
        return <PersonalAccountPage />;
      case "statistics":
        return <StatisticsPage />;
      default:
        return <EventsPage />;
    }
  };

  return (
    <div className="app">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />

      <main className="app__content">{renderPage()}</main>

      <Footer onPageChange={setCurrentPage} />
    </div>
  );
}

export default App;
