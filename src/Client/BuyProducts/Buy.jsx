import React, { useState, useEffect } from "react";
import "./Buy.css";

const Buy = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/products'); 
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleReset = () => {
        setSearchTerm("");
    };

    const filteredProducts = products.filter(product =>
        product.name_flower.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="buy-container">
            <div className="header">
                <input
                    type="text"
                    placeholder=""
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-bar"
                />
                <button onClick={handleReset} className="reset-button">ล้าง</button>
            </div>

            <div className="content">
                <div className="sidebar">
                    <h3>หมวดหมู่</h3>
                    <div className="category">
                        {/* Checkbox categories */}
                        {["ดอกไม้รับปริญญา", "ดอกไม้สำหรับคนพิเศษ", "ดอกไม้แสดงความยินดี", "ดอกไม้วันแม่", "ดอกไม้ไว้อาลัย", "ดอกไม้วันเกิด"].map(category => (
                            <label key={category}>
                                <input type="checkbox" /> {category}
                            </label>
                        ))}
                    </div>
                    <h4>ช่วงราคา</h4>
                    <div className="price-range">
                        {/* Checkbox price ranges */}
                        {["2,000 - 2,500 บาท", "2,500 - 3,000 บาท", "3,000 - 3,500 บาท", "3,500 - 4,000 บาท", "4,000 - 4,500 บาท"].map(range => (
                            <label key={range}>
                                <input type="checkbox" /> {range}
                            </label>
                        ))}
                    </div>
                    <h4>ชนิดดอกไม้</h4>
                    <div className="type-flower">
                        {/* Checkbox price ranges */}
                        {["ดอกไฮเดรนเยีย", "ดอกทิลลิป", "ดอกทานตะวัน", "ดอกกุหลาบ", "ดอกเดซี่"].map(range => (
                            <label key={range}>
                                <input type="checkbox" /> {range}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="product-list">
                    <h2>รายการแนะนำ</h2>
                    <div className="products">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                <h3>{product.name_flower}</h3>
                                <p>{product.price} บาท</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Buy;