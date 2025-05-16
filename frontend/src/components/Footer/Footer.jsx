import styles from "./Footer.module.css"; // import CSS module

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container-fluid">
        <div className="row g-4">
          {/* Company Info */}
          <div className="col-6 col-md-6">
            <h5 className="mb-4">About Us</h5>
            <p className="mb-4" style={{ paddingRight: "150px" }}>
            Chúng tôi mong muốn mang đến những bữa ăn ngon
            và chất lượng cao cho mọi gia đình. Với nguồn nguyên
            liệu tươi ngon và đội ngũ đầu bếp tận tâm, chúng tôi
            cam kết mang lại trải nghiệm ẩm thực tuyệt vời.
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
                <a href="/reservation" className={styles.footerLink}>
                  Book table
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
                96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội
              </li>
              <li className="mb-3">
                <i className="fas fa-phone me-2"></i>
                <a href="tel:+84966666666" className={styles.footerLink}>
                  +84 966 666 666
                </a>
              </li>
              <li className="mb-3">
                <i className="fas fa-envelope me-2"></i>
                <a
                  href="mailto:contact@example.com"
                  className={styles.footerLink}
                >
                  nhom3.food@gmail.com
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
                &copy; 2025 Nhóm 3. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
