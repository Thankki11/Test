import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminChefs from "../pages/admin/AdminChefs";
import AdminMenus from "../pages/admin/AdminMenus";
import AdminLayout from "../layouts/AdminLayout";
import AdminReservation from "../pages/admin/AdminReservation";
import AdminOrder from "../pages/admin/AdminOrder";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminUsers from "../pages/admin/AdminUsers";
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
    path: "/admin/chefs",
    element: (
      <AdminRouteWrapper>
        <AdminLayout>
          <AdminChefs />
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
    path: "/admin/reservations",
    element: (
      <AdminRouteWrapper>
        <AdminLayout>
          <AdminReservation />
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
    path: "admin/users",
    element: (
      <AdminRouteWrapper>
        <AdminLayout>
          <AdminUsers/>
        </AdminLayout>
      </AdminRouteWrapper>
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
