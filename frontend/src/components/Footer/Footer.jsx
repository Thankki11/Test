import styles from "./Footer.module.css"; // import CSS module

const Footer = () => {
  return (
    <footer id ="footer" className="bg-dark text-light py-5">
      <div className="container-fluid">
        <div className="row g-4">
          {/* Company Info */}
          <div className="col-6 col-md-6">
            <h5 className="mb-4">About Us</h5>
            <p className="mb-4" style={{ paddingRight: "150px" }}>
              From CFK FastFood With Passion, we are a devoted team of food enthusiasts 
              committed to delivering top-notch fast food experiences, using fresh ingredients and 
              creative recipes to craft delicious, high-quality meals that delight your taste buds and create unforgettable moments.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className={styles.footerLink}>
                  Home
                </a>
              </li>
              
              <li className="mb-2">
                <a href="/menus" className={styles.footerLink}>
                  Discover menus
                </a>
              </li>
              <li className="mb-2">
                <a href="/combos  " className={styles.footerLink}>
                  ComBo
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-2 col-md-6">
            <h5 className="mb-4">Our services</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/login" className={styles.footerLink}>
                  Login
                </a>
              </li>
              <li className="mb-2">
                <a href="/register" className={styles.footerLink}>
                  Register
                </a>
              </li>
              <li className="mb-2">
                <a href="/check-out" className={styles.footerLink}>
                  Check out
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-2 col-md-6">
            <h5 className="mb-4">Contact Info</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <i className="fas fa-map-marker-alt me-2"></i>
                Tran Phu , Ha Dong , Ha Noi , Viet Nam 
              </li>
              <li className="mb-3">
                <i className="fas fa-phone me-2"></i>
                <a href="tel:+1234567890" className={styles.footerLink}>
                  0976412697
                </a>
              </li>
              <li className="mb-3">
                <i className="fas fa-envelope me-2"></i>
                <a
                  href="mailto:contact@example.com"
                  className={styles.footerLink}
                >
                  CFKfastfood@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="row mt-5">
          <div className="col-12">
            <hr className="mb-4" />
            <div className="text-center">
              <p className="mb-0">
                &copy; 2025 CFK FastFood. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
