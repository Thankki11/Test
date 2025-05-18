import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const defaultQuestions = [
  {
    question: "opening hours",
    answer: "We are open from 8 AM to 10 PM daily.",
  },
  { question: "address", answer: "Tran Phu, Ha Dong, Ha Noi" },
];

function ChatBot() {
  const location = useLocation();

  // Always call hooks at the top of the component
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/menus")
      .then((res) => setMenus(res.data))
      .catch(() => setMenus([]));

    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3001/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setOrders(res.data))
        .catch(() => setOrders([]));
    }

    const cartId = localStorage.getItem("cartId") || "67fb8e201f70bf74520565e7";
    // axios
    //   .get(`http://localhost:3001/api/cart?id=${cartId}`)
    //   .then((res) => setCart(res.data.items || []))
    //   .catch(() => setCart([]));
  }, []);

  // Hide chatbot if on admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    handleBotReply(input);
    setInput("");
  };

  const handleBotReply = (msg) => {
    const lower = msg.toLowerCase();

    // Find menu item
    if (lower.includes("find") || lower.includes("item")) {
      const keyword = lower.replace("find", "").replace("item", "").trim();
      if (keyword && menus.length > 0) {
        const found = menus.filter((m) =>
          m.name.toLowerCase().includes(keyword)
        );
        if (found.length > 0) {
          // If only one item is found
          if (found.length === 1) {
            setMessages((msgs) => [
              ...msgs,
              {
                from: "bot",
                text: (
                  <>
                    I found:{" "}
                    <a
                      href={`/detail/${found[0]._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {found[0].name}
                    </a>
                  </>
                ),
              },
            ]);
          } else {
            // Multiple items, show each with a link
            setMessages((msgs) => [
              ...msgs,
              {
                from: "bot",
                text: (
                  <span>
                    I found:
                    <br />
                    {found.map((item) => (
                      <div key={item._id}>
                        <a
                          href={`/detail/${item._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.name}
                        </a>
                      </div>
                    ))}
                  </span>
                ),
              },
            ]);
          }
        } else {
          setMessages((msgs) => [
            ...msgs,
            { from: "bot", text: "No matching items found." },
          ]);
        }
        return;
      }
    }

    // View cart
    // if (lower.includes("cart")) {
    //   // Get cart from localStorage
    //   const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

    //   if (cartItems.length > 0) {
    //     let cartSummary = "Your cart:\n";
    //     cartItems.forEach((item, index) => {
    //       cartSummary += `${index + 1}. ${item.name} - Quantity: ${
    //         item.quantity
    //       }\n`;
    //     });

    //     setMessages((msgs) => [
    //       ...msgs,
    //       {
    //         from: "bot",
    //         text: cartSummary,
    //       },
    //     ]);
    //   } else {
    //     setMessages((msgs) => [
    //       ...msgs,
    //       { from: "bot", text: "Your cart is empty." },
    //     ]);
    //   }
    //   return;
    // }

    // Most expensive order
    if (
      lower.includes("most") &&
      (lower.includes("order") || lower.includes("bill"))
    ) {
      if (orders.length > 0) {
        const maxOrder = orders.reduce((prev, curr) =>
          curr.totalPrice > prev.totalPrice ? curr : prev
        );
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: `Most expensive order: $${maxOrder.totalPrice}, status: ${maxOrder.status}`,
          },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { from: "bot", text: "You have no orders." },
        ]);
      }
      return;
    }

    // Least expensive order
    if (
      lower.includes("least") &&
      (lower.includes("order") || lower.includes("bill"))
    ) {
      if (orders.length > 0) {
        const minOrder = orders.reduce((prev, curr) =>
          curr.totalPrice < prev.totalPrice ? curr : prev
        );
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: `Least expensive order: $${minOrder.totalPrice}, status: ${minOrder.status}`,
          },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { from: "bot", text: "You have no orders." },
        ]);
      }
      return;
    }

    // Orders being delivered
    if (lower.includes("delivering")) {
      const deliveringOrders = orders.filter(
        (order) => order.status === "delivering"
      );
      if (deliveringOrders.length > 0) {
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: `You have ${deliveringOrders.length} orders being delivered.`,
          },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { from: "bot", text: "You have no orders being delivered." },
        ]);
      }
      return;
    }

    // Orders being confirmed
    if (lower.includes("confirming")) {
      const pendingOrders = orders.filter(
        (order) => order.status === "pending"
      );
      if (pendingOrders.length > 0) {
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: `You have ${pendingOrders.length} orders being confirmed.`,
          },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { from: "bot", text: "You have no orders being confirmed." },
        ]);
      }
      return;
    }

    // Total spent
    if (
      lower.includes("total") &&
      (lower.includes("order") || lower.includes("bill"))
    ) {
      const totalSpent = orders.reduce(
        (sum, order) => sum + order.totalPrice,
        0
      );
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: `You have spent a total of: $${totalSpent}` },
      ]);
      return;
    }

    // Default questions
    const matchedQuestion = defaultQuestions.find((q) =>
      lower.includes(q.question.toLowerCase())
    );
    if (matchedQuestion) {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: matchedQuestion.answer },
      ]);
      return;
    }

    // Default
    setMessages((msgs) => [
      ...msgs,
      {
        from: "bot",
        text: "Sorry, I don't understand. I can only answer questions about menu items, orders, or basic information.",
      },
    ]);
  };

  // Chat bubble
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#b2281f",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 24px #0002",
          zIndex: 9999,
          cursor: "pointer",
          fontSize: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0px 0px",
          margin: "0px 0px",
        }}
        title="Support Chatbot"
      >
        <i className="fas fa-comment-dots text-center ms-2"></i>
      </button>
    );
  }

  // Chat frame
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 340,
        zIndex: 9999,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 24px #0002",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "#b2281f",
          color: "#fff",
          padding: 5,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="d-flex align-items-center ms-3">
          <i class="fas fa-robot"></i>

          <h2 style={{ fontSize: "18px", margin: "10px 10px" }}>Support</h2>
        </div>
        <button
          onClick={() => setOpen(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: 15,
            cursor: "pointer",
            margin: "8px 8px",
            padding: "0px 0px",
          }}
          title="Minimize"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div style={{ maxHeight: 320, overflowY: "auto", padding: 12 }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.from === "bot" ? "left" : "right",
              margin: "8px 0",
            }}
          >
            {typeof msg.text === "string" ? (
              <span
                style={{
                  display: "inline-block",
                  background: msg.from === "bot" ? "#f1f1f1" : "#fceceb",
                  color: "#222",
                  borderRadius: 8,
                  padding: "6px 12px",
                  maxWidth: "80%",
                }}
              >
                {msg.text}
              </span>
            ) : (
              <span
                style={{
                  display: "inline-block",
                  background: msg.from === "bot" ? "#f1f1f1" : "#fceceb",
                  color: "#222",
                  borderRadius: 8,
                  padding: "6px 12px",
                  maxWidth: "80%",
                }}
              >
                {msg.text}
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #eee", display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type message..."
          style={{ flex: 1, border: "none", padding: 10, outline: "none" }}
        />
        <button
          onClick={handleSend}
          style={{
            background: "#b2281f",
            color: "#fff",
            border: "none",
            padding: "0 16px",
          }}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
