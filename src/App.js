import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage/HomePage'; 
import Login from './Login/Login'; 
import Buy from './BuyProducts/Buy';
import Track from './Track/Track';
import Orders from './ListOrders/Orders';
import "./App.css"; 

const App = () => {
  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="logo" onClick={() => window.location.href='/'}>LIL PETALS NOOK </div>
          <ul className="menu">
            <li><a href="#buy" onClick={() => window.location.href='/buys'}>เลือกซื้อสินค้า</a></li>
            <li><a href="#track" onClick={() => window.location.href='/tracks'}>ติดตามสถานะสินค้า</a></li>
            <li><a href="#orders" onClick={() => window.location.href='/orders'}>รายการสั่งซื้อสินค้า</a></li>
          </ul>
          <div className="auth-buttons">
            <button className="auth-button" onClick={() => window.location.href='/login'}>
              สมัครสมาชิก | เข้าสู่ระบบ
            </button>
          </div>
        </nav>

        <div className="homepage-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/buys" element={<Buy />}/>
            <Route path="/tracks" element={<Track />}/>
            <Route path="/orders" element={<Orders />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
