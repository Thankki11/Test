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
import PageHeader from "../components/PageHeader/PageHeader";

import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ComboDetail() {
  const [value, setValue] = useState("1");
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [combo, setCombo] = useState(null);
  const [comboItems, setComboItems] = useState([]);

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/combos/${id}`)
      .then((response) => {
        setCombo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching combo detail:", error);
      });
  }, [id]);

  if (!combo) {
    return <div>Loading...</div>;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <PageHeader
        backgroundType={"image"}
        backgroundSrc={img1}
        h2Title={""}
        title={""}
        subTitle={""}
        height="8vh"
      />
      <div className="section">
        <div className="row">
          <div className="col-5">
            <ImageBox
              height="600px"
              src={`http://localhost:3001${
                combo.imageUrl.startsWith("/uploads")
                  ? combo.imageUrl
                  : "/uploads/" + combo.imageUrl
              }`}
              alt="combo"
            />
          </div>
          <div className="col-7">
            <div className="card">
              <div className="card-body">
                <TitleWithSubtitle
                  title={combo.name}
                  subTitle={combo.category || "Combo"}
                />
                <h5 style={{ fontSize: "25px" }}>$ {combo.price}</h5>
                <p style={{ margin: "35px 0px" }}>{combo.description}</p>

                <div style={{ margin: "20px 0" }}>
                  <h4>Items in this combo:</h4>
                  <ul>
                    {comboItems.map((item) => (
                      <li key={item._id}>
                        {item.name} - ${item.price}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{ display: "flex", gap: "30px", margin: "40px 0px" }}
                >
                  <QuantitySelector
                    quantity={quantity}
                    setQuantity={setQuantity}
                    disabled={combo.quantity <= 0}
                  />
                  <ButtonWhite
                    buttontext={"Add to cart"}
                    onClick={() => {
                      if (combo.quantity <= 0) {
                        alert("Out of Stock");
                      } else {
                        sendProductToCart(combo, quantity);
                      }
                    }}
                  />
                  <Link to={combo.quantity > 0 ? "/check-out" : "#"}>
                    <ButtonWhite
                      buttontext={"Buy now"}
                      onClick={(e) => {
                        if (combo.quantity <= 0) {
                          e.preventDefault();
                          alert("Out of Stock");
                        } else {
                          sendProductToCart(combo, quantity, false);
                        }
                      }}
                    />
                  </Link>
                </div>

                <Box sx={{ width: "100%", typography: "body1" }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList onChange={handleChange}>
                        <Tab
                          label="Detail"
                          value="1"
                          style={{
                            fontSize: "15px",
                            fontFamily: "JosefinSans",
                            fontWeight: "bold",
                          }}
                        />
                        <Tab
                          label="Items"
                          value="2"
                          style={{
                            fontSize: "15px",
                            fontFamily: "JosefinSans",
                            fontWeight: "bold",
                          }}
                        />
                      </TabList>
                    </Box>
                    <TabPanel
                      value="1"
                      style={{ fontSize: "18px", fontFamily: "JosefinSans" }}
                    >
                      <div
                        style={{
                          marginBottom: 16,
                          fontWeight: 500,
                          fontSize: 18,
                        }}
                      >
                        {combo.quantity > 0 ? (
                          <>
                            <strong>
                              Available:{" "}
                              <span style={{ color: "green" }}>
                                {combo.quantity}
                              </span>{" "}
                            </strong>
                            items today
                          </>
                        ) : (
                          <span style={{ color: "red" }}>Out of stock</span>
                        )}
                      </div>
                    </TabPanel>
                    <TabPanel
                      value="2"
                      style={{ fontSize: "18px", fontFamily: "JosefinSans" }}
                    >
                      <strong>Items in this combo: </strong>
                      <ul>
                        {comboItems.map((item) => (
                          <li key={item._id}>
                            {item.name} - ${item.price}
                          </li>
                        ))}
                      </ul>
                    </TabPanel>
                  </TabContext>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="row">
          <div className="col-8">
            <h2>Related Combos</h2>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    </div>
  );
}

const sendProductToCart = (combo, quantity, isNotify = true) => {
  const cartId = "67fb8e201f70bf74520565e7";

  // Lấy giỏ hàng từ localStorage, nếu không có thì khởi tạo giỏ hàng mới với mảng combos mặc định
  let cart = JSON.parse(localStorage.getItem("cart")) || {
    cartId,
    combos: [], // Đảm bảo mảng combos luôn tồn tại
    items: [], // Giỏ hàng có thể chứa các loại sản phẩm khác (items)
  };

  // Kiểm tra nếu combo đã có trong giỏ hàng
  const existingItemIndex = cart.combos.findIndex(
    (item) => item._id === combo._id
  );

  if (existingItemIndex !== -1) {
    // Nếu combo đã có trong giỏ hàng, tăng số lượng lên
    cart.combos[existingItemIndex].quantity += quantity;
  } else {
    // Nếu combo chưa có trong giỏ hàng, thêm combo mới
    cart.combos.push({
      _id: combo._id,
      name: combo.name,
      quantity: quantity,
      price: combo.price,
      imageUrl: combo.imageUrl,
      type: "combo",
    });
  }

  // Lưu giỏ hàng vào localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Gửi sự kiện để cập nhật giao diện
  window.dispatchEvent(new Event("cartUpdated"));

  // Thông báo cho người dùng nếu isNotify là true
  if (isNotify) {
    alert(`${combo.name} (${quantity}) added to Cart!`);
  }
};

export default ComboDetail;
