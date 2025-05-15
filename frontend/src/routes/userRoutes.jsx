import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Pages
import Home from "../pages/Home";
import Menus from "../pages/Menus";
import Blogs from "../pages/Blogs";
import Detail from "../pages/Detail";
import CheckOut from "../pages/CheckOut";
import Login from "../pages/Login";
import Test from "../pages/test";
import Register from "../pages/Register";
import EditProfile from "../pages/user/EditProfile";
import UserInfo from "../pages/user/UserInfo";
import OrderDetail from "../pages/user/OrderDetail";
import MyOrders from "../pages/user/MyOrders";
import Combo from "../pages/Combo";
// Layout
import UserLayout from "../layouts/UserLayout";
import Reservation from "../pages/Reservation";

const routes = [
  {
    path: "/",
    element: (
      <UserLayout>
        <Home />
      </UserLayout>
    ),
  },
  {
    path: "/menus",
    element: (
      <UserLayout>
        <Menus />
      </UserLayout>
    ),
  },
  {
    path: "/blogs",
    element: (
      <UserLayout>
        <Blogs />
      </UserLayout>
    ),
  },
  {
    path: "/detail",
    element: (
      <UserLayout>
        <Detail />
      </UserLayout>
    ),
  },
  {
    path: "/detail/:id",
    element: (
      <UserLayout>
        <Detail />
      </UserLayout>
    ),
  },
  {
    path: "/check-out",
    element: (
      <UserLayout>
        <CheckOut />
      </UserLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <UserLayout>
        <Login />
      </UserLayout>
    ),
  },
  {
    path: "/reservation",
    element: (
      <UserLayout>
        <Reservation />
      </UserLayout>
    ),
  },
  {
    path: "/test",
    element: (
      <UserLayout>
        <Test />
      </UserLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <UserLayout>
        <Register />
      </UserLayout>
    ),
  },
  {
    path: "/edit-profile",
    element: (
      <UserLayout>
        <EditProfile />
      </UserLayout>
    ),
  },
  {
    path: "/user-info",
    element: (
      <UserLayout>
        <UserInfo />
      </UserLayout>
    ),
  },
  {
    path: "/order-detail/:id",
    element: (
      <UserLayout>
        <OrderDetail />
      </UserLayout>
    ),
  },
  {
    path: "/my-orders",
    element: (
      <UserLayout>
        <MyOrders />
      </UserLayout>
    ),
  },
  {
    path: "/combos",
    element: (
      <UserLayout>
        <Combo />
      </UserLayout>
    ),
  },
];

function UserRoutes() {
  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export { routes, UserRoutes };
