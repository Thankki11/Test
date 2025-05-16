import PageHeader from "../components/PageHeader/PageHeader";
import img1 from "../assets/images/menus/menu-slider-1.jpg";

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
    </div>
  );
}

export default Combo;