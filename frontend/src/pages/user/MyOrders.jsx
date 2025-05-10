import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:3001/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <Link to={`/order-detail/${order._id}`}>
                Order #{order._id} - Total: {order.totalPrice}$ - Status: {order.status}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyOrders;