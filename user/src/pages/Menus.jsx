import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import OverlayCard from "../components/OverlayCard/OverlayCard";
import PageHeader from "../components/PageHeader/PageHeader";

import img1 from "../assets/images/menus/menu-slider-1.jpg"; // Hình ảnh mặc định cho OverlayCard

function Menus() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    // Gửi yêu cầu GET đến API backend để lấy danh sách menus
    axios
      .get("http://localhost:5000/api/menus")
      .then((response) => {
        setMenus(response.data); // Lưu dữ liệu nhận được vào state
        console.log(response.data); // In ra dữ liệu để kiểm tra
      })
      .catch((error) => {
        console.error("There was an error fetching the menus!", error);
      });
  }, []);

  // MUI
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <PageHeader
        backgroundType={"image"}
        backgroundSrc={img1}
        h2Title={""}
        title={"Menus"}
        subTitle={"Welcome to our delicious corner"}
        buttonText={"Button"}
      />
      <div className="section">
        <div className="text-center mb-5">
          <h6>Our Offered Menu</h6>
          <h2>Some Trendy And Popular Courses Offered</h2>
        </div>
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{ borderBottom: 1, borderColor: "divider" }}
            className="d-flex justify-content-center align-items-center"
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label="Appertizer"
                {...a11yProps(0)}
                style={{ fontSize: "20px" }}
              />
              <Tab
                label="Main Courses"
                {...a11yProps(1)}
                style={{ fontSize: "20px" }}
              />
              <Tab
                label="Dessert"
                {...a11yProps(2)}
                style={{ fontSize: "20px" }}
              />
              <Tab
                label="Drinks"
                {...a11yProps(3)}
                style={{ fontSize: "20px" }}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div className="row">
              {menus.map((item, index) => (
                <div className="col-3 mb-4" key={index}>
                  <OverlayCard
                    description={[item.description || "No description"]}
                    height="300px"
                    title={item.title || "No title"}
                    imageSrc={item.image || img1} // Nếu không có hình thì dùng img1
                  />
                </div>
              ))}
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            Item Two
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Item Three
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            Item Four
          </CustomTabPanel>
        </Box>
      </div>
    </div>
  );
}

export default Menus;

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
