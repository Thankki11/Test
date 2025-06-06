import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import OverlayCard from "../components/OverlayCard/OverlayCard";
import PageHeader from "../components/PageHeader/PageHeader";
import img1 from "../assets/images/menus/menu-slider-1.jpg";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { useLocation } from "react-router-dom";

function Menus() {
  const [menus, setMenus] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [value, setValue] = React.useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  //Query String
  const location = useLocation();

  //Xử lý yêu cầu xem tab khi từ trang khác chuyển đến
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab");

    if (tab) {
      const categoryIndex =
        tab === "burger"
          ? 0
          : tab === "pizza"
          ? 1
          : tab === "fried-chicken"
          ? 2
          : tab === "drink"
          ? 3
          : 0;

      setValue(categoryIndex);
    }
  }, [location.search]);

  //Chạy khi component được mount
  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get("http://localhost:3001/api/menus")
      .then((response) => {
        setMenus(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the menus!", error);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") return;

    // Tìm category của món ăn đầu tiên khớp với từ khóa tìm kiếm
    const foundCategory = menus.find((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )?.category;

    // Chuyển tab dựa trên category tìm thấy
    if (foundCategory) {
      const categoryIndex =
        foundCategory === "burger"
          ? 0
          : foundCategory === "pizza"
          ? 1
          : foundCategory === "fried-chicken"
          ? 2
          : foundCategory === "drink"
          ? 3
          : 0;

      setValue(categoryIndex); // Chuyển tab
    }
  }, [searchTerm, menus]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortMenus = (items) => {
    switch (sortOption) {
      case "price-asc":
        return [...items].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...items].sort((a, b) => b.price - a.price);
      case "name-asc":
        return [...items].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...items].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return items;
    }
  };

  const renderTabContent = (category) => {
    //filter các item theo thể loại và searchTerm
    const filteredItems = menus.filter((item) => {
      const matchesCategory =
        category === 0
          ? item.category === "burger"
          : category === 1
          ? item.category === "pizza"
          : category === 2
          ? item.category === "fried-chicken"
          : category === 3
          ? item.category === "drink"
          : false;

      // Lọc món ăn theo từ khóa tìm kiếm
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    //sắp xếp các item đã filter theo loại sort đã chọn
    const sortedItems = sortMenus(filteredItems);

    return (
      <div className="row">
        {sortedItems.length > 0 ? (
          sortedItems.map((item, index) => (
            <div className="col-3 mb-4" key={index}>
              <Link to={`/detail/${item._id}`}>
                <OverlayCard
                  title={item.name}
                  description={[
                    `$ ${item.price}`,
                    item.quantity > 0
                      ? `In Stock: ${item.quantity}`
                      : "Out of Stock",
                  ]}
                  height="350px"
                  imageSrc={`http://localhost:3001${
                    item.imageUrl.startsWith("/uploads")
                      ? item.imageUrl
                      : "/uploads/" + item.imageUrl
                  }`}
                />
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center mt-4">No items found</div>
        )}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        backgroundType={"image"}
        backgroundSrc={img1}
        h2Title={""}
        title={"Menus"}
        subTitle={"Welcome to our delicious corner"}
        height="65vh"
      />
      <div className="section">
        <div className="text-center mb-5">
          <h6>Our Offered Menu</h6>
          <h2 style={{ fontSize: "45px", padding: "0px 65px" }}>
            Trendy And Popular Courses Offered
          </h2>
          <input
            type="text"
            placeholder="Find by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: 300,
              padding: 8,
              marginTop: 16,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Tabs - nằm bên trái */}
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label="burgers"
                {...a11yProps(0)}
                style={{ fontSize: "16px" }}
              />
              <Tab
                label="Pizza"
                {...a11yProps(1)}
                style={{ fontSize: "16px" }}
              />
              <Tab
                label="Fried-Chicken"
                {...a11yProps(2)}
                style={{ fontSize: "16px" }}
              />
              <Tab
                label="Drinks"
                {...a11yProps(3)}
                style={{ fontSize: "16px" }}
              />
            </Tabs>

            {/* Sort Dropdown - nằm bên phải */}
            <FormControl sx={{ width: 200, marginBottom: "8px" }}>
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={sortOption}
                label="Sort By"
                onChange={handleSortChange}
                size="small"
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                <MenuItem value="name-asc">Name: A to Z</MenuItem>
                <MenuItem value="name-desc">Name: Z to A</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Tab Panels */}
          <CustomTabPanel value={value} index={0}>
            {renderTabContent(0)}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {renderTabContent(1)}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            {renderTabContent(2)}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            {renderTabContent(3)}
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
