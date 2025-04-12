// Pages
import Home from "../pages/Home";
import Menus from "../pages/Menus";
import Blogs from "../pages/Blogs";
import Chefs from "../pages/Chefs";
import CookingClassRegister from "../pages/CookingClassRegister";
import Recruitment from "../pages/Recuitment";
import Shop from "../pages/Shop";

// Layout
import UserLayout from "../layouts/UserLayout";

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
    path: "/chefs",
    element: (
      <UserLayout>
        <Chefs />
      </UserLayout>
    ),
  },
  {
    path: "/cooking-class-register",
    element: (
      <UserLayout>
        <CookingClassRegister />
      </UserLayout>
    ),
  },
  {
    path: "/recruitment",
    element: (
      <UserLayout>
        <Recruitment />
      </UserLayout>
    ),
  },
  {
    path: "/shop",
    element: (
      <UserLayout>
        <Shop />
      </UserLayout>
    ),
  },
];

export default routes;
