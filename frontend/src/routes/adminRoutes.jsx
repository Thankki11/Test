import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminMenus from "../pages/admin/AdminMenus";
import AdminLayout from "../layouts/AdminLayout";

import AdminOrder from "../pages/admin/AdminOrder";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminEmployees from "../pages/admin/AdminEmployees";
import AdminVouchers from "../pages/admin/AdminVouchers.jsx";
import AdminCombo from "../pages/admin/AdminCombo";
import { Navigate } from "react-router-dom";

const adminRoutes = [
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <AdminRouteWrapper>
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </AdminRouteWrapper>
    ),
  },
  {
    path: "/admin/menus",
    element: (
      <AdminRouteWrapper>
        <AdminLayout>
          <AdminMenus />
        </AdminLayout>
      </AdminRouteWrapper>
    ),
  },

  {
    path: "/admin/orders",
    element: (
      <AdminRouteWrapper>
        <AdminLayout>
          <AdminOrder />
        </AdminLayout>
      </AdminRouteWrapper>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminRouteWrapper>
        <AdminLayout>
          <AdminUsers />
        </AdminLayout>
      </AdminRouteWrapper>
    ),
  },
  {
    path: "/admin/employees",
    element: (
      <AdminRouteWrapper>
        <AdminLayout>
          <AdminEmployees />
        </AdminLayout>
      </AdminRouteWrapper>
    ),
  },
  {
    path: "/admin/vouchers",
    element: (
      <AdminRouteWrapper>
        <AdminLayout>
          <AdminVouchers />
        </AdminLayout>
      </AdminRouteWrapper>
    ),
  },
  {
    path: "/admin/combos",
    element: (
      <AdminLayout>
        <AdminCombo />
      </AdminLayout>
    ),
  },
];

function AdminRouteWrapper({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

export default adminRoutes;
