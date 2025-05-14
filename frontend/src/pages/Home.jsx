// Components
import PageHeader from "../components/PageHeader/PageHeader";
import OverlayCard from "../components/OverlayCard/OverlayCard";
import TitleWithSubtitle from "../components/TitleWithSubtitle/TitleWithSubtitle";
import ImageBox from "../components/Box/ImageBox";
import ButtonWhite from "../components/Buttons/ButtonWhite";
import BasicSlider from "../components/Slider/BasicSlider";
import Reservation from "../components/Forms/Reservation";
import ContactBox from "../components/Box/ContactBox";
import ReservationForm from "../components/ReservationForm";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// media
import imgAboutUs1 from "../assets/images/about-us-1.jpg";
import imgAboutUs2 from "../assets/images/about-us-2.jpg";
import imgAboutUs3 from "../assets/images/about-us-3.jpg";
import video from "../assets/videos/introduction.mp4";
import chef1 from "../assets/images/chefs/chef-1.jpg";
import chef2 from "../assets/images/chefs/chef-2.jpg";
import chef3 from "../assets/images/chefs/chef-3.jpg";
import chef4 from "../assets/images/chefs/chef-4.jpg";
import menuslider1 from "../assets/images/menus/menu-slider-1.jpg";
import menuslider2 from "../assets/images/menus/menu-slider-2.jpg";
import menuslider3 from "../assets/images/menus/menu-slider-3.jpg";
import shopping1 from "../assets/images/shopping/title-wines.jpg";
import shopping2 from "../assets/images/shopping/title-cakes.jpg";
import imgBeginnerClass from "../assets/images/beginner-class.jpg";
import imgAdvanceClass from "../assets/images/advance-class.jpg";
import ReservationBackground from "../assets/images/reservation-background.jpg";

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
      <PageHeader
        backgroundSrc={video}
        backgroundType={"video"}
        buttonText={"Đặt món ngay"}
        h2Title={"restaurant"}
        subTitle={"Welcome to our delicious corner"}
        title={"A3Building"}
        buttonLink={"/menus"}
      />
      {/* ***** About Us Start ***** */}
      <div className="section">
        <div className="row">
          <div className="col-sm-3">
            <TitleWithSubtitle subTitle={"Our Story"} title={"About Us"} />
            <p>
            Bắt đầu từ niềm đam mê ẩm thực của giới trẻ Việt Nam, chúng tôi quyết định
            thành lập để mang đến những món ăn đậm chất Việt, được làm từ nguyên
            liệu tươi ngon và công thức đa dạng. Mỗi món ăn là một câu chuyện,
            và chúng tôi hy vọng được đồng hành cùng bạn trong hành trình thưởng thức!
            </p>
          </div>
          <div className="col-sm-3 justify-content-center d-flex">
            <ImageBox src={imgAboutUs1} height={"450px"} />
          </div>
          <div className="col-sm-3">
            <ImageBox src={imgAboutUs2} height={"450px"} />
          </div>
          <div className="col-sm-3">
            <ImageBox src={imgAboutUs3} height={"450px"} />
          </div>
        </div>
      </div>
      {/* ***** About Us End ***** */}

      {/* ***** Our Chefs Start ***** */}
      <div className="section" style={{ backgroundColor: "#fffafa" }}>
        <div className="row">
          <div className="col-sm-9 ">
            <TitleWithSubtitle
              subTitle={"The culinary minds behind every unforgettable dish"}
              title={"OUR MASTER CHEFS"}
            />
          </div>
          <div className="col-sm-3 d-flex align-items-center">
            {/* <Link to="/chefs">
              <ButtonWhite buttontext={"Discover all Chefs"} />
            </Link> */}
          </div>
          <div className="col-sm-3">
            <OverlayCard
              title={"Randy Walker "}
              description={["Pastry Chef"]}
              imageSrc={chef1}
              height={"450px"}
            />
          </div>
          <div className="col-sm-3">
            <OverlayCard
              title={"Randy Walker "}
              description={["Pastry Chef"]}
              imageSrc={chef2}
              height={"450px"}
            />
          </div>
          <div className="col-sm-3">
            <OverlayCard
              title={"David Martin "}
              description={["Cookie Chef"]}
              imageSrc={chef3}
              height={"450px"}
            />
          </div>
          <div className="col-sm-3">
            <OverlayCard
              title={"Peter Perkson"}
              description={["Pancake Chef"]}
              imageSrc={chef4}
              height={"450px"}
            />
          </div>
        </div>
      </div>
      {/* ***** Our Chefs End ***** */}

      {/* ***** Our Menu Start ***** */}
      <div className="section">
        <div className="row">
          <div className="col-7">
            <BasicSlider
              images={[
                { src: menuslider1, alt: "Menu Slider 1" },
                { src: menuslider2, alt: "Menu Slider 2" },
                { src: menuslider3, alt: "Menu Slider 3" },
              ]}
              width="100%"
              height="450px"
            />
          </div>
          <div className="col-5">
            <TitleWithSubtitle
              title="Best dishes from our Menu"
              subTitle="A3Building’s tasty offer"
            />
            <p>
            Khám phá menu để trải nghiệm những món ăn đậm đà hương vị Việt,
             được chế biến từ nguyên liệu tươi ngon nhất! Từ các món ăn vặt 
             hấp dẫn đến những bữa cơm gia đình ấm cúng, chúng tôi có tất cả
              để làm hài lòng khẩu vị của bạn. Hãy ghé thăm và tìm món yêu thích 
              ngay hôm nay!
            </p>

            <Link to="/menus">
              <ButtonWhite buttontext={"Khám phá menu"} />
            </Link>
          </div>
        </div>
      </div>
      {/* ***** Our Menu End ***** */}

      {/* ***** E-Shopping ***** */}
      <div className="section" style={{ backgroundColor: "#fffafa" }}>
        <div className="row">
          <div className="col-sm-6 d-flex align-items-center">
            <div>
              <TitleWithSubtitle
                title="E-Shopping"
                subTitle="Fast - Easy - Anywhere"
              />
              <p className="mb-5 me-5">
              Tận hưởng sự tiện lợi khi mua sắm mọi lúc, 
              mọi nơi với những sản phẩm yêu thích của bạn. 
              Từ các những cốc cafe đến những món ăn độc đáo, 
              cửa hàng trực tuyến của chúng tôi được thiết kế 
              để mang đến cho bạn trải nghiệm mua sắm nhanh chóng, 
              dễ dàng và đầy thú vị.
              </p>
              {/* <Link to="/shop">
                <ButtonWhite buttontext={"Explore all category"} />
              </Link> */}
            </div>
          </div>
          <div className="col-sm-3">
            <OverlayCard
              imageSrc={shopping1}
              height={"500px"}
              title="Wines"
              description={["nice wines is here"]}
            />
          </div>
          <div className="col-sm-3">
            <OverlayCard
              imageSrc={shopping2}
              height={"500px"}
              title="Cakes"
              description={["we have delicious cakes"]}
            />
          </div>
        </div>
      </div>
      {/* ***** E-Shopping End ***** */}

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
            Dù bạn đang tìm kiếm cơ hội bắt đầu sự nghiệp trong 
            gian bếp hay đơn giản chỉ muốn trau dồi kỹ năng nấu nướng, 
            chúng tôi luôn chào đón bạn trở thành một phần của thế giới 
            ẩm thực sôi động này. Hãy liên lạc qua địa chỉ của chúng tôi ở dưới.
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
            Dù bạn đang lên kế hoạch từ trước hay chỉ tình cờ ghé qua, 
            cánh cửa của chúng tôi luôn rộng mở. Hãy tận hưởng hương vị 
            đậm đà, không gian ấm cúng và một trải nghiệm ẩm thực đáng 
            nhớ — bàn ăn của bạn luôn sẵn sàng bất cứ khi nào bạn đến.
            </p>
            <div className="row">
              <div className="col-6">
                <ContactBox
                  title={"Email"}
                  emails={["nhom3.food@gmail.com"]}
                  logo="fa fa-envelope"
                />
              </div>
              <div className="col-6">
                <ContactBox
                  title={"Phone Number"}
                  phoneNumbers={["0966666666"]}
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
