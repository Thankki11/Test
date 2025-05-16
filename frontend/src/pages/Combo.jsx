import React, { useEffect, useState } from "react";
import axios from "axios";
import img1 from "../assets/images/menus/menu-slider-1.jpg";

import OverlayCard from "../components/OverlayCard/OverlayCard";
import PageHeader from "../components/PageHeader/PageHeader";

function Combo() {
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/combos")
      .then(res => setCombos(res.data))
      .catch(() => setCombos([]));
  }, []);

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
            {combos.map((combo) => (
              <div className="col-6 mt-3" key={combo._id}>
                <OverlayCard
                  imageSrc={combo.imageUrl}
                  height={"245px"}
                  title={combo.name}
                  description={[
                    combo.description,
                    ...combo.items.map(item => `${item.name} x${item.quantity}`)
                  ]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Combo;
