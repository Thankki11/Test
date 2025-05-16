// Components
import OverlayCard from "../components/OverlayCard/OverlayCard";
import TitleWithSubtitle from "../components/TitleWithSubtitle/TitleWithSubtitle";
import ButtonWhite from "../components/Buttons/ButtonWhite";
import ContactBox from "../components/Box/ContactBox";
import ReservationForm from "../components/ReservationForm";
import ButtonWhite2 from "../components/Buttons/ButtonWhite2";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// media
import logo from "../assets/images/logo-white.jpg";
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
import ReservationBackground from "../assets/images/reservation-background.jpg";
import CardHome from "../components/CardHome";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get("paymentStatus");

    if (paymentStatus === "success") {
      alert("Thanh toán thành công! Đơn hàng của bạn đã được cập nhật.");
      localStorage.removeItem("cart"); // Xóa giỏ hàng trong localStorage
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/"); // Cập nhật trạng thái giỏ hàng
    } else if (paymentStatus === "failed") {
      alert("Thanh toán thất bại. Vui lòng thử lại.");
    } else if (paymentStatus === "checksum_failed") {
      alert("Lỗi xác thực chữ ký. Vui lòng liên hệ hỗ trợ.");
    }
    window.scrollTo(0, 0); // Cuộn lên đầu khi trang được mount
  }, [location, navigate]);

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
        {/* Video background */}
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

        {/* Lớp mờ */}
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

        {/* Nội dung */}
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
                <img
                  src={logo}
                  style={{ width: "auto", height: "100px" }}
                ></img>
                <h6>CFK Fast food</h6>
                <h1 style={{ fontSize: "80px" }}>Best fast food in galaxy</h1>
                <p style={{ color: "white" }}>You can find your food here !</p>
                <ButtonWhite2
                  link ={"/menus"}
                  buttontext={"Discover our menu"}
                  fontSize={"50px"}
                >
                  Discover our menu
                </ButtonWhite2>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End  */}

      {/* ***** Our Menus Start ***** */}
      <div className="section" style={{ backgroundColor: "#fffafa" }}>
        <div className="row">
          <div className="col-sm-9 ">
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
            <Link to="/menus?tab=friedchicken">
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
      {/* ***** Our Menus End ***** */}

      {/* ***** Our Best Seller Start ***** */}
      <div className="section" style={{ backgroundColor: "#b2281f" }}>
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-8 ">
            <h6 className="text-center text-white">
              The culinary minds behind every unforgettable dish
            </h6>
            <h2 className="text-center text-white">Our best seller</h2>
          </div>
          <div className="col-sm-2"></div>
          <div className="col-sm-6 mt-3">
            <CardHome
              title={"Burgers"}
              img={food1}
              description={
                " Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae eligendi eos deserunt sit pariatur, fugit laborum, voluptas fugiat perferendis ut modi, labore cum! Numquam quaerat, eligendi autem quos omnis libero?"
              }
              price={"$20"}
            ></CardHome>
          </div>
          <div className="col-sm-6 mt-3">
            <CardHome
              title={"Burgers"}
              img={food1}
              description={
                " Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae eligendi eos deserunt sit pariatur, fugit laborum, voluptas fugiat perferendis ut modi, labore cum! Numquam quaerat, eligendi autem quos omnis libero?"
              }
              price={"$20"}
            ></CardHome>
          </div>
          <div className="col-sm-6 mt-3">
            <CardHome
              title={"Burgers"}
              img={food1}
              description={
                " Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae eligendi eos deserunt sit pariatur, fugit laborum, voluptas fugiat perferendis ut modi, labore cum! Numquam quaerat, eligendi autem quos omnis libero?"
              }
              price={"$20"}
            ></CardHome>
          </div>
          <div className="col-sm-6 mt-3">
            <CardHome
              title={"Burgers"}
              img={food1}
              description={
                " Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae eligendi eos deserunt sit pariatur, fugit laborum, voluptas fugiat perferendis ut modi, labore cum! Numquam quaerat, eligendi autem quos omnis libero?"
              }
              price={"$20"}
            ></CardHome>
          </div>
        </div>
      </div>
      {/* ***** Our Best Seller End ***** */}

      {/* ***** Promotion Start ***** */}
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
              <Link to="register-class">
                <OverlayCard
                  imageSrc={combo1}
                  height={"245px"}
                  title="Combo 1"
                  description={["1 Fried potatoes, 2 Burgers, 1 Coke"]}
                />
              </Link>
            </div>
            <div style={{ marginTop: "10px" }}>
              <Link to="register-class">
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
            <Link to="/recuitment">
              <OverlayCard
                imageSrc={combo3}
                height={"500px"}
                title="Combo 3"
                description={["2 BanhMi, 1 Large Fried potatoes, 2 Cokes"]}
              />
            </Link>
          </div>
          <div className="col-sm 2">
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
      {/* ***** Promotion End ***** */}

      {/* ***** Join us Start ***** */}
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
      {/* ***** Join us End ***** */}

      {/* ***** Reservation Start ***** */}
      <div
        className="section"
        style={{
          backgroundImage: `url(${ReservationBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {/* Lớp overlay đen mờ */}
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />

        <div className="row" style={{ position: "relative", zIndex: 2 }}>
          <div className="col-6">
            <h6 style={{ color: "white" }}>Your table, your way</h6>
            <h2 style={{ color: "white" }}>
              Here You Can Book a Table — Or Simply Drop By and Dine With Us
            </h2>

            <p style={{ color: "white" }} className="mb-5">
              Whether you’re planning ahead or just passing by, our doors are
              always open. Enjoy authentic flavors, cozy ambiance, and a dining
              experience to remember—your table is ready when you are.
            </p>
            <div className="row">
              <div className="col-6">
                <ContactBox
                  title={"Email"}
                  emails={["namv2704@gmail.com", "company2@gmail.com"]}
                  logo="fa fa-envelope"
                />
              </div>
              <div className="col-6">
                <ContactBox
                  title={"Phone Numbers"}
                  phoneNumbers={["0358109827", "0372817283"]}
                  logo="fa fa-phone"
                />
              </div>
            </div>
          </div>
          <div className="col-1"></div>
          <div
            className="col-5 p-2 rounded"
            style={{ backgroundColor: "white" }}
          >
            <h5 className="text-center mt-3" style={{ fontSize: "30px" }}>
              Book a table
            </h5>
            <ReservationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;