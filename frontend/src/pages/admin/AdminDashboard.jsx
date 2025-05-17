import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Spin, Table, Input, Button } from "antd";
import { Bar } from "react-chartjs-2"; // Đổi từ Line sang Bar
import axios from "axios";
import moment from "moment";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, // Thay thế LineElement bằng BarElement
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [range, setRange] = useState([moment().startOf("month"), moment()]);
  const [startDate, setStartDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  const [metrics, setMetrics] = useState({
    orders: 0,
    revenue: 0,
    registrations: 0,
    buyers: 0,
  });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [allOrders, setAllOrders] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (
      allOrders.length === 0 ||
      !range[0] ||
      !range[1] ||
      !moment.isMoment(range[0]) ||
      !moment.isMoment(range[1])
    )
      return;

    filterDataByRange();
  }, [range, allOrders, registrations]);

  const fetchAll = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data: ordersData } = await axios.get(
        "http://localhost:3001/api/orders/getOrders",
        config
      );
      setAllOrders(ordersData);

      const { data: register } = await axios.get(
        "http://localhost:3001/api/admin/users",
        config
      );
      setRegistrations(register);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDataByRange = () => {
    const filteredOrders = allOrders.filter((order) => {
      const orderDate = moment(order.date);
      return orderDate.isBetween(range[0], range[1], "day", "[]");
    });

    const filteredRegister = registrations.filter((re) => {
      const regDate = moment(re.date);
      return regDate.isBetween(range[0], range[1], "day", "[]");
    });

    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );
    const uniqueBuyers = new Set(filteredOrders.map((order) => order.userId));
    const totalBuyer = uniqueBuyers.size;
    const totalRegistration = filteredRegister.length;

    setMetrics({
      orders: totalOrders,
      revenue: totalRevenue,
      registrations: totalRegistration,
      buyers: totalBuyer,
    });

    const categories = ["burger", "pizza", "fried-chicken", "drink"];

    const categoryTotals = categories.map((category) => {
      let total = 0;

      filteredOrders.forEach((order) => {
        order.items.forEach((item) => {
          if (item.category === category) {
            total += item.price * item.quantity; // hoặc item.amount nếu bạn có sẵn
          }
        });
      });

      return { category, total };
    });

    function getColorForCategory(category, alpha = 1) {
      const colors = {
        burger: `rgba(218,165,32,${alpha})`,
        pizza: `rgba(70,130,180,${alpha})`,
        "fried-chicken": `rgba(220,20,60,${alpha})`,
        drink: `rgba(60,179,113,${alpha})`,
      };
      return colors[category] || `rgba(0,0,0,${alpha})`;
    }

    setChartData({
      labels: categoryTotals.map((item) => item.category),
      datasets: [
        {
          label: "Tổng doanh thu",
          data: categoryTotals.map((item) => item.total),
          backgroundColor: categoryTotals.map((item) =>
            getColorForCategory(item.category, 0.2)
          ),
          borderColor: categoryTotals.map((item) =>
            getColorForCategory(item.category, 1)
          ),
          borderWidth: 1,
        },
      ],
    });

    const productSalesMap = {};
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (productSalesMap[item.name]) {
          productSalesMap[item.name] += item.quantity;
        } else {
          productSalesMap[item.name] = item.quantity;
        }
      });
    });

    const topProducts = Object.entries(productSalesMap).map(([name, sold]) => ({
      name,
      sold,
    }));

    topProducts.sort((a, b) => b.sold - a.sold);

    setTopProducts(topProducts);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Units Sold",
      dataIndex: "sold",
      key: "sold",
      sorter: (a, b) => a.sold - b.sold,
      defaultSortOrder: "descend",
    },
  ];

  return (
    <Spin spinning={loading}>
      <Card title="Statistics Report">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="Total Orders" value={metrics.orders} />
          </Col>
          <Col span={6}>
            <Statistic
              title="Revenue ($)"
              value={metrics.revenue}
              precision={2}
              formatter={(value) =>
                Number.isInteger(value) ? value.toString() : value.toFixed(2)
              }
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="New Registrations"
              value={metrics.registrations}
            />
          </Col>
          <Col span={6}>
            <Statistic title="Purchasing Accounts" value={metrics.buyers} />
          </Col>
        </Row>

        <Row style={{ marginTop: 24 }} gutter={8}>
          <Col>
            <Input
              placeholder="Từ ngày (YYYY-MM-DD)"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Col>
          <Col>
            <Input
              placeholder="Đến ngày (YYYY-MM-DD)"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => {
                const start = moment(startDate, "YYYY-MM-DD", true);
                const end = moment(endDate, "YYYY-MM-DD", true);
                if (start.isValid() && end.isValid()) {
                  setRange([start, end]);
                } else {
                  alert("Vui lòng nhập đúng định dạng YYYY-MM-DD");
                }
              }}
            >
              Filter
            </Button>
          </Col>
        </Row>

        <Card style={{ marginTop: 24 }} title="Revenue by Category">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `${context.dataset.label}: $${context.formattedValue}`,
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Food Category",
                  },
                  grid: {
                    display: false,
                  },
                  ticks: {
                    font: {
                      size: 14,
                    },
                  },

                  categoryPercentage: 0.2,
                  barPercentage: 0.1,
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Revenue ($)",
                  },
                  ticks: {
                    font: {
                      size: 14,
                    },
                    callback: (value) => `$${value.toLocaleString()}`,
                  },
                },
              },
            }}
            height={300}
          />
        </Card>

        <Card style={{ marginTop: 24 }} title="Top Best Selling Products">
          <Table
            columns={columns}
            dataSource={topProducts}
            rowKey={(record) => record.id || record.name}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </Card>
    </Spin>
  );
};

export default AdminDashboard;
