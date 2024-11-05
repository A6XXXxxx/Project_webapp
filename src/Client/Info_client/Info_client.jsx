import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import "./Info_client.css";
import { useNavigate } from "react-router-dom";
import DB from '../../config';
import { GrCaretNext } from "react-icons/gr";
import Swal from 'sweetalert2';

const InfoClient = () => {
    const [basketItems, setBasketItems] = useState([]);
    const [userEmail, setUserEmail] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        tel: '',
        first_des: '',
        sur_des: '',
        delivery_date: '',
        delivery_time: '',
        tel_des: '',
        deliveryAddress: '',
        postalCode: '',
        province: '',
        district: '',
        cardMessage: ''
    });
    const provinces = ["สระแก้ว", "ปราจีนบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ระยอง", "จันทบุรี", "ตราด"];

    const today = new Date().toISOString().split("T")[0];

    // Generate time options in 30-minute intervals from 09:00 to 20:30
    const timeOptions = [];
    for (let hour = 9; hour <= 20; hour++) {
        for (let minute of [0, 30]) {
            if (hour === 20 && minute > 30) break;
            const formattedTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
            timeOptions.push(formattedTime);
        }
    }

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                fetchBasketItems(user.email); 
            } else {
                setUserEmail(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchBasketItems = async (email) => {
        try {
            const response = await axios.get(`${DB}basket/get_items?email=${email}`);
            setBasketItems(response.data);
        } catch (error) {
            console.error("Error fetching basket items:", error);
        }
    };

    const totalPrice = basketItems.reduce((total, item) => total + item.price * item.count, 0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        for (const key in formData) {
            if (!formData[key]) {
                await Swal.fire({
                    title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                    icon: 'warning',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
        }

        const combinedAddress = `${formData.address_des} ${formData.district} ${formData.province}, ${formData.postalCode}`;

        const dataToSubmit = {
            ...formData,
            email: userEmail,
            address_des: combinedAddress,
            totalPrice,
        };

        navigate('/payment_client', { state: { submittedData: dataToSubmit, basketItems } });
    };    

    return (
        <div className="content" style={{ background: '#D5BB9C', width: '100%', maxWidth: '1200px', margin: '80px auto', borderRadius: '20px', display: 'flex', padding: '20px', gap: '20px', flexDirection: 'row' }}>
            {/* Left Column: Customer Information */}
            <div className="client-info" style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '20px' }}>
                <h2>ข้อมูลลูกค้า</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <h3 style={{fontWeight:'400',background:'#A9704D',color:'#FFF'}}>ข้อมูลผู้ส่ง</h3>
                    <input type="text" name="first_name" placeholder="ชื่อผู้ส่ง" value={formData.first_name} onChange={handleChange} required />
                    <input type="text" name="last_name" placeholder="นามสกุลผู้ส่ง" value={formData.last_name} onChange={handleChange} required />
                    <input type="tel" name="tel" placeholder="เบอร์ติดต่อผู้ส่ง" value={formData.tel} onChange={handleChange} required />
                    <h3 style={{fontWeight:'400',background:'#A9704D',color:'#FFF'}}>ข้อมูลผู้รับ</h3>
                    <input type="text" name="first_des" placeholder="ชื่อผู้รับ" value={formData.first_des} onChange={handleChange} required />
                    <input type="text" name="sur_des" placeholder="นามสกุลผู้รับ" value={formData.sur_des} onChange={handleChange} required />
                    <input type="date" name="delivery_date" min={today} value={formData.delivery_date} onChange={handleChange} required />
                    <select name="delivery_time" value={formData.delivery_time} onChange={handleChange} required>
                        <option value="">เลือกเวลา</option>
                        {timeOptions.map((time, index) => (
                            <option key={index} value={time}>{time}</option>
                        ))}
                    </select>
                    <input type="tel" name="tel_des" placeholder="เบอร์ติดต่อผู้รับ" value={formData.tel_des} onChange={handleChange} required />
                    <input type="text" name="deliveryAddress" placeholder="ที่อยู่สำหรับการจัดส่ง" value={formData.deliveryAddress} onChange={handleChange} required />
                    <input type="text" name="postalCode" placeholder="รหัสไปรษณีย์" value={formData.postalCode} onChange={handleChange} required />
                    <select name="province" value={formData.province} onChange={handleChange} required>
                        <option value="">เลือกจังหวัด</option>
                        {provinces.map((province, index) => (
                            <option key={index} value={province}>{province}</option>
                        ))}
                    </select>
                    <input type="text" name="district" placeholder="เขต/อำเภอ" value={formData.district} onChange={handleChange} required />
                    <textarea name="cardMessage" placeholder="ข้อความในการ์ด" value={formData.cardMessage} onChange={handleChange}></textarea>
                </form>
            </div>
            {/* Right Column: Basket Items */}
            <div className="flower-info" style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '20px', maxHeight: '600px', overflowY: 'auto' }}>
                <h2>ดอกไม้ในตะกร้า</h2>
                {basketItems.length > 0 ? (
                    basketItems.map(item => (
                        <div key={item.id} className="flower-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <img src={item.image_url} alt={item.name_flower} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                            <div style={{ flex: 1 }}>
                                <h4>{item.name_flower}</h4>
                                <p>จำนวน : {item.count}</p>
                                <p>ราคา : {item.price} บาท</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>ไม่มีดอกไม้ในตะกร้า</p>
                )}
                <h3 style={{ marginTop: '20px' }}>ราคารวม: {totalPrice} บาท</h3>
                <div className="subtract-box-order" onClick={handleSubmit} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '80px', height: '80px', background: '#8d5941', borderRadius: '20px', padding: '10px', color: '#f5ece4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <GrCaretNext style={{ fontSize: '48px' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoClient;
