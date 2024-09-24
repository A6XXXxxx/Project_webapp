import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage/HomePage'; // ตรวจสอบให้แน่ใจว่าพาธถูกต้อง

const App = () => {
  return (
    <Router>
      <Routes>
        {/* เส้นทางหลักชี้ไปที่ HomePage */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
