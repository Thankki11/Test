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
    axios.get(`http://localhost:3001/api/menus/${menu._id}/reviews`)
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]));
    // Kiểm tra user đã mua chưa
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:3001/api/orders/my-orders", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          const orders = res.data || [];
          const hasBought = orders.some(order =>
            (order.items || []).some(item => (item.menuItemId === menu._id || item.menuItemId === menu._id?.toString()))
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
        setReviewMessage("Bạn cần đăng nhập để đánh giá.");
        return;
      }
      await axios.post(
        `http://localhost:3001/api/menus/${menu._id}/reviews`,
        reviewForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviewMessage("Đánh giá thành công!");
      setReviewForm({ rating: 5, comment: "" });
      // Reload reviews
      const res = await axios.get(`http://localhost:3001/api/menus/${menu._id}/reviews`);
      setReviews(res.data);
    } catch (err) {
      setReviewMessage(err.response?.data?.message || "Có lỗi khi gửi đánh giá.");
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
            <TitleWithSubtitle title={menu.name} subTitle={menu.category} />
            <h5 style={{ fontSize: "25px" }}>$ {menu.price}</h5>
            <p style={{ margin: "35px 0px" }}>{menu.description}</p>
            {/* button quantity, add to cart, buy now */}
            <div style={{ display: "flex", gap: "30px", margin: "40px 0px" }}>
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
              <ButtonWhite
                buttontext={"Add to cart"}
                onClick={() => sendProductToCart(menu, quantity)}
              />
              <Link to={"/check-out"}>
                <ButtonWhite
                  buttontext={"Buy now"}
                  onClick={() => sendProductToCart(menu, quantity, false)}
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
                  ></TabList>
                </Box>

                <TabPanel
                  value="2"
                  style={{ fontSize: "18px", fontFamily: "JosefinSans" }}
                >
                  <p style={{ fontSize: "18px" }}>SKU: {menu.sku}</p>
                  <p style={{ fontSize: "18px" }}>Category: {menu.category}</p>
                  <p style={{ fontSize: "18px" }}>
                    Tags:{" "}
                    {menu.tags
                      ? menu.tags.join(", ") + "."
                      : "No tags available."}
                  </p>
                </TabPanel>
                <TabPanel
                  value="3"
                  style={{ fontSize: "18px", fontFamily: "JosefinSans" }}
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
        {/* Đánh giá sản phẩm */}
        <div className="row mt-5">
          <div className="col-12">
            <h3>Đánh giá sản phẩm</h3>
            {reviews.length === 0 && <p>Chưa có đánh giá nào.</p>}
            {reviews.map((r, idx) => (
              <div key={idx} style={{ borderBottom: '1px solid #eee', marginBottom: 8, paddingBottom: 8 }}>
                <b>{r.username || 'Người dùng'}</b> - <span>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <div>{r.comment}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{new Date(r.createdAt).toLocaleString()}</div>
              </div>
            ))}
            {userCanReview && (
              <form onSubmit={handleReviewSubmit} style={{ marginTop: 16 }}>
                <div>
                  <label>Chọn số sao: </label>
                  <select value={reviewForm.rating} onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))}>
                    {[1,2,3,4,5].map(star => <option key={star} value={star}>{star}</option>)}
                  </select>
                </div>
                <div style={{ marginTop: 8 }}>
                  <textarea
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Nhận xét của bạn..."
                    rows={3}
                    style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 8 }}
                  />
                </div>
                <button type="submit" style={{ marginTop: 8 }}>Gửi đánh giá</button>
                {reviewMessage && <div style={{ color: reviewMessage.includes('thành công') ? 'green' : 'red', marginTop: 8 }}>{reviewMessage}</div>}
              </form>
            )}
            {!userCanReview && <div style={{ color: '#888', marginTop: 8 }}>Chỉ khách đã mua sản phẩm này mới được đánh giá.</div>}
          </div>
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
  let cart = JSON.parse(localStorage.getItem("cart")) || { cartId, items: [] };

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
