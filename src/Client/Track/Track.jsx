import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DB from '../../config';
import './Track.css';

const Track = () => {
  const [userKey, setUserKey] = useState(null);
  const [orders, setOrders] = useState([]);  // สำหรับเก็บคำสั่งซื้อทั้งหมด
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const response = await fetch(`${DB}user`);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const data = await response.json();
          const matchedUser = data.find((u) => u.email && u.email.toLowerCase() === user.email.toLowerCase());
          if (matchedUser) {
            setUserKey(matchedUser);
            // คัดกรองคำสั่งซื้อทั้งหมดที่เกี่ยวข้องกับผู้ใช้
            const userOrders = data.filter((order) => order.email === matchedUser.email);
            setOrders(userOrders);
          } else {
            setUserKey(null);
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setUserKey(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // ข้อมูล Timeline
  const shippingEvents = [
    { title: 'เตรียมพัสดุ', description: 'พัสดุกำลังถูกจัดเตรียม', completed: true },
    { title: 'จัดส่งพัสดุ', description: 'พัสดุกำลังถูกจัดส่ง', completed: userKey?.status === 'กำลังดำเนินการ' },
    { title: 'จัดส่งเรียบร้อยแล้ว', description: 'พัสดุได้ถูกจัดส่งเรียบร้อยแล้ว', completed: userKey?.status === 'จัดส่งเรียบร้อยแล้ว' }
  ];

  // คอมโพเนนต์ Timeline
  const Timeline = ({ events }) => {
    return (
      <div className="timeline">
        {events.map((event, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-content">
              <h3>
                {event.title}
                {event.completed && <span className="check-icon"> ✔️</span>}
              </h3>
              <p>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="content">
      {userKey ? (
        <div className="box-user-track">
          <h2>คำสั่งซื้อของคุณ</h2>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div key={index} className="order-details" style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                {/* กรอบข้อมูลคำสั่งซื้อ */}
                <div className="user-info" style={{ flex: 1, padding: '10px' }}>
                  <h3>คำสั่งซื้อที่ {index + 1}</h3>
                  <p>Email: {order.email}</p>
                  <p>Details of Purchase: {order.tel_des}</p>
                  <p>Recipient's Name: {order.first_des} {order.last_des}</p>
                  <p>Delivery Date: {order.delivery_date}</p>
                  <p>Status: {order.address_des} {order.district} {order.province} {order.postalCode}</p>
                  <p>Shipping Information: {order.info_shipping}</p>
                </div>

                {/* ส่วน Timeline ข้างๆ กรอบคำสั่งซื้อ */}
                <div className="timeline-section" style={{ flex: 1, padding: '10px' }}>
                  <h3>Timeline การส่งของ</h3>
                  <Timeline events={shippingEvents} />
                </div>
              </div>
            ))
          ) : (
            <p>ยังไม่มีคำสั่งซื้อ</p>
          )}
        </div>
      ) : (
        <p style={{ fontSize: '28px' }}>โปรดเข้าสู่ระบบ</p>
      )}
    </div>
  );
};

export default Track;