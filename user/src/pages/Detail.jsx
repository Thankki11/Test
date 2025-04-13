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
  const [cart, setCart] = useState([]); // State giả cho giỏ hàng
  const [quantity, setQuantity] = useState(1); // State để lưu số lượng món ăn

  // Hàm gọi API để lấy chi tiết món ăn
  useEffect(() => {
    // Gửi yêu cầu GET tới API để lấy chi tiết món ăn theo id
    axios
      .get(`http://localhost:5000/api/menus/${id}`)
      .then((response) => {
        setMenu(response.data); // Lưu dữ liệu món ăn vào state
        console.log(response.data); // In ra để kiểm tra dữ liệu
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

  // Hàm xử lý khi người dùng nhấn nút "Add to cart"
  const handleAddToCart = () => {
    // Giả sử menu là đối tượng món ăn đã được lấy từ API
    const menu = { id: 1, title: "Pizza", price: 10 }; // Ví dụ

    // Thêm món ăn vào giỏ hàng với số lượng đã chọn
    const existingItem = cart.find((item) => item.id === menu.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === menu.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Nếu món ăn chưa có trong giỏ hàng, thêm mới
      setCart([
        ...cart,
        { id: menu._id, title: menu.title, price: menu.price, quantity },
      ]);
    }
    alert(
      `${menu.title} has been added to the cart with quantity: ${quantity}`
    ); // Thông báo
  };

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
                onClick={handleAddToCart}
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
