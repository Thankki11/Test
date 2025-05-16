import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Spin, Table, Input, Button } from "antd";
import { Line } from "react-chartjs-2";
import axios from "axios";
import moment from "moment";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  const [allSeries, setAllSeries] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [buyers, setBuyers] = useState(0);

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
  }, [range, allOrders, allSeries, allProducts, registrations, buyers]);

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
      const orderDate = moment(re.date);
      return orderDate.isBetween(range[0], range[1], "day", "[]");
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

    const filteredSeries = allSeries.filter((item) => {
      const date = moment(item.date);
      return date.isBetween(range[0], range[1], "day", "[]");
    });

    setChartData({
      labels: filteredSeries.map((item) =>
        moment(item.date).format("YYYY-MM-DD")
      ),
      datasets: [
        {
          label: "Revenue",
          data: filteredSeries.map(
            (item) => item.amount || item.totalPrice || 0
          ),
          borderColor: "#1890ff",
          backgroundColor: "rgba(24,144,255,0.2)",
        },
      ],
    });

    const filteredProducts = allOrders.filter((order) => {
      const orderDate = moment(order.date);
      return orderDate.isBetween(range[0], range[1], "day", "[]");
    });

    const productSalesMap = {};
    filteredProducts.forEach((order) => {
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

        <Card style={{ marginTop: 24 }} title="Revenue Over Time">
          <Line
            data={chartData}
            options={{
              scales: {
                x: { title: { display: true, text: "Date" } },
                y: { title: { display: true, text: "Revenue ($)" } },
              },
              responsive: true,
              maintainAspectRatio: false,
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
