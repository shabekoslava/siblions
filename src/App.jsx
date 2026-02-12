import { useState } from "react";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import EventsPage from "./pages/events/events";
import OrdersPage from "./pages/orders/orders";
import PersonalAccountPage from "./pages/personalAccount/personalAccount";
import StatisticsPage from "./pages/statistics/statistics";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("events");

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
