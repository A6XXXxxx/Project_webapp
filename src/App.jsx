import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage/HomePage'; 
import Login from './Login/Login'; 
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Client
import Buy from './Client/BuyProducts/Buy';
import Track from './Client/Track/Track';
import Orders from './Client/ListOrders/Orders';
import InfoClient from './Client/Info_client/Info_client';
import PaymentClient from './Client/Payment_client/Payment_client';

// Admin
import User from './Admin/Profile/User_ad';
import List_ad from './Admin/List_ad/List_ad';
import Order_ad from './Admin/Order_ad/Order';
import Adduser from './Admin/Adduser/Adduser';
import Info_order from './Admin/Info_page/info_order';

import { PiFlowerTulip } from "react-icons/pi";
import "./App.css"; 
import DB from './config';

const App = () => {
  const [user, setUser] = useState(null);
  const [userKey, setUserKey] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchUserKey(user.email);
      } else {
        setUser(null);
        setUserKey(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserKey = async (email) => {
    try {
      const response = await fetch(`${DB}check`);
      const data = await response.json();
      const currentUser = data.find((user) => user.email === email);
      
      if (currentUser) {
        setUserKey(currentUser.key);
      } else {
        console.log('User not found in data:', email);
        setUserKey(null);
      }
    } catch (error) {
      console.error('Error fetching user key:', error);
      setUserKey(null);
    }
  };

  return (
    <Router>
      <div>
        <nav className="navbar">
          <div className="logo" onClick={() => window.location.href='/'}>LIL PETALS NOOK <PiFlowerTulip style={{ marginTop: '10px' }}/></div>
          <ul className="menu">
            {userKey === 0 ? (
              <>
                <li><a href="#list_ad" onClick={() => window.location.href='/list_ad'}>รายการสินค้า</a></li>
                <li><a href="#order_ad" onClick={() => window.location.href='/order_ad'}>รายการสั่งซื้อ</a></li>
                <li><a href="#user" onClick={() => window.location.href='/user'}>บัญชีผู้ใช้</a></li>
              </>
            ) : (
              <>
                <li><a href="#buy" onClick={() => window.location.href='/buys'}>เลือกซื้อสินค้า</a></li>
                <li><a href="#track" onClick={() => window.location.href='/tracks'}>ติดตามสถานะสินค้า</a></li>
                <li><a href="#orders" onClick={() => window.location.href='/orders'}>รายการสั่งซื้อสินค้า</a></li>
              </>
            )}
            <div className="auth-buttons">
              {user ? (
                <button 
                  className="auth-button" 
                  onClick={() => window.location.href='/login'}
                >
                  {user.displayName || user.email}
                </button>
              ) : (
                <button className="auth-button" onClick={() => window.location.href='/login'}>
                  สมัครสมาชิก | เข้าสู่ระบบ
                </button>
              )}
            </div>
          </ul>
        </nav>

        <div className="homepage-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/buys" element={<Buy />} />
            <Route path="/tracks" element={<Track />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/info_client" element={<InfoClient />} />
            <Route path="/payment_client" element={<PaymentClient />} />

            <Route path="/user" element={<User />} />
            <Route path="/list_ad" element={<List_ad />} />
            <Route path="/order_ad" element={<Order_ad />} />
            <Route path="/adduser" element={<Adduser />} />
            <Route path="/info_order/:_id" element={<Info_order />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
