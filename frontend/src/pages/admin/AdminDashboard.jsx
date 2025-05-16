import React, { useEffect, useState } from "react";
import axios from "axios";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Utility function for class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Card Components
const Card = ({ className, ...props }) => (
  <div className={cn("rounded-lg border bg-white text-gray-900 shadow-sm", className)} {...props} />
);

const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
);

const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-gray-500", className)} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

// Icons
const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-500">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);

const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-500">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-500">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

// Chart Legend Components
const ChartLegend = ({ className, children, ...props }) => (
  <div className={cn("chart-legend flex items-center justify-center flex-wrap gap-4", className)} {...props}>
    {children}
  </div>
);

// Chart Legend Item Component
const ChartLegendItem = ({ color, name }) => (
  <div className="flex items-center gap-2">
    <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
    <span className="text-sm font-medium">{name}</span>
  </div>
);

// Menu Category Chart Component
const MenuCategoryChart = ({ data, colors }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={true}
        outerRadius={120}
        fill="#8884d8"
        dataKey="value"
        nameKey="name"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value, name) => [`${value} items`, name]}
        contentStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "6px",
          border: "1px solid #e2e8f0",
          padding: "8px",
        }}
      />
    </PieChart>
  </ResponsiveContainer>
);

function AdminDashboard() {
  const [menuCount, setMenuCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [menuCategoryData, setMenuCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");

      // Fetch menu count
      const menuResponse = await axios.get("http://localhost:3001/api/menus", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuCount(menuResponse.data.length);

      // Fetch order count
      const orderResponse = await axios.get(
        "http://localhost:3001/api/orders/getOrders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrderCount(orderResponse.data.length);

      // Fetch user count
      const userResponse = await axios.get(
        "http://localhost:3001/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserCount(userResponse.data.length);

      // Fetch menu category data
      const categoryData = menuResponse.data.reduce((acc, menu) => {
        const category = menu.category;
        if (acc[category]) {
          acc[category]++;
        } else {
          acc[category] = 1;
        }
        return acc;
      }, {});

      const categoryArray = Object.keys(categoryData).map((category) => ({
        name: category,
        value: categoryData[category],
      }));
      setMenuCategoryData(categoryArray);
    } catch (err) {
      console.error("Error fetching statistics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Menu Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Menus</CardTitle>
              <ActivityIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menuCount}</div>
              <p className="text-xs text-gray-500">Available menu items in the system</p>
            </CardContent>
          </Card>

          {/* Orders Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBagIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderCount}</div>
              <p className="text-xs text-gray-500">Orders placed by customers</p>
            </CardContent>
          </Card>

          {/* Users Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
              <p className="text-xs text-gray-500">Registered users on the platform</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Card */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Menu Categories</CardTitle>
              <CardDescription>Distribution of menu items by category</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {isLoading ? (
                <p>Loading data...</p>
              ) : menuCategoryData.length > 0 ? (
                <div className="h-80">
                  <div className="flex h-full items-center justify-center">
                    <MenuCategoryChart data={menuCategoryData} colors={COLORS} />
                  </div>
                  
                  {/* Chart Legend */}
                  <ChartLegend className="flex-wrap gap-2 justify-center mt-4">
                    {menuCategoryData.map((entry, index) => (
                      <ChartLegendItem
                        key={entry.name}
                        color={COLORS[index % COLORS.length]}
                        name={entry.name}
                      />
                    ))}
                  </ChartLegend>
                </div>
              ) : (
                <p>No data available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;