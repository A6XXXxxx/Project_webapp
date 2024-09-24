import React from "react";
import "../App.css"; // External CSS for styling

const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          LIL PETALS NOOK
          <span className="logo-icon"></span>
        </div>
        <ul className="menu">
          <li><a href="#buy">เลือกซื้อสินค้า</a></li>
          <li><a href="#track">ติดตามสถานะสินค้า</a></li>
          <li><a href="#orders">รายการสั่งซื้อสินค้า</a></li>
        </ul>
        <div className="auth-buttons">
          <button className="auth-button">สมัครสมาชิก | เข้าสู่ระบบ</button>
        </div>
      </nav>

      {/* Main Section */}
      <div className="main-section">
        {/* <div className="image-container">
          <img
            src="path-to-your-image.jpg"
            alt="flower bouquet"
            className="flower-image"
          />
        </div> */}
      </div>

      {/* Scroll to top */}
      <div className="scroll-top">
        <button>⬆</button>
      </div>
    </div>
  );
};

export default HomePage;
