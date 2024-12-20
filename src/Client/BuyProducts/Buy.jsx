import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase auth functions
import axios from "axios";
import "./Buy.css";
import DB from '../../config';
import Swal from 'sweetalert2';


const Buy = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showOtherFlowers, setShowOtherFlowers] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [selectedPriceRanges, setSelectedPriceRanges] = useState(new Set());
    const [addToCartSuccess, setAddToCartSuccess] = useState(false); 
    const [addToCartError, setAddToCartError] = useState(''); 
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email); 
            } else {
                setUserEmail(null); 
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${DB}product`);
                console.log('Fetched products:', response.data);
                setProducts(response.data);

                const uniqueCategories = Array.from(new Set(response.data.map(product => product.type)));
                setCategories(uniqueCategories);
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
        setSelectedCategories(new Set());
        setSelectedPriceRanges(new Set());
        setShowOtherFlowers(false);
    };

    const allowedFlowerNames = ["กุหลาบ", "ทานตะวัน", "ทิวลิป", "เดซี่", "ไฮเดรนเยีย"];

    const priceRanges = [
        { label: '0 - 200', min: 0, max: 200 },
        { label: '201 - 400', min: 201, max: 400 },
        { label: '401 - 600', min: 401, max: 600 },
        { label: '601 - 800', min: 601, max: 800 },
    ];

    const filteredProducts = products.filter(product => {
        const flowerName = product.name_flower || "";

        const matchesSearch = flowerName.includes(searchTerm) || allowedFlowerNames.some(allowed => flowerName.includes(allowed));
        const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(product.type);
        const matchesPriceRange = Array.from(selectedPriceRanges).every(range => {
            const { min, max } = priceRanges[parseInt(range)];
            return product.price >= min && product.price <= max;
        });
        const matchesFlowerType = showOtherFlowers || selectedCategories.has(flowerName) || allowedFlowerNames.some(allowed => flowerName.includes(allowed));

        return matchesSearch && matchesCategory && (selectedPriceRanges.size === 0 || matchesPriceRange) && matchesFlowerType;
    });

    const handleCheckboxChange = (setter, value) => {
        setter(prev => {
            const updatedSet = new Set(prev);
            if (updatedSet.has(value)) {
                updatedSet.delete(value);
            } else {
                updatedSet.add(value);
            }
            return updatedSet;
        });
    };

    const handleAddToCart = async (product) => {
        const dataToSend = {
            id: product.id,
            email: userEmail 
        };

        try {
            const response = await axios.post(`${DB}basket/add_cart`, dataToSend);
            console.log('Data sent to basket:', response.data);
            setAddToCartSuccess(true); 
            setAddToCartError(''); 
            Swal.fire("Saved!", "", "success");
        } catch (error) {
            console.error('Error sending data to basket:', error);
            setAddToCartError('เกิดข้อผิดพลาดในการเพิ่มสินค้าไปยังตะกร้า'); 
            setAddToCartSuccess(false); 
        }
    };

    return (
        <div className="buy-container">
            <div className="header">
                <input
                    type="text"
                    placeholder="ค้นหา"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-bar"
                />
                <button onClick={handleReset} className="reset-button">ล้าง</button>
            </div>

            <div className="content" style={{flexDirection:'row', alignItems:'flex-start'}}>
                <div className="sidebar">
                    <h3>หมวดหมู่</h3>
                    <div className="category">
                        {categories.map(category => (
                            <label key={category}>
                                <input
                                    type="checkbox"
                                    onChange={() => handleCheckboxChange(setSelectedCategories, category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                    <h4>ช่วงราคา</h4>
                    <div className="price-range">
                        {priceRanges.map((range, index) => (
                            <label key={range.label}>
                                <input
                                    type="checkbox"
                                    onChange={() => handleCheckboxChange(setSelectedPriceRanges, index)}
                                />
                                {range.label}
                            </label>
                        ))}
                    </div>
                    <h4>ชนิดดอกไม้</h4>
                    <div className="type-flower">
                        {allowedFlowerNames.map(flower => (
                            <label key={flower}>
                                <input
                                    type="checkbox"
                                    onChange={() => handleCheckboxChange(setSelectedCategories, flower)}
                                />
                                {flower}
                            </label>
                        ))}
                        <label>
                            <input
                                type="checkbox"
                                onChange={() => setShowOtherFlowers(!showOtherFlowers)}
                                checked={showOtherFlowers}
                            />
                            อื่นๆ
                        </label>
                    </div>
                </div>

                <div className="product-list">
                    <h2>รายการแนะนำ</h2>
                    <div className="products">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(({ _id, ...product }) => (
                                <div className="product-card" key={_id}>
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name_flower} />
                                    ) : (
                                        <div className="image-placeholder">ไม่มีรูปภาพ</div>
                                    )}
                                    <h3>{product.id} {product.name_flower}</h3>
                                    <p>{product.price} บาท</p> 
                                    <div className="add-to-cart-overlay">
                                        <div
                                            className="overlay-content"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            <i className="fas fa-shopping-cart"></i> 
                                            หยิบใส่ตะกร้า
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>ไม่พบสินค้าที่ตรงกับการค้นหา</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Buy;
