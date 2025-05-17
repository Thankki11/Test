import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Components
import PageHeader from "../components/PageHeader/PageHeader";
import OverlayCard from "../components/OverlayCard/OverlayCard";
import TitleWithSubtitle from "../components/TitleWithSubtitle/TitleWithSubtitle";
import ImageBox from "../components/Box/ImageBox";
import ButtonWhite from "../components/Buttons/ButtonWhite";
import ButtonWhite2 from "../components/Buttons/ButtonWhite2";
import CardHome from "../components/CardHome";

// Media
import logo from "../assets/images/logo-white.png";
import video from "../assets/videos/introduction.mp4";
import food1 from "../assets/images/homefood1.jpg";
import food2 from "../assets/images/homefood2.jpg";
import food3 from "../assets/images/homefood3.jpg";
import food4 from "../assets/images/homefood4.jpg";
import combo1 from "../assets/images/combo1.jpg";
import combo2 from "../assets/images/combo2.jpg";
import combo3 from "../assets/images/combo3.jpg";
import combomore from "../assets/images/combomore.jpg";
import imgBeginnerClass from "../assets/images/beginner-class.jpg";
import imgAdvanceClass from "../assets/images/advance-class.jpg";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [topRatedMenus, setTopRatedMenus] = useState("");

  useEffect(() => {
    // Fetch top-rated menus
    const fetchTopRatedMenus = async () => {
      axios
        .get("http://localhost:3001/api/menus/top-rated")
        .then((response) => {
          setTopRatedMenus(response.data);
        })
        .catch((err) => {
          console.error("Error fetching top-rated menus:", err);
        });
    };

    fetchTopRatedMenus();

    // Handle payment status
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get("paymentStatus");

    if (paymentStatus === "success") {
      alert("Thanh toán thành công! Đơn hàng của bạn đã được cập nhật.");
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/");
    } else if (paymentStatus === "failed") {
      alert("Thanh toán thất bại. Vui lòng thử lại.");
    } else if (paymentStatus === "checksum_failed") {
      alert("Lỗi xác thực chữ ký. Vui lòng liên hệ hỗ trợ.");
    }
    window.scrollTo(0, 0);
  }, [location, navigate]);

  const handleAddToCart = (menu) => {
    if (menu.quantity <= 0) {
      alert("Đã Hết Hàng");
    } else {
      sendProductToCart(menu, 1);
    }
  };

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
        category: menu.category,
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

  return (
    <div>
      {/* Page Header Start */}
      <div
        style={{
          position: "relative",
          height: "85vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            color: "white",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-8">
                <img src={logo} style={{ width: "auto", height: "100px" }} />
                <h6>CFK Fast food</h6>
                <h1 style={{ fontSize: "80px" }}>Best fast food in galaxy</h1>
                <p style={{ color: "white" }}>You can find your food here!</p>
                <ButtonWhite2
                  buttontext={"Discover our menu"}
                  fontSize={"50px"}
                  link={"/menus"}
                >
                  Discover our menu
                </ButtonWhite2>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* Our Menus Start */}
      <div className="section" style={{ backgroundColor: "#fffafa" }}>
        <div className="row">
          <div className="col-sm-9">
            <TitleWithSubtitle
              subTitle={"The culinary minds behind every unforgettable dish"}
              title={"DISCOVER OUR DELICIOUS FOODS"}
            />
          </div>
          <div className="col-sm-3 d-flex align-items-center">
            <Link to="/menus">
              <ButtonWhite buttontext={"Discover all Menus"} />
            </Link>
          </div>
          <div className="col-sm-3">
            <Link to="/menus?tab=burger">
              <OverlayCard
                title={"Burgers"}
                description={[
                  "Juicy, mouthwatering burgers with unique flavors.",
                ]}
                imageSrc={food1}
                height={"350px"}
              />
            </Link>
          </div>
          <div className="col-sm-3">
            <Link to="/menus?tab=pizza">
              <OverlayCard
                title={"Pizzas"}
                description={["Crispy, cheesy pizzas with fresh toppings."]}
                imageSrc={food2}
                height={"350px"}
              />
            </Link>
          </div>
          <div className="col-sm-3">
            <Link to="/menus?tab=fried-chicken">
              <OverlayCard
                title={"Fried Chickens"}
                description={[
                  "Crispy fried chicken with bold, savory seasoning.",
                ]}
                imageSrc={food3}
                height={"350px"}
              />
            </Link>
          </div>
          <div className="col-sm-3">
            <Link to="/menus?tab=drink">
              <OverlayCard
                title={"Drinks"}
                description={["Refreshing drinks to quench your thirst."]}
                imageSrc={food4}
                height={"350px"}
              />
            </Link>
          </div>
        </div>
      </div>
      {/* Our Menus End */}

      {/* Our Best Rated Start */}
      <div className="section" style={{ backgroundColor: "#b2281f" }}>
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-8">
            <h6 className="text-center text-white">
              Our highest-rated dishes loved by our customers
            </h6>
            <h2 className="text-center text-white">Our Best Rated</h2>
          </div>
          <div className="col-sm-2"></div>
          {topRatedMenus.length > 0 ? (
            topRatedMenus.map((menu) => (
              <div className="col-sm-6 mt-3" key={menu._id}>
                <CardHome
                  title={menu.name}
                  img={`http://localhost:3001${menu.imageUrl}`}
                  description={menu.description}
                  price={`$${Number(menu.price).toFixed(2)}`}
                  actionOnClick={() => handleAddToCart(menu)}
                />
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-white">
              <p>No top-rated menus available at the moment.</p>
            </div>
          )}
        </div>
      </div>
      {/* Our Best Rated End */}

      {/* Promotion Start */}
      <div className="section">
        <div className="row">
          <div className="col-sm-7">
            <p>
              Indulge in our carefully crafted combos, offering the perfect mix
              of your favorite dishes at an unbeatable price. Whether you're
              craving a burger and fries, a pizza with refreshing drinks, or a
              hearty fried chicken platter, we've got the ideal combo to satisfy
              your hunger. Enjoy great value without compromising on taste!
            </p>
          </div>
          <div className="col-sm-5 text-end">
            <h6>Amazing Combo Offers Just for You</h6>
            <h2>Combos</h2>
          </div>
          <div className="col-sm-5">
            <div>
              <Link to="/combo-detail/68287feeb5ab96bc41abd97e">
                <OverlayCard
                  imageSrc={combo1}
                  height={"245px"}
                  title="Combo 1"
                  description={["1 Fried potatoes, 2 Burgers, 1 Coke"]}
                />
              </Link>
            </div>
            <div style={{ marginTop: "10px" }}>
              <Link to="/combo-detail/68288031b5ab96bc41abd985">
                <OverlayCard
                  imageSrc={combo2}
                  height={"245px"}
                  title="Combo 2"
                  description={[
                    "1 Small Fried Chickens, 1 Salad, 1 Fried potatoes, 1 Coke",
                  ]}
                />
              </Link>
            </div>
          </div>
          <div className="col-sm-5">
            <Link to="/combo-detail/68288054b5ab96bc41abd98d">
              <OverlayCard
                imageSrc={combo3}
                height={"500px"}
                title="Combo 3"
                description={["2 BanhMi, 1 Large Fried potatoes, 2 Cokes"]}
              />
            </Link>
          </div>
          <div className="col-sm-2">
            <Link to="/combos">
              <OverlayCard
                imageSrc={combomore}
                height={"500px"}
                title="More"
                description={[""]}
              />
            </Link>
          </div>
        </div>
      </div>
      {/* Promotion End */}

      {/* Join us Start */}
      <div className="section">
        <div className="row">
          <div className="col-sm-5">
            <TitleWithSubtitle
              title="JOIN US"
              subTitle="Discover New Opportunities"
            />
          </div>
          <div className="col-sm-7">
            <p>
              Whether you're looking to launch your career in the kitchen or
              simply sharpen your skills, we welcome you to be part of our
              vibrant culinary world. Explore two exciting ways to get involved
              below.
            </p>
          </div>
          <div className="col-sm-6">
            <Link to="register-class">
              <OverlayCard
                imageSrc={imgBeginnerClass}
                height={"400px"}
                title="Be our Student"
                description={[
                  "Learn from talented chefs, explore new cuisines, and master the art of cooking.",
                ]}
              />
            </Link>
          </div>
          <div className="col-sm-6">
            <Link to="/recuitment">
              <OverlayCard
                imageSrc={imgAdvanceClass}
                height={"400px"}
                title="Be our Chef"
                description={[
                  "Share your culinary passion, earn income, and inspire food lovers around the world.",
                ]}
              />
            </Link>
          </div>
        </div>
      </div>
      {/* Join us End */}
    </div>
  );
}

export default Home;
