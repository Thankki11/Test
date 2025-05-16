import ReservationForm from "../components/ReservationForm";
import ReservationBackground from "../assets/images/reservation-background.jpg";
import ContactBox from "../components/Box/ContactBox";
import ChatBot from "../components/ChatBot/ChatBot";

function Reservation() {
  return (
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
        <div className="col-5 p-2 rounded" style={{ backgroundColor: "white" }}>
          <ChatBot />
        </div>
        <div className="col-1"></div>
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
      </div>
    </div>
  );
}

export default Reservation;
