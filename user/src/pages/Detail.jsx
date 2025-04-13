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

import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Thêm hook useParams để lấy id từ URL

function Detail() {
  const [menu, setMenu] = useState(null); // State để lưu dữ liệu món ăn
  const [relatedMenus, setRelatedMenus] = useState([]); // State để lưu danh sách món ăn liên quan
  const [value, setValue] = useState("1");
  const { id } = useParams(); // Lấy id từ URL
  const [quantity, setQuantity] = useState(1); // State để lưu số lượng món ăn

  // Hàm gọi API để lấy chi tiết món ăn
  useEffect(() => {
    // Gửi yêu cầu GET tới API để lấy chi tiết món ăn theo id
    axios
      .get(`http://localhost:5000/api/menus/${id}`)
      .then((response) => {
        setMenu(response.data); // Lưu dữ liệu món ăn vào state
        axios
          .get(
            `http://localhost:5000/api/menus/category/${response.data.category}`
          )
          .then((res) => {
            setRelatedMenus(res.data); // Lưu các món ăn liên quan vào state
            console.log(res.data); // In ra để kiểm tra các món ăn liên quan
          })
          .catch((err) => {
            console.error("There was an error fetching related menus!", err);
          });
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
            <h5 style={{ fontSize: "35px" }}>$ {menu.price}</h5>
            <p style={{ margin: "35px 0px" }}>{menu.description}</p>
            {/* button quantity, add to cart, buy now */}
            <div style={{ display: "flex", gap: "40px", margin: "40px 0px" }}>
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
              <ButtonWhite
                buttontext={"Add to cart"}
                onClick={() => sendProductToCart(menu, quantity)}
              />
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
                  <strong>Ingredients: </strong>
                  {menu.ingredients
                    ? menu.ingredients.join(", ") + "."
                    : "No ingredients available."}
                </TabPanel>
                <TabPanel
                  value="2"
                  style={{ fontSize: "25px", fontFamily: "JosefinSans" }}
                >
                  <p>SKU: {menu.sku}</p>
                  <p>Category: {menu.category}</p>
                  <p>
                    Tags:{" "}
                    {menu.tags
                      ? menu.tags.join(", ") + "."
                      : "No tags available."}
                  </p>
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
          {relatedMenus.map((relatedMenu) => (
            <div className="col-3" key={relatedMenu._id}>
              <Link
                to={`/detail/${relatedMenu._id}`}
                onClick={() => {
                  window.scrollTo(0, 0); // Cuộn lên đầu trang
                }}
              >
                <OverlayCard
                  title={relatedMenu.title}
                  description={["$ " + relatedMenu.price]}
                  height="450px"
                  imageSrc={`http://localhost:5000/uploads/${relatedMenu.imageUrl}`}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Detail;

//Gửi món ăn vào giỏ hàng trên server
const sendProductToCart = (menu, quantity) => {
  const data = {
    cartId: "67fb8e201f70bf74520565e7",
    items: [
      {
        _id: menu._id, // ID món ăn từ state menu
        title: menu.title, // Tên món ăn từ state menu
        quantity: quantity, // Số lượng từ state quantity
        price: menu.price, // Giá món ăn từ state menu
      },
    ],
  };
  axios
    .post("http://localhost:5000/api/carts/add", data) // Gửi dữ liệu tới server
    .then((response) => {
      console.log("Data sent successfully:", response.data);
      window.alert(`${menu.title} (${quantity}) đã được thêm vào giỏ hàng!`);
    })
    .catch((error) => {
      console.error("Error sending data:", error);
    });
};
