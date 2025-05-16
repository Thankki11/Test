// Routes
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/global.css";

// Components

import PaymentSuccess from "./pages/PaymentSuccess";
import ChatBot from "./components/ChatBot/ChatBot";

function App() {
  return (
    <Router>
      <Routes>
        {[...routes, ...adminRoutes].map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
      <ChatBot />
    </Router>
  );
}

export default App;
