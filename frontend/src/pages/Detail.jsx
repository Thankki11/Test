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
import { useParams } from "react-router-dom"; // Thêm hook useParams để lấy id từ URL

function Detail() {
  const [menu, setMenu] = useState(null); // State để lưu dữ liệu món ăn
  const [relatedMenus, setRelatedMenus] = useState([]); // State để lưu danh sách món ăn liên quan
  const [value, setValue] = useState("1");
  const { id } = useParams(); // Lấy id từ URL
  const [quantity, setQuantity] = useState(1); // State để lưu số lượng món ăn
  const [reviews, setReviews] = useState([]);
  const [userCanReview, setUserCanReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewMessage, setReviewMessage] = useState("");

  // Reset quantity về 1 mỗi khi id (menuId) thay đổi
  useEffect(() => {
    setQuantity(1);
  }, [id]);

  // Hàm gọi API để lấy chi tiết món ăn
  useEffect(() => {
    // Gửi yêu cầu GET tới API để lấy chi tiết món ăn theo id
    axios
      .get(`http://localhost:3001/api/menus/${id}`)
      .then((response) => {
        setMenu(response.data); // Lưu dữ liệu món ăn vào state
        axios
          .get(
            `http://localhost:3001/api/menus/category/${response.data.category}`
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

  useEffect(() => {
    if (!menu) return;
    // Lấy đánh giá sản phẩm
    axios
      .get(`http://localhost:3001/api/menus/${menu._id}/reviews`)
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]));
    // Kiểm tra user đã mua chưa
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3001/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const orders = res.data || [];
          const hasBought = orders.some((order) =>
            (order.items || []).some(
              (item) =>
                item.menuItemId === menu._id ||
                item.menuItemId === menu._id?.toString()
            )
          );
          setUserCanReview(hasBought);
        })
        .catch(() => setUserCanReview(false));
    } else {
      setUserCanReview(false);
    }
  }, [menu]);

  if (!menu) {
    return <div>Loading...</div>; // Nếu chưa có dữ liệu món ăn, hiển thị loading
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setReviewMessage("You need to login to leave a review.");
        return;
      }
      await axios.post(
        `http://localhost:3001/api/menus/${menu._id}/reviews`,
        reviewForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviewMessage("Review completed!");
      setReviewForm({ rating: 5, comment: "" });
      // Reload reviews
      const res = await axios.get(
        `http://localhost:3001/api/menus/${menu._id}/reviews`
      );
      setReviews(res.data);
    } catch (err) {
      setReviewMessage(
        err.response?.data?.message || "Có lỗi khi gửi đánh giá."
      );
    }
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
                menu.imageUrl.startsWith("/uploads")
                  ? menu.imageUrl
                  : "/uploads/" + menu.imageUrl
              }`}
              alt="menu"
            />
          </div>
          <div className="col-7">
            <div className="card">
              <div className="card-body">
                <TitleWithSubtitle title={menu.name} subTitle={menu.category} />
                <h5 style={{ fontSize: "25px" }}>$ {menu.price}</h5>
                <p style={{ margin: "35px 0px" }}>{menu.description}</p>
                {/* button quantity, add to cart, buy now */}
                <div
                  style={{ display: "flex", gap: "30px", margin: "40px 0px" }}
                >
                  <QuantitySelector
                    quantity={quantity}
                    setQuantity={setQuantity}
                    disabled={menu.quantity <= 0}
                  />
                  <ButtonWhite
                    buttontext={"Add to cart"}
                    onClick={() => {
                      if (menu.quantity <= 0) {
                        alert("Đã Hết Hàng");
                      } else {
                        sendProductToCart(menu, quantity);
                      }
                    }}
                  />
                  <Link to={menu.quantity > 0 ? "/check-out" : "#"}>
                    <ButtonWhite
                      buttontext={"Buy now"}
                      onClick={(e) => {
                        if (menu.quantity <= 0) {
                          e.preventDefault();
                          alert("Đã Hết Hàng");
                        } else {
                          sendProductToCart(menu, quantity, false);
                        }
                      }}
                    />
                  </Link>
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
                          label="Detail"
                          value="1"
                          style={{
                            fontSize: "15px",
                            fontFamily: "JosefinSans",
                            fontWeight: "bold",
                          }}
                        />
                        <Tab
                          label="Ingredient"
                          value="2"
                          style={{
                            fontSize: "15px",
                            fontFamily: "JosefinSans",
                            fontWeight: "bold",
                          }}
                        />
                        <Tab
                          label="Reviews"
                          value="3"
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
                      {/* Hiển thị số lượng còn lại */}
                      <div
                        style={{
                          marginBottom: 16,
                          fontWeight: 500,
                          fontSize: 18,
                        }}
                      >
                        {menu.quantity > 0 ? (
                          <>
                            <strong>
                              Available:{" "}
                              <span style={{ color: "green" }}>
                                {menu.quantity}
                              </span>{" "}
                            </strong>
                            items today
                          </>
                        ) : (
                          <span style={{ color: "red" }}>Out of stock</span>
                        )}
                      </div>
                      <p style={{ fontSize: "18px" }}>
                        <span style={{ fontWeight: "bold" }}>Category:</span>{" "}
                        {menu.category}
                      </p>
                      <p style={{ fontSize: "18px" }}>
                        <span style={{ fontWeight: "bold" }}>Tags:</span>{" "}
                        {menu.tags
                          ? menu.tags.join(", ") + "."
                          : "No tags available."}
                      </p>
                      <p style={{ fontSize: "18px" }}>
                        <span style={{ fontWeight: "bold" }}>Rate:</span> 3 sao
                        (Chưa code finalnakldnskldnadjkas kldnadjkasnasdjsakd
                        ánkasjnkdas)
                      </p>
                    </TabPanel>
                    <TabPanel
                      value="2"
                      style={{ fontSize: "18px", fontFamily: "JosefinSans" }}
                    >
                      <strong>Ingredients: </strong>
                      {menu.ingredients
                        ? menu.ingredients.join(", ") + "."
                        : "No ingredients available."}
                    </TabPanel>
                    <TabPanel
                      value="3"
                      style={{ fontSize: "18px", fontFamily: "JosefinSans" }}
                    >
                      {/* Đánh giá sản phẩm */}
                      <div className="row">
                        <div className="col-12">
                          {reviews.length === 0 && <p>No reviews yet.</p>}
                          {reviews.map((r, idx) => (
                            <div
                              key={idx}
                              style={{
                                borderBottom: "1px solid #e0e0e0",
                                marginBottom: 8,
                                paddingBottom: 8,
                                paddingTop: 16,
                              }}
                            >
                              <div>
                                <b style={{ color: "#333" }}>
                                  {r.username || "Anonymous"}
                                </b>
                                <span
                                  style={{
                                    color: "#ffb400",
                                    marginLeft: 8,
                                  }}
                                >
                                  {"★".repeat(r.rating)}
                                  {"☆".repeat(5 - r.rating)}
                                </span>
                              </div>

                              <div
                                style={{
                                  color: "#444",
                                  lineHeight: 1.5,
                                }}
                              >
                                {r.comment}
                              </div>

                              <div style={{ fontSize: 14, color: "#aaa" }}>
                                {new Date(r.createdAt).toLocaleString()}
                              </div>
                            </div>
                          ))}

                          {userCanReview && (
                            <div className="card">
                              <div className="card-header d-flex justify-content-center align-content-center">
                                <h2
                                  style={{
                                    fontSize: "20px",
                                    margin: "0px, 0px",
                                    padding: "0px 0px",
                                  }}
                                >
                                  Write your review
                                </h2>
                              </div>
                              <div className="card-body">
                                <form
                                  onSubmit={handleReviewSubmit}
                                  style={{ marginTop: 16 }}
                                >
                                  <div>
                                    <div className="d-flex align-items-center gap-3">
                                      <label>Rate: </label>
                                      <div style={{ display: "flex", gap: 8 }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <span
                                            key={star}
                                            onClick={() =>
                                              setReviewForm((f) => ({
                                                ...f,
                                                rating: star,
                                              }))
                                            }
                                            style={{
                                              fontSize: 30,
                                              cursor: "pointer",
                                              color:
                                                star <= reviewForm.rating
                                                  ? "#ffb400"
                                                  : "#ccc", // Vàng nếu đã chọn, xám nếu chưa
                                              transition:
                                                "color 0.3s ease, transform 0.3s ease", // Hiệu ứng chuyển màu và phóng to
                                            }}
                                            onMouseEnter={(e) => {
                                              // Thay đổi màu khi hover
                                              e.target.style.color = "#ffb400";
                                              e.target.style.transform =
                                                "scale(1.2)"; // Phóng to khi hover
                                            }}
                                            onMouseLeave={(e) => {
                                              // Trả về màu sắc mặc định khi không hover
                                              e.target.style.color =
                                                star <= reviewForm.rating
                                                  ? "#ffb400"
                                                  : "#ccc";
                                              e.target.style.transform =
                                                "scale(1)"; // Trở về kích thước ban đầu
                                            }}
                                          >
                                            ★
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div style={{ marginTop: 8 }}>
                                    <textarea
                                      value={reviewForm.comment}
                                      onChange={(e) =>
                                        setReviewForm((f) => ({
                                          ...f,
                                          comment: e.target.value,
                                        }))
                                      }
                                      placeholder="Your comment..."
                                      rows={3}
                                      style={{
                                        width: "100%",
                                        borderRadius: 6,
                                        border: "1px solid #ccc",
                                        padding: 8,
                                      }}
                                    />
                                  </div>
                                  <button
                                    type="submit"
                                    style={{ marginTop: 8 }}
                                  >
                                    Submit Review
                                  </button>
                                  {reviewMessage && (
                                    <div
                                      style={{
                                        color: reviewMessage.includes("success")
                                          ? "green"
                                          : "red",
                                        marginTop: 8,
                                      }}
                                    >
                                      {reviewMessage}
                                    </div>
                                  )}
                                </form>
                              </div>
                            </div>
                          )}
                          {!userCanReview && (
                            <div style={{ color: "#888", marginTop: 8 }}>
                              Only customers who have purchased this product can
                              leave a review.
                            </div>
                          )}
                        </div>
                      </div>
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
                  title={relatedMenu.name}
                  description={["$ " + relatedMenu.price]}
                  height="350px"
                  imageSrc={`http://localhost:3001${
                    relatedMenu.imageUrl.startsWith("/uploads")
                      ? relatedMenu.imageUrl
                      : "/uploads/" + relatedMenu.imageUrl
                  }`}
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

//Lưu món ăn kèm số lượng vào LocalStorage
const sendProductToCart = (menu, quantity, isNotify = true) => {
  const cartId = "67fb8e201f70bf74520565e7"; // Giỏ hàng mặc định hoặc lấy từ localStorage

  // Lấy giỏ hàng hiện tại từ localStorage hoặc khởi tạo giỏ hàng mới nếu không tồn tại
  let cart = JSON.parse(localStorage.getItem("cart")) || {
    cartId,
    items: [],
    combos: [],
  };

  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const existingItemIndex = cart.items.findIndex(
    (item) => item._id === menu._id
  );

  if (existingItemIndex !== -1) {
    // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Nếu không có sản phẩm, thêm mới vào giỏ hàng
    cart.items.push({
      _id: menu._id,
      name: menu.name,
      quantity: quantity,
      price: menu.price,
      imageUrl: menu.imageUrl,
    });
  }

  // Lưu lại giỏ hàng vào localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Gửi sự kiện custom để các component khác biết
  window.dispatchEvent(new Event("cartUpdated"));

  if (isNotify) {
    // Thông báo cho người dùng
    alert(`${menu.name} (${quantity}) added to Cart!`);
  }
};
