import img1 from "../assets/images/menus/menu-slider-1.jpg";
import combo1 from "../assets/images/combo1.jpg";

import { Link, useLocation, useNavigate } from "react-router-dom";
import OverlayCard from "../components/OverlayCard/OverlayCard";
import PageHeader from "../components/PageHeader/PageHeader";

function Combo() {
  return (
    <div>
      <PageHeader
        backgroundType={"image"}
        backgroundSrc={img1}
        h2Title={""}
        title={"Combos"}
        subTitle={"Welcome to our delicious corner"}
        height="65vh"
      />
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h6>Let's find out your best</h6>
              <h2>Combos</h2>
            </div>
            <div className="col-6 mt-3">
              <Link to="register-class">
                <OverlayCard
                  imageSrc={combo1}
                  height={"245px"}
                  title="Combo 1"
                  description={["1 Fried potatoes, 2 Burgers, 1 Coke"]}
                />
              </Link>
            </div>
            <div className="col-6 mt-3">
              <Link to="register-class">
                <OverlayCard
                  imageSrc={combo1}
                  height={"245px"}
                  title="Combo 1"
                  description={["1 Fried potatoes, 2 Burgers, 1 Coke"]}
                />
              </Link>
            </div>
            <div className="col-6 mt-3">
              <Link to="register-class">
                <OverlayCard
                  imageSrc={combo1}
                  height={"245px"}
                  title="Combo 1"
                  description={["1 Fried potatoes, 2 Burgers, 1 Coke"]}
                />
              </Link>
            </div>
            <div className="col-6 mt-3">
              <Link to="register-class">
                <OverlayCard
                  imageSrc={combo1}
                  height={"245px"}
                  title="Combo 1"
                  description={["1 Fried potatoes, 2 Burgers, 1 Coke"]}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Combo;
