import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DB from '../../config';
import Swal from 'sweetalert2';
import './Payment_client.css';



const PaymentClient = () => {
    const location = useLocation();
    const navigate = useNavigate(); // ใช้ navigate สำหรับการเปลี่ยนหน้า
    const { submittedData, basketItems } = location.state || {};

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const handleConfirmPayment = async () => {
        try {
            const paymentDetails = { ...submittedData, payment: selectedPaymentMethod };
    
            // เพิ่ม name_flower จาก basketItems ลงใน paymentDetails
            paymentDetails.details_purchase = basketItems.map(item => item.name_flower);  // เก็บชื่อดอกไม้ทั้งหมดจากตะกร้า
    
            let paymentConfirmed = false;
    
            // ส่วนการตรวจสอบวิธีการชำระเงิน
            if (selectedPaymentMethod === 'credit') {
                const { value: cardNumber } = await Swal.fire({
                    title: 'กรุณากรอกเลขบัตรเครดิต',
                    input: 'text',
                    inputPlaceholder: 'กรอกเลขบัตรเครดิต',
                    showCancelButton: true,
                });
    
                if (cardNumber) {
                    paymentDetails.payment = 'Credit Card';
                    paymentDetails.payment_status = 'ชำระเงินแล้ว';
                    paymentConfirmed = true;
                    await Swal.fire('การชำระเงินสำเร็จ!', 'การชำระเงินผ่านบัตรเครดิตสำเร็จแล้ว', 'success');
                } else {
                    return;
                }
            }
    
            if (selectedPaymentMethod === 'promptPay') {
                const { value: qrCodeScanned } = await Swal.fire({
                    title: 'กรุณาสแกน QR โค้ดนี้เพื่อชำระเงิน',
                    imageUrl: 'https://via.placeholder.com/150?text=QR+Code', // Placeholder for the QR code
                    imageWidth: 150,
                    imageHeight: 150,
                    showCancelButton: true,
                });
    
                if (qrCodeScanned) {
                    paymentDetails.payment = 'QR Prompt Pay';
                    paymentDetails.payment_status = 'ชำระเงินแล้ว';
                    paymentConfirmed = true;
                    await Swal.fire('การชำระเงินสำเร็จ!', 'การชำระเงินผ่าน QR โค้ดสำเร็จแล้ว', 'success');
                } else {
                    return;
                }
            }
    
            if (selectedPaymentMethod === 'โอนผ่านบัญชีธนาคาร') {
                const { value: accountNumber } = await Swal.fire({
                    title: 'กรุณากรอกเลขบัญชีธนาคาร',
                    input: 'text',
                    inputPlaceholder: 'กรอกเลขบัญชีธนาคาร',
                    showCancelButton: true,
                });
    
                if (accountNumber) {
                    paymentDetails.payment = 'โอนผ่านบัญชีธนาคาร';
                    paymentDetails.payment_status = 'ชำระเงินแล้ว';
                    paymentConfirmed = true;
                    await Swal.fire('การชำระเงินสำเร็จ!', 'การชำระเงินผ่านบัญชีธนาคารสำเร็จแล้ว', 'success');
                } else {
                    return;
                }
            }
    
            if (selectedPaymentMethod === 'เก็บเงินปลายทาง') {
                paymentDetails.payment_status = 'รอดำเนินการ';
            }
    
            // Check if payment was confirmed before sending to the database
            if (paymentConfirmed || selectedPaymentMethod === 'เก็บเงินปลายทาง') {
                // ส่งข้อมูลการชำระเงินรวมทั้ง details_purchase
                await axios.post(`${DB}user/insert`, paymentDetails);
                const userEmail = submittedData.email;
    
                // ลบข้อมูลจากตะกร้าหลังจากบันทึกสำเร็จ
                await axios.delete(`${DB}basket/clear`, { data: { email: userEmail } });
    
                await Swal.fire({
                    title: 'การชำระเงินสำเร็จ!',
                    icon: 'success',
                    confirmButtonText: 'ตกลง',
                });
    
                // เปลี่ยนหน้าไปยัง /tracks
                navigate('/tracks');  // ไปที่หน้า /tracks เมื่อการชำระเงินสำเร็จ
            } else {
                await Swal.fire({
                    title: 'การชำระเงินล้มเหลว',
                    text: 'กรุณาลองใหม่อีกครั้ง',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                });
            }
    
        } catch (error) {
            console.error('Error submitting payment:', error);
            await Swal.fire({
                title: 'เกิดข้อผิดพลาดในการชำระเงิน',
                icon: 'error',
                confirmButtonText: 'ตกลง',
            });
        }
    }; 

    return (
        <div className="payment-content">
            <div className="payment-left-section">
                <div className="payment-section-title">วิธีการชำระเงิน</div>
                <div className="payment-options">
                    <label className="payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="credit"
                            checked={selectedPaymentMethod === 'credit'}
                            onChange={handlePaymentMethodChange}
                            className="payment-radio"
                        />
                        Credit Card
                    </label>
                    <label className="payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="promptPay"
                            checked={selectedPaymentMethod === 'promptPay'}
                            onChange={handlePaymentMethodChange}
                            className="payment-radio"
                        />
                        QR Prompt Pay
                    </label>
                    <label className="payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="โอนผ่านบัญชีธนาคาร"
                            checked={selectedPaymentMethod === 'โอนผ่านบัญชีธนาคาร'}
                            onChange={handlePaymentMethodChange}
                            className="payment-radio"
                        />
                        โอนผ่านบัญชีธนาคาร
                    </label>
                    <label className="payment-option">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="เก็บเงินปลายทาง"
                            checked={selectedPaymentMethod === 'เก็บเงินปลายทาง'}
                            onChange={handlePaymentMethodChange}
                            className="payment-radio"
                        />
                        เก็บเงินปลายทาง
                    </label>
                </div>
                <div className="additional-info-title">รายละเอียดการจัดส่ง</div>
                <div className="shipping-details">
                    <div className="detail-row">
                        <span>ข้อมูลผู้จัดส่ง</span>
                    </div>
                    <div className="detail-row">
                        <span>ชื่อ : {submittedData.first_name} {submittedData.last_name}</span>
                    </div>
                    <div className="detail-row">
                        <span>เบอร์ติดต่อ: {submittedData.tel}</span>
                    </div>
                    <div className="detail-row">
                        <span>ข้อมูลผู้รับ</span>
                    </div>
                    <div className="detail-row">
                        <span>ชื่อ: {submittedData.first_des} {submittedData.sur_des}</span>
                    </div>
                    <div className="detail-row">
                        <span>เบอร์ติดต่อ: {submittedData.tel_des}</span>
                    </div>
                    <div className="detail-row">
                        <span>ที่อยู่: {submittedData.address_des}</span>
                    </div>
                    <div className="detail-row">
                        <span>ข้อความในการ์ด: {submittedData.cardMessage}</span>
                    </div>
                </div>
            </div>

            <div className="payment-right-section">
                <div className="basket-item-card">
                    <div>
                        <h3>ดอกไม้ในตะกร้า:</h3>
                        {basketItems.map((item) => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <img
                                    src={item.image_url}
                                    alt={item.name_flower}
                                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                />
                                <div>
                                    <p>{item.name_flower}</p>
                                    <p>ราคา: {item.price} บาท</p>
                                </div>
                            </div>
                        ))}
                        <h3>ราคารวม: {submittedData.totalPrice} บาท</h3>
                    </div>
                </div>

                <div className="confirm-button-container">
                    <button className="confirm-button" onClick={handleConfirmPayment}>
                        ยืนยันการชำระเงิน
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentClient;
