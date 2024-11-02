import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DB from '../../config';
import { IoChevronBackOutline } from "react-icons/io5";

const InfoOrder = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [infoShipping, setInfoShipping] = useState(''); 

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${DB}user/${_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        const formattedOrder = {
          _id: data._id,
          id: data.id,
          email: data.Column1,
          customerName: `${data.first_name} ${data.last_name}`,
          tel: data.tel,
          payment: data.payment,
          paymentStatus: data.payment_status,
          productDetails: data.details_purchase,
          deliveryDate: data.delivery_date,
          address: data.address_des,
          telDes: data.tel_des,
          status: data.status,
          infoShipping: data.info_shipping,
        };
        setOrder(formattedOrder);
        setInfoShipping(data.info_shipping || ''); 
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [_id]);

  if (!order) return <div>Loading order details...</div>;

  const handleSave = async () => {
    try {
      const response = await fetch(`${DB}user/saveTrack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id, info_shipping: infoShipping }), 
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleCancel = () => {
    navigate('/order_ad'); 
  };

  return (
    <div className='content' style={{
      width: '1800px',
      height: '700px',
      margin: '75px 0px 0px 25px',
      padding: '20px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#A9704D',
      borderRadius: '20px',
      fontFamily: 'IBM Plex Sans Thai, sans-serif',
      display: 'flex',
      gap: '20px',
      flexDirection: 'row'
    }}>
      <div style={{ flex: 1, border: '1px none #A9704D', borderRadius: '10px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate(-1)}>
          <IoChevronBackOutline style={{ fontSize: '24px', marginRight: '10px' }} />
          <span style={{ fontSize: '24px' }}>ข้อมูลหมายเลขออเดอร์ ลำดับที่ {order.id}</span>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h3>รายละเอียดผู้สั่งซื้อ</h3>
          <p>ชื่อผู้สั่ง : {order.customerName}</p>
          <p>เบอร์โทรศัพท์ : {order.tel}</p>
          <p>อีเมล : {order.email}</p>
          <p>สั่งเมื่อเวลา : {order.deliveryDate}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>รายละเอียดผู้รับสินค้า</h3>
          <p>ชื่อ : {order.customerName}</p>
          <p>ที่อยู่ : {order.address}</p>
          <p>เบอร์โทรศัพท์ : {order.telDes}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>รายละเอียดสินค้า</h3>
          <p>{order.productDetails}</p>
        </div>
      </div>

      <div style={{ flex: 1, border: '1px none #A9704D', borderRadius: '10px', padding: '20px' }}>
        <h3>รายละเอียดการชำระเงิน</h3>
        <p>ช่องทางการชำระเงิน : {order.payment}</p>
        <p>สถานะการชำระเงิน : {order.paymentStatus}</p>
        <h3>รายละเอียดการขนส่ง</h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ margin: 0, marginRight: '10px' }}>การจัดส่ง :</p>
          <input
            type="text"
            value={infoShipping}
            onChange={(e) => setInfoShipping(e.target.value)} 
            style={{ flex: 1 }}
          />
        </div>
        <div className="button-container" >
          <button className="btn btn-accent" style={{ backgroundColor: '#C39A74', width:'250px',fontSize:'26px',fontWeight:'300' }} onClick={handleSave}>ตกลง</button>
          <button className="btn btn-accent" style={{ backgroundColor: '#808080', width:'250px',fontSize:'26px',fontWeight:'300' }} onClick={handleCancel}>ยกเลิก</button>
        </div>
      </div>
    </div>
  );
};

export default InfoOrder;
