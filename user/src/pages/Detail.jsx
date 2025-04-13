import img1 from "../assets/images/menus/menu-slider-1.jpg";
import ImageBox from "../components/Box/ImageBox";
import ButtonWhite from "../components/Buttons/ButtonWhite";
import OverlayCard from "../components/OverlayCard/OverlayCard";
import TitleWithSubtitle from "../components/TitleWithSubtitle/TitleWithSubtitle";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import QuantitySelector from "../components/QuantitySelector";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Thêm hook useParams để lấy id từ URL

function Detail() {
  const [menu, setMenu] = useState(null); // State để lưu dữ liệu món ăn
  const [value, setValue] = useState("1");
  const { id } = useParams(); // Lấy id từ URL

  // Hàm gọi API để lấy chi tiết món ăn
  useEffect(() => {
    // Gửi yêu cầu GET tới API để lấy chi tiết món ăn theo id
    axios
      .get(`http://localhost:5000/api/menus/${id}`)
      .then((response) => {
        setMenu(response.data); // Lưu dữ liệu món ăn vào state
        console.log(response.data); // In ra để kiểm tra dữ liệu
      })
      .catch((error) => {
        console.error("There was an error fetching the menu detail!", error);
      });
  }, [id]); // useEffect sẽ được gọi lại khi id thay đổi

  if (!menu) {
    return <div>Loading...</div>; // Nếu chưa có dữ liệu món ăn, hiển thị loading
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <div className="section">
        <div className="row">
          <div className="col-5">
            <ImageBox
              height="800px"
              src={`http://localhost:5000/uploads/${menu.imageUrl}`}
              alt="menu"
            />
          </div>
          <div className="col-7">
            <TitleWithSubtitle title={menu.title} subTitle={menu.category} />
            <h5 style={{ fontSize: "35px" }}>${menu.price}</h5>
            <p style={{ margin: "35px 0px" }}>{menu.description}</p>
            {/* button quantity, add to cart, buy now */}
            <div style={{ display: "flex", gap: "40px", margin: "40px 0px" }}>
              <QuantitySelector />
              <ButtonWhite buttontext={"Add to cart"} />
              <ButtonWhite buttontext={"Buy now"} />
            </div>
            {/* sku, category, tags */}
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab
                      label="Ingredient"
                      value="1"
                      style={{
                        fontSize: "20px",
                        fontFamily: "JosefinSans",
                        fontWeight: "bold",
                      }}
                    />
                    <Tab
                      label="Information"
                      value="2"
                      style={{
                        fontSize: "20px",
                        fontFamily: "JosefinSans",
                        fontWeight: "bold",
                      }}
                    />
                    <Tab
                      label="Rates"
                      value="3"
                      style={{
                        fontSize: "20px",
                        fontFamily: "JosefinSans",
                        fontWeight: "bold",
                      }}
                    />
                  </TabList>
                </Box>
                <TabPanel
                  value="1"
                  style={{ fontSize: "25px", fontFamily: "JosefinSans" }}
                >
                  {menu.ingredients}
                </TabPanel>
                <TabPanel
                  value="2"
                  style={{ fontSize: "25px", fontFamily: "JosefinSans" }}
                >
                  <p>SKU: {menu.sku}</p>
                  <p>Category: {menu.category}</p>
                  <p>Tags: Tagskllaksm</p>
                </TabPanel>
                <TabPanel
                  value="3"
                  style={{ fontSize: "25px", fontFamily: "JosefinSans" }}
                >
                  {menu.rates}
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="row">
          <div className="col-8">
            <h2>Related Products</h2>
          </div>
          <div className="col-4"></div>
          <div className="col-3">
            <OverlayCard
              title="Title"
              description={["Description"]}
              height="450px"
              imageSrc={img1}
            />
          </div>
          <div className="col-3">
            <OverlayCard
              title="Title"
              description={["Description"]}
              height="450px"
              imageSrc={img1}
            />
          </div>
          <div className="col-3">
            <OverlayCard
              title="Title"
              description={["Description"]}
              height="450px"
              imageSrc={img1}
            />
          </div>
          <div className="col-3">
            <OverlayCard
              title="Title"
              description={["Description"]}
              height="450px"
              imageSrc={img1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
