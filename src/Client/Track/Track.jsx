import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DB from '../../config';
import './Track.css';

const Track = () => {
  const [userKey, setUserKey] = useState(null);
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
        <div className="box-user-track" style={{ display: 'flex', flexDirection: 'row' }}>
          <div className="user-info" style={{ flex: 1, padding: '20px' }}>
            <p>Email: {userKey.email}</p>
            <p>Details of Purchase: {userKey.details_purchase}</p>
            <p>Recipient's Name: {userKey.first_des} {userKey.sur_des}</p>
            <p>Delivery Date: {userKey.delivery_date}</p>
            <p>Status: {userKey.status}</p>
            <p>Shipping Information: {userKey.info_shipping}</p>
          </div>
          <div className="timeline-section" style={{ flex: 1, padding: '20px' }}>
            <h2>Timeline การส่งของ</h2>
            <Timeline events={shippingEvents} />
          </div>
        </div>
      ) : (
        <p style={{ fontSize: '28px' }}>โปรดเข้าสู่ระบบ</p>
      )}
    </div>
  );
};

export default Track;
