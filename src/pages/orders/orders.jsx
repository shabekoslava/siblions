import React, { useState, useEffect } from "react";
import "./orders.css";

const STATUS_OPTIONS = [
  { value: "new", label: "Новый" },
  { value: "processing", label: "В обработке" },
  { value: "assembled", label: "Собран" },
  { value: "ready", label: "Готов к выдаче" },
  { value: "received", label: "Получен" },
  { value: "cancelled", label: "Отменен" },
];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [editedOrders, setEditedOrders] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const testOrders = [
      {
        id: 1,
        orderNumber: 1,
        customer: "Восемкин Петр Николаевич",
        group: "8К32",
        products: ["Футболка", "Блокнот", "Ручка"],
        status: "received",
      },
      {
        id: 2,
        orderNumber: 2,
        customer: "Громкин Иван Андреевич",
        group: "8К22",
        products: ["Блокнот", "Ручка"],
        status: "assembled",
      },
      {
        id: 3,
        orderNumber: 3,
        customer: "Иванов Иван Иванович",
        group: "ИСП-42",
        products: ["Футболка черная (M)", "Носки спортивные", "Браслет"],
        status: "new",
      },
    ];

    setOrders(testOrders);

    const initialEdited = {};
    testOrders.forEach((order) => {
      initialEdited[order.id] = order.status;
    });
    setEditedOrders(initialEdited);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setEditedOrders((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const updatedOrders = orders.map((order) => ({
      ...order,
      status: editedOrders[order.id],
    }));
    setOrders(updatedOrders);
    setHasChanges(false);
    alert("Изменения сохранены!");
  };

  return (
    <section className="ordersPage">
      <div className="ordersContentContainer">
        <div className="ordersTitleContainer">
          <h1 className="ordersTitle">История заказов</h1>
        </div>

        <div className="ordersMainContent">
          <table className="ordersTable">
            <thead>
              <tr>
                <th className="orderNumber">№</th>
                <th className="orderCustomer">ФИО</th>
                <th className="orderGroup">Группа</th>
                <th className="orderProducts">Товары</th>
                <th className="orderStatus">Статус</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="orderNumber">{order.orderNumber}</td>
                  <td className="orderCustomer">{order.customer}</td>
                  <td className="orderGroup">{order.group}</td>
                  <td className="orderProducts">
                    {order.products.map((product, index) => (
                      <div key={index} className="productItem">
                        {product}
                      </div>
                    ))}
                  </td>
                  <td className="orderStatus">
                    <select
                      className="statusSelect"
                      value={editedOrders[order.id]}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="actionButtons">
            {hasChanges && (
              <button className="saveButton" onClick={handleSave}>
                Сохранить
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrdersPage;


