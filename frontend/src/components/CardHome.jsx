import ButtonWhite2 from "./Buttons/ButtonWhite2";
function CardHome({ title, description, price, img }) {
  return (
    <div class="card">
      <div class="card-body">
        <div className="row">
          <div className="col-4">
            <img
              src={img}
              alt="Food 1"
              className="img-fluid"
              style={{
                width: "30vw",
                height: "25vh",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
          </div>
          <div
            className="col-8"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2 style={{ fontSize: "30px" }}>{title}</h2>
              <p
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {description}
              </p>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <h2 style={{ fontSize: "25px" }}>{price}</h2>
              <ButtonWhite2 buttontext={"Add to cart"}></ButtonWhite2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardHome;