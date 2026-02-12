import "./ordersButton.css";

export default function OrdersButton({ isActive, onClick }) {
  return (
    <button
      className={`ordersButton ${
        isActive ? "ordersButton--active" : "ordersButton--inactive"
      }`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      title="Перейти к заказам"
    >
      <p>Заказы</p>
    </button>
  );
}
