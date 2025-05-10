import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`http://localhost:3001/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h1>Order #{order._id}</h1>
      <p>Total Price: {order.totalPrice}$</p>
      <p>Status: {order.status}</p> {/* Hiển thị trạng thái đơn hàng */}
      <h2>Items:</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item.menuItemId}>
            {item.name} - {item.quantity} x {item.price}$
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderDetail;