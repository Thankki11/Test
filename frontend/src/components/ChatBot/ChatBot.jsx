import React, { useEffect, useState } from "react";
import axios from "axios";

const defaultQuestions = [
  { question: "giờ mở cửa", answer: "Nhà hàng mở cửa từ 8h đến 22h mỗi ngày." },
  {
    question: "đặt bàn",
    answer:
      "Bạn có thể đặt bàn qua mục Đặt bàn trên menu hoặc nhắn 'đặt bàn' cho tôi!",
  },
  {
    question: "giỏ hàng",
    answer:
      "Bạn hãy nhấn vào nút giỏ hàng ở góc trên hoặc nhắn 'giỏ hàng' cho tôi.",
  },
];

function ChatBot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false); // trạng thái mở/đóng chat

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
    axios
      .get(`http://localhost:3001/api/cart?id=${cartId}`)
      .then((res) => setCart(res.data.items || []))
      .catch(() => setCart([]));
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    handleBotReply(input);
    setInput("");
  };

  const handleBotReply = (msg) => {
    const lower = msg.toLowerCase();

    // Tìm món ăn
    if (lower.includes("tìm") || lower.includes("món")) {
      const keyword = lower.replace("tìm", "").replace("món", "").trim();
      if (keyword && menus.length > 0) {
        const found = menus.filter((m) =>
          m.name.toLowerCase().includes(keyword)
        );
        if (found.length > 0) {
          // Nếu chỉ tìm thấy 1 món
          if (found.length === 1) {
            setMessages((msgs) => [
              ...msgs,
              {
                from: "bot",
                text: (
                  <>
                    Tôi tìm thấy:{" "}
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
            // Nhiều món, hiện từng món với link
            setMessages((msgs) => [
              ...msgs,
              {
                from: "bot",
                text: (
                  <span>
                    Tôi tìm thấy:
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
            { from: "bot", text: "Không tìm thấy món nào phù hợp." },
          ]);
        }
        return;
      }
    }

    // Xem hóa đơn
    if (lower.includes("hóa đơn") || lower.includes("đơn hàng")) {
      if (orders.length > 0) {
        const lastOrder = orders[0];
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: `Đơn gần nhất: Tổng tiền $${lastOrder.totalPrice}, trạng thái: ${lastOrder.status}`,
          },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { from: "bot", text: "Bạn chưa có hóa đơn nào." },
        ]);
      }
      return;
    }

    // Xem giỏ hàng
    if (lower.includes("giỏ hàng")) {
      if (cart && cart.length > 0) {
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: (
              <span>
                Giỏ hàng của bạn:
                <ul style={{ paddingLeft: 18 }}>
                  {cart.map((i) => (
                    <li key={i._id}>
                      {i.name || i.title} x {i.quantity}
                      {/* Nếu muốn có link chi tiết món ăn, bỏ comment dòng dưới */}
                      {/* <a href={`/detail/${i._id}`} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}>{i.name || i.title}</a> */}
                    </li>
                  ))}
                </ul>
              </span>
            ),
          },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { from: "bot", text: "Giỏ hàng của bạn đang trống." },
        ]);
      }
      return;
    }

    // Trả lời các câu hỏi cơ bản
    for (let q of defaultQuestions) {
      if (lower.includes(q.question)) {
        setMessages((msgs) => [...msgs, { from: "bot", text: q.answer }]);
        return;
      }
    }

    // Mặc định
    setMessages((msgs) => [
      ...msgs,
      {
        from: "bot",
        text: "Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể hỏi về món ăn, hóa đơn, giỏ hàng hoặc các thông tin cơ bản.",
      },
    ]);
  };

  // Bong bóng chat
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
        title="Chatbot hỗ trợ"
      >
        <i className="fas fa-comment-dots text-center ms-2"></i>
      </button>
    );
  }

  // Khung chat
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
          title="Thu nhỏ"
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