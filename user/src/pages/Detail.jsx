import img1 from "../assets/images/menus/menu-slider-1.jpg";
import ImageBox from "../components/Box/ImageBox";
import ButtonWhite from "../components/Buttons/ButtonWhite";
import OverlayCard from "../components/OverlayCard/OverlayCard";
import TitleWithSubtitle from "../components/TitleWithSubtitle/TitleWithSubtitle";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import QuantitySelector from "../components/QuantitySelector";

function Detail() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <div className="section">
        <div className="row">
          <div className="col-5">
            <ImageBox height="800px" src={img1} alt="menu" />
          </div>
          <div className="col-7">
            <TitleWithSubtitle title="Bruchetta Trio" subTitle="Appetizer" />
            <h5 style={{ fontSize: "35px" }}>$20.00</h5>
            <p style={{ margin: "35px 0px" }}>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse
              beatae, possimus laboriosam mollitia ut eaque perspiciatis quas,
              quos natus architecto ullam animi at in temporibus! Labore
              assumenda repellendus amet. Incidunt.
            </p>
            {/* button quantity, add to cart, buy now */}
            <div style={{ display: "flex", gap: "40px", margin: "40px 0px" }}>
              <QuantitySelector />
              <ButtonWhite buttontext={"Add to cart"} />
              <ButtonWhite buttontext={"Buy now"} />
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
                      label="Ingredient"
                      value="1"
                      style={{
                        fontSize: "20px",
                        fontFamily: "JosefinSans",
                        fontWeight: "bold",
                      }}
                    />
                    <Tab
                      label="Infomation"
                      value="2"
                      style={{
                        fontSize: "20px",
                        fontFamily: "JosefinSans",
                        fontWeight: "bold",
                      }}
                    />
                    <Tab
                      label="Rates"
                      value="3"
                      style={{
                        fontSize: "20px",
                        fontFamily: "JosefinSans",
                        fontWeight: "bold",
                      }}
                    />
                  </TabList>
                </Box>
                <TabPanel
                  value="1"
                  style={{
                    fontSize: "25px",
                    fontFamily: "JosefinSans",
                  }}
                >
                  Cups Fresh Tomatoes Ripe. Clove Garlic Minced. Tablespoons
                  Olive Oil. Teaspoon Balsamic Vinegar. Basil Leaves Chopped.
                  Teaspoon Dried Oregano. Teaspoon Salt. Balsamic Reduction
                  Garnish.
                </TabPanel>
                <TabPanel
                  value="2"
                  style={{
                    fontSize: "25px",
                    fontFamily: "JosefinSans",
                  }}
                >
                  <p>SKU: 032</p>
                  <p>Category: Food</p>
                  <p>Tags: Food, Menu</p>
                </TabPanel>
                <TabPanel
                  value="3"
                  style={{
                    fontSize: "25px",
                    fontFamily: "JosefinSans",
                  }}
                >
                  Item Three
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
          <div className="col-3">
            <OverlayCard
              title="Title"
              description={["Description"]}
              height="450px"
              imageSrc={img1}
            />
          </div>
          <div className="col-3">
            <OverlayCard
              title="Title"
              description={["Description"]}
              height="450px"
              imageSrc={img1}
            />
          </div>
          <div className="col-3">
            <OverlayCard
              title="Title"
              description={["Description"]}
              height="450px"
              imageSrc={img1}
            />
          </div>
          <div className="col-3">
            <OverlayCard
              title="Title"
              description={["Description"]}
              height="450px"
              imageSrc={img1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
